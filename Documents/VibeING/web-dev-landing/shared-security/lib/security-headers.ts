/**
 * Security Headers — универсальный модуль для всех 6 проектов VibeING.
 * Защищает от: XSS, Clickjacking, MIME sniffing, Referrer leaks, 
 * Content Spoofing, и других заголовочных уязвимостей.
 * 
 * Применение: вызвать в middleware.ts каждого проекта.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';

// ─── Конфигурация ──────────────────────────────────────────────

const isProduction = process.env.NODE_ENV === 'production';

export interface SecurityHeadersConfig {
  /** Разрешённые домены для скриптов */
  allowedScriptDomains?: string[];
  /** Разрешённые домены для стилей */
  allowedStyleDomains?: string[];
  /** Разрешённые домены для изображений */
  allowedImageDomains?: string[];
  /** Разрешённые домены для API вызовов */
  allowedApiDomains?: string[];
}

// ─── Генератор nonce ──────────────────────────────────────────

function generateNonce(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

// ─── Security Headers (X-*) ───────────────────────────────────

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  // X-XSS-Protection: deprecated in modern browsers, CSP is sufficient
  // Keeping '0' would be worse than omitting — removed entirely.
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
};

// ─── CSP Header builder ────────────────────────────────────────

function buildCSP(nonce: string, config?: SecurityHeadersConfig): string {
  const scriptSrc = [
    `'self'`,
    `'nonce-${nonce}'`,
    `'strict-dynamic'`,
  ];

  if (config?.allowedScriptDomains) {
    scriptSrc.push(...config.allowedScriptDomains.map(d => `https://${d}`));
  }

  // Добавляем 'unsafe-inline' для style-src только если нужно (Tailwind dev mode и т.д.)
  const styleSrc = [
    `'self'`,
    `'unsafe-inline'`, // Нужно для framer-motion, Tailwind dev, inline styles
  ];

  if (config?.allowedStyleDomains) {
    styleSrc.push(...config.allowedStyleDomains.map(d => `https://${d}`));
  }

  const imgSrc = [
    `'self'`,
    'data:',
    'blob:',
  ];

  if (config?.allowedImageDomains) {
    imgSrc.push(...config.allowedImageDomains.map(d => `https://${d}`));
  }

  // Для dev mode — разрешаем localhost и hot-reload
  const connectSrc = [
    `'self'`,
    'http://localhost:*',
    'ws://localhost:*',
    'wss://localhost:*',
  ];

  if (config?.allowedApiDomains) {
    connectSrc.push(...config.allowedApiDomains.map(d => `https://${d}`));
  }
  
  // Supabase для FinFlow
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && supabaseUrl.startsWith('http')) {
    const supabaseHost = new URL(supabaseUrl).host;
    connectSrc.push(`https://${supabaseHost}`);
  }

  return [
    `default-src 'self'`,
    `script-src ${scriptSrc.join(' ')}`,
    `style-src ${styleSrc.join(' ')}`,
    `img-src ${imgSrc.join(' ')}`,
    `font-src 'self' data:`,
    `connect-src ${connectSrc.join(' ')}`,
    `media-src 'self' blob:`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self' https://*, http://localhost:*`,
    `upgrade-insecure-requests`,
  ].join('; ');
}

// ─── HSTS Header (только production) ──────────────────────────

function buildHSTS(): string | null {
  if (!isProduction) return null;
  // max-age=1 год, включая поддомены, preload-ready
  return 'max-age=31536000; includeSubDomains; preload';
}

// ─── Main function: Apply all security headers ────────────────

export function applySecurityHeaders(
  request: NextRequest,
  config?: SecurityHeadersConfig
): NextResponse {
  const response = NextResponse.next();
  
  // Nonce для CSP (inline scripts)
  const nonce = generateNonce();
  
  // Store nonce for use in components
  response.headers.set('X-Content-Security-Policy-Nonce', nonce);

  // Content Security Policy
  response.headers.set('Content-Security-Policy', buildCSP(nonce, config));

  // Standard security headers
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  // HSTS — только production
  const hsts = buildHSTS();
  if (hsts) {
    response.headers.set('Strict-Transport-Security', hsts);
  }

  return response;
}

// ─── Для API routes (NextResponse.json) ────────────────────────

export function applySecurityHeadersToJSON(
  request: NextRequest,
  body: Record<string, unknown>,
  config?: SecurityHeadersConfig
): NextResponse {
  const nonce = generateNonce();
  
  return NextResponse.json(body, {
    headers: {
      'Content-Security-Policy': buildCSP(nonce, config),
      ...SECURITY_HEADERS,
      ...(isProduction ? {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      } : {}),
    },
  });
}

// ─── Middleware factory — для вставки в каждый проект's middleware.ts ─

export function createSecurityMiddleware(config?: SecurityHeadersConfig) {
  return async function securityMiddleware(request: NextRequest): Promise<NextResponse> {
    // Skip health checks and static assets
    if (request.nextUrl.pathname.startsWith('/health')) {
      return NextResponse.next();
    }
    
    if (request.nextUrl.pathname.match(/\.(ico|png|jpg|svg|css|js|mjs|woff2)$/i)) {
      return NextResponse.next();
    }

    // Для API routes — применяем к response body
    const isAPI = request.nextUrl.pathname.startsWith('/api/');
    
    if (isAPI) {
      // Middleware не может напрямую модифицировать JSON response, 
      // поэтому используем applySecurityHeaders и обрабатываем в route.ts
      return applySecurityHeaders(request, config);
    }

    return applySecurityHeaders(request, config);
  };
}
