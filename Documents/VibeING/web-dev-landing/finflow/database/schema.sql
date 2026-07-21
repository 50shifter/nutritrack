-- ============================================
-- FinFlow PostgreSQL Schema
-- ============================================

-- Create database (run as superuser)
CREATE DATABASE vibeing_finflow;

-- Connect to the database
\c vibeing_finflow;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')),
  color TEXT,
  limit_amount DECIMAL(12,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Metrics events table
CREATE TABLE IF NOT EXISTS metrics_events (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  session_id TEXT NOT NULL,
  user_id INTEGER,
  page TEXT NOT NULL,
  referrer TEXT,
  properties TEXT DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_goals_user ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_metrics_name ON metrics_events(name);
CREATE INDEX IF NOT EXISTS idx_metrics_created ON metrics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_metrics_session ON metrics_events(session_id);

-- Insert default categories
INSERT INTO categories (name, type, color, limit_amount) VALUES
  ('Продукты', 'expense', '#ef4444', 30000),
  ('Транспорт', 'expense', '#f97316', 15000),
  ('Развлечения', 'expense', '#eab308', 10000),
  ('Здоровье', 'expense', '#22c55e', 5000),
  ('Образование', 'expense', '#06b6d4', 15000),
  ('Жильё', 'expense', '#3b82f6', 40000),
  ('Зарплата', 'income', '#10b981', NULL),
  ('Фриланс', 'income', '#8b5cf6', NULL),
  ('Инвестиции', 'income', '#6366f1', NULL)
ON CONFLICT DO NOTHING;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO vibeing;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO vibeing;