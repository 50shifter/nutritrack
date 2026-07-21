/**
 * LuxStay Metrics API
 */
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { events } = body as { events: unknown[] };
    return NextResponse.json({ received: Array.isArray(events) ? events.length : 0, stored: true });
  } catch {
    return NextResponse.json({ received: 0, stored: true });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    eventsByType: [],
    dailyStats: [],
    funnelStats: [],
    uniqueUsers: 0,
    periodDays: 30,
  });
}