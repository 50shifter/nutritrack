-- ============================================
-- FinFlow Metrics Schema
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Metrics events table
CREATE TABLE IF NOT EXISTS metrics_events (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  user_id TEXT,
  session_id TEXT NOT NULL,
  page TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_metrics_events_name ON metrics_events(name);
CREATE INDEX IF NOT EXISTS idx_metrics_events_session ON metrics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_metrics_events_user ON metrics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_metrics_events_created ON metrics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_metrics_events_page ON metrics_events(page);

-- Row Level Security (RLS)
ALTER TABLE metrics_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert (for client-side tracking)
CREATE POLICY "Allow metric event insertion"
  ON metrics_events
  FOR INSERT
  TO anon, public
  WITH CHECK (true);

-- Only authenticated service role can read
CREATE POLICY "Service role read access"
  ON metrics_events
  FOR SELECT
  TO service_role
  USING (true);

-- ============================================
-- Aggregated metrics views (materialized)
-- ============================================

-- Daily aggregates
CREATE OR REPLACE VIEW v_metrics_daily AS
SELECT
  DATE(created_at) as date,
  name as event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT user_id) as unique_users
FROM metrics_events
GROUP BY DATE(created_at), name
ORDER BY date DESC, name;

-- Funnel conversion view
CREATE OR REPLACE VIEW v_metrics_funnel AS
SELECT
  (SELECT COUNT(DISTINCT session_id) FROM metrics_events WHERE name = 'pageview' AND created_at >= NOW() - INTERVAL '30 days') as pageviews,
  (SELECT COUNT(DISTINCT session_id) FROM metrics_events WHERE name = 'signup' AND created_at >= NOW() - INTERVAL '30 days') as signups,
  (SELECT COUNT(DISTINCT session_id) FROM metrics_events WHERE name = 'signin' AND created_at >= NOW() - INTERVAL '30 days') as signins,
  (SELECT COUNT(DISTINCT session_id) FROM metrics_events WHERE name = 'dashboard_view' AND created_at >= NOW() - INTERVAL '30 days') as dashboard_views,
  (SELECT COUNT(*) FROM metrics_events WHERE name = 'transaction_added' AND created_at >= NOW() - INTERVAL '30 days') as transactions_added,
  (SELECT COUNT(*) FROM metrics_events WHERE name = 'goal_created' AND created_at >= NOW() - INTERVAL '30 days') as goals_created;

-- Top pages view
CREATE OR REPLACE VIEW v_metrics_top_pages AS
SELECT
  page,
  COUNT(*) as views,
  COUNT(DISTINCT session_id) as unique_visitors,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(LENGTH(user_agent)) as avg_session_duration
FROM metrics_events
WHERE name = 'pageview'
GROUP BY page
ORDER BY views DESC
LIMIT 20;

-- ============================================
-- Cleanup policy (optional)
-- Keep last 90 days of raw data
-- ============================================
-- CREATE OR REPLACE FUNCTION cleanup_old_metrics()
-- RETURNS VOID AS $$
-- BEGIN
--   DELETE FROM metrics_events WHERE created_at < NOW() - INTERVAL '90 days';
-- END;
-- $$ LANGUAGE plpgsql;