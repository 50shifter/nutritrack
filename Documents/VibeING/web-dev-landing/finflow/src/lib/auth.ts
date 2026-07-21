/**
 * Auth - Secure Local Stub
 * 🔒 Uses httpOnly cookie instead of localStorage for session storage.
 * In production, replace with NextAuth.js v5.
 */

import { cookies } from 'next/headers';

export async function auth() {
  // Production: check httpOnly cookie
  if (typeof window === 'undefined') {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('finflow_session');
    if (sessionCookie) {
      try {
        const user = JSON.parse(sessionCookie.value);
        return { user, session: 'active' };
      } catch {
        return null;
      }
    }
    return null;
  }
  
  // Client-side fallback — check cookie via document.cookie
  // Note: httpOnly cookies are NOT accessible from JS, so this is dev-only
  if (document.cookie.includes('finflow_session=')) {
    return { user: null, session: 'active' };
  }
  
  return null;
}