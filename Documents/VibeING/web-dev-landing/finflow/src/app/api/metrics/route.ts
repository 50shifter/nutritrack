/**
 * Metrics API Endpoint — PostgreSQL Backend
 * 🔒 Fixed: TypeScript types, Zod validation, proper IP handling.
 */

import { NextResponse } from 'next/server';
import { init } from '@/lib/db';
import { addEvent, getEventsByType, getEventsByDate, getFunnelStats } from '@/lib/repositories/metrics-repo';
import { z } from 'zod';

// Rate limiting (in-memory — fine for single-instance dev/prod)
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

// Get real IP (trusted: behind Nginx reverse proxy)
function getIP(req: Request): string {
  return req.headers.get('x-real-ip')
    || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || 'unknown';
}

// Validate event input
const EventInputSchema = z.object({
  name: z.string().max(100),
  sessionId: z.string().max(200),
  page: z.string().max(500),
  timestamp: z.string(),
  userId: z.string().max(100).optional(),
  referrer: z.string().max(1000).optional(),
  props: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

export async function POST(request: Request) {
  try {
    await init();
    
    const ip = getIP(request);

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded (100 req/min)' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { events } = body;

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: 'Events array required' },
        { status: 400 }
      );
    }

    // Validate each event with Zod
    const validEvents = events
      .map(e => EventInputSchema.safeParse(e))
      .filter(r => r.success)
      .map(r => (r as { success: true; data: z.infer<typeof EventInputSchema> }).data);
    
    if (validEvents.length === 0) {
      return NextResponse.json({ received: 0, stored: true });
    }

    // Store events
    for (const event of validEvents) {
      await addEvent(
        event.name,
        event.sessionId,
        event.userId || null,
        event.page,
        event.referrer || null,
        event.props || {}
      );
    }

    return NextResponse.json({ received: validEvents.length, stored: true });

  } catch (error) {
    console.error('[Metrics API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await init();
    
    const eventsByType = await getEventsByType();
    const funnelStats = await getFunnelStats();
    const last30Days = await getEventsByDate(30);

    return NextResponse.json({
      eventsByType: eventsByType.rows,
      funnelStats,
      last30Days,
    });
  } catch (error) {
    console.error('[Metrics API GET] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}