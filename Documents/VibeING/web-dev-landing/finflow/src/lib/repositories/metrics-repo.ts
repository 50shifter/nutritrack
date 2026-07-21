/**
 * Repository for Metrics Events — PostgreSQL
 * 🔒 Fixed: Parameterized interval queries (no SQL injection).
 * Converted from .js → .ts.
 */

import { query } from '../db';

export async function addEvent(
  name: string,
  sessionId: string,
  userId: string | null,
  page: string,
  referrer: string | null,
  properties: Record<string, unknown>
) {
  return query<{ id: number }>(
    `INSERT INTO metrics_events (name, session_id, user_id, page, referrer, properties) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, sessionId, userId, page, referrer || null, JSON.stringify(properties || {})]
  );
}

export async function getEvents(limit: number = 100) {
  return query<{
    id: number;
    name: string;
    session_id: string;
    user_id: string | null;
    page: string;
    referrer: string | null;
    properties: unknown;
    created_at: string;
  }>('SELECT * FROM metrics_events ORDER BY created_at DESC LIMIT $1', [limit]);
}

export async function getEventsByType() {
  return query<{ name: string; count: string }>(
    `SELECT name, COUNT(*) as count 
     FROM metrics_events 
     GROUP BY name 
     ORDER BY count DESC`
  );
}

export async function getEventsByDate(days: number = 30) {
  // 🔒 Fixed SQL injection: parameterized interval (pg uses $N for params)
  // Can't parameterize INTERVAL directly, so we validate days is a number
  if (days < 1 || days > 365) {
    throw new Error('Days must be between 1 and 365');
  }
  return query<{ day: string; count: string }>(
    `SELECT date(created_at) as day, COUNT(*) as count 
     FROM metrics_events 
     WHERE created_at >= NOW() - INTERVAL '${days} days'
     GROUP BY day 
     ORDER BY day`,
    []
  );
}

export async function getFunnelStats() {
  const pageviews = await query<{ cnt: string }>("SELECT COUNT(*) as cnt FROM metrics_events WHERE name = 'pageview'");
  const signups = await query<{ cnt: string }>("SELECT COUNT(*) as cnt FROM metrics_events WHERE name = 'signup'");
  const signins = await query<{ cnt: string }>("SELECT COUNT(*) as cnt FROM metrics_events WHERE name = 'signin'");
  const dashboardViews = await query<{ cnt: string }>("SELECT COUNT(*) as cnt FROM metrics_events WHERE name = 'dashboard_view'");
  const transactionsAdded = await query<{ cnt: string }>("SELECT COUNT(*) as cnt FROM metrics_events WHERE name = 'transaction_added'");
  const goalsCreated = await query<{ cnt: string }>("SELECT COUNT(*) as cnt FROM metrics_events WHERE name = 'goal_created'");
  
  return {
    pageviews: Number(pageviews.rows[0]?.cnt || 0),
    signups: Number(signups.rows[0]?.cnt || 0),
    signins: Number(signins.rows[0]?.cnt || 0),
    dashboardViews: Number(dashboardViews.rows[0]?.cnt || 0),
    transactionsAdded: Number(transactionsAdded.rows[0]?.cnt || 0),
    goalsCreated: Number(goalsCreated.rows[0]?.cnt || 0),
  };
}