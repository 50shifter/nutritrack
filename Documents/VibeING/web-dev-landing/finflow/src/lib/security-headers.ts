/**
 * Security Headers - Local Stub
 * Temporary implementation until shared-security is properly linked
 */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function applySecurityHeaders(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  
  // Basic security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '0');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:;");
  
  return response;
}