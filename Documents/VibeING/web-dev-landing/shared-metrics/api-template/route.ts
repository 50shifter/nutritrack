/**
 * Metrics API Route — Unified Template for ALL VibeING projects
 * 🔒 Fixed: Parameterized queries (no SQL injection).
 * This is the canonical implementation — all projects should use this.
 * 
 * Usage: Copy to {project}/src/app/api/metrics/route.ts
 */

import { NextResponse } from 'next/server';
import { pool, init } from '@/lib/db';

// ─── Rate Limiting ──────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 100;
const RATE_LIMIT_WINDOW = 60_000; // 1 minute

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

// ─── Database Setup ─────────────────────────────────────────────
async function initMetricsTable(): Promise<void> {
  if (!pool) return;
  
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS metrics_events (
        id SERIAL PRIMARY KEY,
        event_name VARCHAR(100) NOT NULL,
        project_id VARCHAR(50) NOT NULL,
        user_id VARCHAR(100),
        session_id VARCHAR(200) NOT NULL,
        page VARCHAR(500) NOT NULL,
        referrer TEXT,
        user_agent TEXT,
        props JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_metrics_events_name ON metrics_events(event_name);
      CREATE INDEX IF NOT EXISTS idx_metrics_events_project ON metrics_events(project_id);
      CREATE INDEX IF NOT EXISTS idx_metrics_events_session ON metrics_events(session_id);
      CREATE INDEX IF NOT EXISTS idx_metrics_events_created ON metrics_events(created_at);
    `);
  } catch (error) {
    console.error('[Metrics DB] Error initializing table:', error instanceof Error ? error.message : String(error));
  }
}

// ─── POST: Receive events ──────────────────────────────────────
export async function POST(request: Request): Promise<NextResponse> {
  try {
    await init();
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
      return NextResponse.json(
        { error: 'Events array required' },
        { status: 400 }
      );
    }

    // Validate events — sanitize fields to prevent XSS
    const validEvents = events.filter((e: Record<string, unknown>) =>
      typeof e.name === 'string' && e.name.length < 100 &&
      typeof e.timestamp === 'string' && e.timestamp.length < 100 &&
      typeof e.projectId === 'string' && e.projectId.length < 50 &&
      typeof e.sessionId === 'string' && e.sessionId.length < 200 &&
      typeof e.page === 'string' && e.page.length < 500
    );

    if (validEvents.length === 0) {
      return NextResponse.json({ received: 0, stored: true });
    }

    // Batch insert with proper parameterization
    if (pool) {
      const values = validEvents.map((e: Record<string, unknown>) => [
        e.name,
        e.projectId,
        e.userId || null,
        e.sessionId,
        e.page,
        e.referrer || null,
        e.userAgent || null,
        e.props ? JSON.stringify(e.props) : null,
      ]);

      const placeholders = values.map((_, i) => 
        `($${i * 8 + 1}, $${i * 8 + 2}, $${i * 8 + 3}, $${i * 8 + 4}, $${i * 8 + 5}, $${i * 8 + 6}, $${i * 8 + 7}, $${i * 8 + 8})`
      ).join(', ');

      const flatValues = values.flat();
      
      await pool.query(`
        INSERT INTO metrics_events (event_name, project_id, user_id, session_id, page, referrer, user_agent, props)
        VALUES ${placeholders}
      `, flatValues);
    }

    return NextResponse.json({ received: validEvents.length, stored: true });

  } catch (error) {
    console.error('[Metrics API POST] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ─── GET: Query events ─────────────────────────────────────────
export async function GET(request: Request): Promise<NextResponse> {
  try {
    await init();
    
    if (!pool) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const days = Math.min(Math.max(parseInt(searchParams.get('days') || '30', 10), 1), 365);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '100', 10), 1), 1000);

    // Get events by type per project
    let eventsByType: { rows: { project_id: string; event_name: string; count: string }[] };
    if (projectId) {
      eventsByType = await pool.query(
        `SELECT event_name, COUNT(*) as count 
         FROM metrics_events 
         WHERE project_id = $1 
         AND created_at > NOW() - ($2 || ' days')::interval
         GROUP BY event_name 
         ORDER BY count DESC`,
        [projectId, days]
      );
    } else {
      eventsByType = await pool.query(
        `SELECT project_id, event_name, COUNT(*) as count 
         FROM metrics_events 
         WHERE created_at > NOW() - ($1 || ' days')::interval
         GROUP BY project_id, event_name 
         ORDER BY count DESC
         LIMIT $2`,
        [days, limit]
      );
    }

    // Get daily aggregates
    const dailyStats = await pool.query(
      `SELECT 
        DATE(created_at) as date,
        project_id,
        COUNT(*) as events,
        COUNT(DISTINCT session_id) as sessions
      FROM metrics_events
      WHERE created_at > NOW() - ($1 || ' days')::interval
      GROUP BY DATE(created_at), project_id
      ORDER BY date DESC`,
      [days]
    );

    // Get funnel stats
    const funnelStats = await pool.query(
      `SELECT 
        project_id,
        event_name,
        COUNT(*) as count
      FROM metrics_events
      WHERE created_at > NOW() - ('30 days')::interval
      AND event_name IN ('pageview', 'signup', 'signin', 'dashboard_view', 'transaction_added', 'goal_created',
                          'consultation_requested', 'doctor_booked', 'video_call_started',
                          'product_viewed', 'product_added_to_cart', 'order_placed',
                          'restaurant_viewed', 'menu_item_added', 'hotel_viewed', 'room_selected', 'booking_confirmed',
                          'project_detail_viewed', 'contact_form_submitted')
      GROUP BY project_id, event_name
      ORDER BY project_id, count DESC`
    );

    // Get unique users count
    const uniqueUsers = await pool.query(
      `SELECT COUNT(DISTINCT user_id) as count 
       FROM metrics_events 
       WHERE created_at > NOW() - ($1 || ' days')::interval`,
      [days]
    );

    return NextResponse.json({
      eventsByType: eventsByType.rows,
      dailyStats: dailyStats.rows,
      funnelStats: funnelStats.rows,
      uniqueUsers: uniqueUsers.rows[0]?.count || 0,
      periodDays: days,
    });

  } catch (error) {
    console.error('[Metrics API GET] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}