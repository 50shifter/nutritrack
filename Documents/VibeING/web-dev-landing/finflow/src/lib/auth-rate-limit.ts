/**
 * Auth Rate Limit - Local Stub
 * Temporary implementation until shared-security is properly linked
 */

interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  retryAfter?: number;
  warning?: string;
}

// Simple in-memory rate limiter
const attempts = new Map<string, number[]>();

function getRateLimitKey(request: any, type: string): string {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  return `${type}:${ip}`;
}

function authRateLimit(key: string, type: string): RateLimitResult {
  const maxAttempts = 5;
  const windowMs = 15 * 60 * 1000; // 15 minutes
  
  const now = Date.now();
  const currentAttempts = attempts.get(key) || [];
  
  // Filter out old attempts
  const recentAttempts = currentAttempts.filter(t => now - t < windowMs);
  attempts.set(key, recentAttempts);
  
  const remaining = maxAttempts - recentAttempts.length;
  
  if (remaining <= 0) {
    const oldest = recentAttempts[0];
    const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfter,
      warning: 'Попытка снова через ' + retryAfter + ' секунд',
    };
  }
  
  recentAttempts.push(now);
  
  return {
    allowed: true,
    remainingAttempts: remaining - 1,
    warning: remaining <= 2 ? 'Осталось мало попыток' : undefined,
  };
}

export { getRateLimitKey, authRateLimit };