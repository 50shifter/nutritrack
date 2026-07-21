/**
 * Security Middleware — FinFlow (3001)
 * Финансовые данные требуют усиленной защиты.
 * Uses shared-security module for all security headers.
 */

import { auth } from "@/lib/auth";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { applySecurityHeaders } from '@shared';

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // ─── Security Headers ──────────────────────────────────
  const response = applySecurityHeaders(request);

  // ─── Rate Limiting для login/signup endpoints ──────────
  if (pathname.startsWith('/api/auth/') || pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup')) {
    const key = getRateLimitKey(request, 'login');
    const result = authRateLimit(key, 'login');

    if (!result.allowed) {
      return NextResponse.json(
        { 
          error: 'Слишком много попыток входа', 
          retryAfter: result.retryAfter,
          message: result.warning || null 
        },
        { status: 429 }
      );
    }

    response.headers.set('X-RateLimit-Remaining', String(result.remainingAttempts));
    
    // Добавляем заголовок с предупреждением если нужно
    if (result.warning) {
      response.headers.set('X-RateLimit-Warning', result.warning);
    }
  }

  // ─── Protected routes ──────────────────────────────────
  const protectedPaths = ["/dashboard", "/transactions", "/goals", "/categories"];
  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));

  if (isProtectedPath && !session) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === "/auth/signin" || pathname === "/auth/signup") && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  response.headers.set('X-RateLimit-Remaining', '100');
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/transactions/:path*", "/goals/:path*", 
            "/categories/:path*", "/auth/signin", "/auth/signup"],
};
