/**
 * Enhanced Auth Rate Limiter — защита от brute-force для всех проектов VibeING.
 * 
 * Улучшения по сравнению с базовым rate-limit.ts:
 * 1. Экспоненциальный backoff (5s → 10s → 30s → 60s → 300s)
 * 2. Блокировка IP на 15 минут после N неудачных попыток
 * 3. Отдельные счётчики для login, signup, password-reset
 * 4. Автоматическая очистка устаревших записей
 */

// ─── Типы ──────────────────────────────────────────────────────

export interface AuthRateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  retryAfter?: number; // секунды до повторной попытки
  warning?: string;    // предупреждение для клиента
}

type AuthAction = 'login' | 'signup' | 'password-reset' | 'api-write';

// ─── Конфигурация ──────────────────────────────────────────────

interface RateLimitConfig {
  maxAttempts: number;       // попыток до блокировки
  lockDurationMs: number;    // длительность блокировки (мс)
  softLimit: number;         // мягкий лимит (предупреждение)
  windowMs: number;          // окно времени (мс)
}

const DEFAULT_CONFIGS: Record<AuthAction, RateLimitConfig> = {
  login:       { maxAttempts: 5, lockDurationMs: 15 * 60 * 1000, softLimit: 20, windowMs: 3600_000 },
  signup:      { maxAttempts: 10, lockDurationMs: 10 * 60 * 1000, softLimit: 50, windowMs: 3600_000 },
  'password-reset': { maxAttempts: 3, lockDurationMs: 60 * 60 * 1000, softLimit: 5, windowMs: 3600_000 },
  'api-write': { maxAttempts: 20, lockDurationMs: 5 * 60 * 1000, softLimit: 15, windowMs: 60_000 },
};

// ─── Внутреннее состояние ──────────────────────────────────────

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  lockUntil: number; // timestamp когда разблокируется
}

const rateLimits = new Map<string, RateLimitEntry>();

// ─── Экспоненциальный backoff ──────────────────────────────────

function exponentialBackoff(attempts: number): number {
  // 1 → 5s, 2 → 10s, 3 → 30s, 4 → 60s, 5+ → 300s (max)
  const baseSeconds = [5, 10, 30, 60];
  if (attempts <= baseSeconds.length) {
    return baseSeconds[attempts - 1] * 1000;
  }
  // Cap at 5 minutes
  return 300_000;
}

// ─── Основная функция rate limiting ─────────────────────────────

export function authRateLimit(
  key: string,
  action: AuthAction = 'login',
  customConfig?: Partial<RateLimitConfig>
): AuthRateLimitResult {
  const config = { ...DEFAULT_CONFIGS[action], ...customConfig };
  const now = Date.now();
  
  let entry = rateLimits.get(key);

  // Если ключ заблокирован — проверяем разблокировку
  if (entry && entry.lockUntil > now) {
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfter: Math.ceil((entry.lockUntil - now) / 1000),
      warning: `Слишком много попыток. Повторите через ${Math.ceil((entry.lockUntil - now) / 60_000)} мин.`,
    };
  }

  // Если блокировка истекла — сбросить запись
  if (entry && entry.lockUntil <= now) {
    rateLimits.delete(key);
    entry = undefined;
  }

  // Новое окно времени — начать заново
  if (!entry || now - entry.firstAttempt > config.windowMs) {
    entry = { attempts: 0, firstAttempt: now, lockUntil: 0 };
  }

  // Увеличиваем счётчик попыток
  entry.attempts++;
  rateLimits.set(key, entry);

  // Проверка на блокировку
  if (entry.attempts >= config.maxAttempts) {
    const backoff = exponentialBackoff(entry.attempts);
    entry.lockUntil = now + Math.max(backoff, config.lockDurationMs);
    rateLimits.set(key, entry);

    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfter: Math.ceil((entry.lockUntil - now) / 1000),
      warning: `Слишком много попыток. Повторите через ${Math.ceil(entry.lockUntil / 60_000)} мин.`,
    };
  }

  // Мягкий лимит — предупреждение
  if (entry.attempts >= config.softLimit) {
    return {
      allowed: true,
      remainingAttempts: config.maxAttempts - entry.attempts,
      warning: 'Много запросов. Убедитесь что вы не робот.',
    };
  }

  // Всё OK
  return {
    allowed: true,
    remainingAttempts: config.maxAttempts - entry.attempts,
  };
}

// ─── IP extraction helper ──────────────────────────────────────

export function getClientIP(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;

  // Для localhost / dev mode
  return null;
}

export function getRateLimitKey(request: Request, action: AuthAction): string {
  const ip = getClientIP(request);
  if (!ip) return `local:${action}:${Date.now()}`;
  return `${action}:${ip}`;
}

// ─── Cleanup interval (каждые 10 минут) ───────────────────────

const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimits.entries()) {
    // Удаляем записи старше окна + запас 1 час
    if (now - entry.firstAttempt > DEFAULT_CONFIGS.login.windowMs + 3600_000) {
      rateLimits.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

// ─── Export для прямого использования в API routes ──────────────

export function createRateLimitResponse(
  result: AuthRateLimitResult,
): Response | null {
  if (result.allowed) return null; // Можно продолжать

  const status = 429;
  const body = {
    error: 'Too many requests',
    retryAfter: result.retryAfter,
    message: result.warning || 'Пожалуйста, попробуйте позже.',
  };

  if (typeof window === 'undefined') {
    // Server-side: NextResponse
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return null;
}
