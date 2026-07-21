/**
 * Security Middleware — MediCare (3002)
 * Применяет security headers, CSRF protection, rate limiting.
 */

import { auth } from "@/lib/auth";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { applySecurityHeaders, authRateLimit, getRateLimitKey } from '@shared';

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // ─── Security Headers (для всех запросов) ──────────────
  const response = applySecurityHeaders(request);

  // ─── Rate Limiting для API write endpoints ─────────────
  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
    if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
      const key = getRateLimitKey(request, 'api-write');
      const result = authRateLimit(key, 'api-write');

      if (!result.allowed) {
        return NextResponse.json(
          { error: 'Too many requests', retryAfter: result.retryAfter },
          { status: 429 }
        );
      }

      // Добавить заголовок с remaining attempts для клиента
      response.headers.set('X-RateLimit-Remaining', String(result.remainingAttempts));
    }
  }

  // ─── Protected routes ──────────────────────────────────
  const protectedPaths = ["/profile", "/records"];
  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));

  if (isProtectedPath && !session) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === "/auth/signin" || pathname === "/auth/signup") && session) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  response.headers.set('X-RateLimit-Remaining', '100');
  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/records/:path*", "/auth/signin", "/auth/signup"],
};
