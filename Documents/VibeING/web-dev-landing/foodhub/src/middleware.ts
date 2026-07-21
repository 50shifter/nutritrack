/**
 * Security Middleware — FoodHub (3004)
 * Security headers + rate limiting for write operations.
 */

import { applySecurityHeaders, authRateLimit, getRateLimitKey } from '@shared';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(request: NextRequest) {
  const response = applySecurityHeaders(request);
  
  // Rate limiting для API write endpoints
  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      const key = getRateLimitKey(request, 'api-write');
      const result = authRateLimit(key, 'api-write');
      
      if (!result.allowed) {
        return NextResponse.json(
          { error: 'Too many requests', retryAfter: result.retryAfter },
          { status: 429 }
        );
      }
      response.headers.set('X-RateLimit-Remaining', String(result.remainingAttempts));
    }
  }
  
  return response;
}

export const config = {
  matcher: ['/api/:path*', '/checkout/:path*'],
};