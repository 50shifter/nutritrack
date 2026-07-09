/**
 * Rate limiter — in-memory, per-key sliding window.
 * Use as a helper in API routes to throttle requests per client IP.
 *
 * Usage:
 *   const { allowed, remaining } = rateLimit(`${action}:${ip}`);
 *   if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 */

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 100; // requests per window
const WINDOW_MS = 60_000; // 1 minute

export function rateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimits.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}

/**
 * Clean up expired entries every 5 minutes to prevent memory leaks.
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimits.entries()) {
    if (now > entry.resetAt) {
      rateLimits.delete(key);
    }
  }
}, 5 * 60 * 1000);
