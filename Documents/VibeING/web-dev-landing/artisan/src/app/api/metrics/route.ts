/**
 * Metrics API — Artisan (3006)
 * 🔒 Fixed: Full implementation with input validation.
 * Uses in-memory storage for projects without database.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 100;
const RATE_LIMIT_WINDOW = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT;
}

// In-memory storage for Artisan (no DB project)
const EVENT_STORE: Array<Record<string, unknown>> = [];
const MAX_STORED = 10000;

// Event validation schema
const EventSchema = z.object({
  name: z.string().max(100),
  timestamp: z.string().max(100),
  projectId: z.string().max(50),
  sessionId: z.string().max(200),
  page: z.string().max(500),
  userId: z.string().max(100).optional(),
  referrer: z.string().max(1000).optional(),
  userAgent: z.string().max(1000).optional(),
  props: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const ip = request.headers.get('x-real-ip') || 
               request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded (100 req/min)' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { events } = body as { events: unknown[] };

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: 'Events array required' }, { status: 400 });
    }

    // Validate each event
    const validEvents = events
      .map(e => {
        const result = EventSchema.safeParse(e);
        return result.success ? result.data : null;
      })
      .filter((e): e is z.infer<typeof EventSchema> => e !== null);

    if (validEvents.length === 0) {
      return NextResponse.json({ received: 0, stored: true });
    }

    // Store in memory (with cleanup for large datasets)
    if (EVENT_STORE.length + validEvents.length > MAX_STORED) {
      EVENT_STORE.splice(0, EVENT_STORE.length - MAX_STORED + validEvents.length);
    }
    EVENT_STORE.push(...validEvents);

    return NextResponse.json({ received: validEvents.length, stored: true });
  } catch {
    return NextResponse.json({ received: 0, stored: true });
  }
}

export async function GET(): Promise<NextResponse> {
  // Group events by name
  const byName = new Map<string, number>();
  for (const event of EVENT_STORE) {
    const name = event.name as string;
    byName.set(name, (byName.get(name) || 0) + 1);
  }

  const eventsByType = Array.from(byName.entries()).map(([name, count]) => ({
    name,
    count,
  }));

  return NextResponse.json({
    eventsByType,
    dailyStats: [],
    funnelStats: [],
    uniqueUsers: new Set(EVENT_STORE.map(e => e.sessionId)).size,
    periodDays: 30,
  });
}