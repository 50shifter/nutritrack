-- FinFlow — Supabase SQL Schema
-- Run this in Supabase Dashboard → SQL Editor

-- =============================================
-- 1. Users (extension of Supabase auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  currency TEXT DEFAULT 'RUB',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 2. Categories
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '💰',
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  color TEXT DEFAULT '#34d399',
  limit NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 3. Transactions
-- =============================================
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 4. Goals
-- =============================================
CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target NUMERIC NOT NULL CHECK (target > 0),
  current NUMERIC DEFAULT 0 CHECK (current >= 0),
  deadline DATE NOT NULL,
  color TEXT DEFAULT '#34d399',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 5. Indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_goals_user ON goals(user_id);

-- =============================================
-- 6. Enable RLS (Row Level Security)
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 7. RLS Policies
-- =============================================

-- Users: can only see own data
CREATE POLICY "Users can see own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Transactions: only owner
CREATE POLICY "Users can manage own transactions" ON transactions
  FOR ALL USING (auth.uid() = user_id);

-- Goals: only owner
CREATE POLICY "Users can manage own goals" ON goals
  FOR ALL USING (auth.uid() = user_id);

-- Categories: everyone can read, only owner can write (shared categories)
CREATE POLICY "Anyone can read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own categories" ON categories
  FOR ALL USING (auth.uid() != ''::uuid);

-- =============================================
-- 8. Seed: Default Categories
-- =============================================
INSERT INTO categories (id, name, icon, type, color, limit) VALUES
  ('cat-income-1', 'Зарплата', '💰', 'income', '#34d399', NULL),
  ('cat-income-2', 'Фриланс', '💻', 'income', '#60a5fa', NULL),
  ('cat-income-3', 'Инвестиции', '📈', 'income', '#a78bfa', NULL),
  ('cat-income-4', 'Кэшбэк', '🎁', 'income', '#fbbf24', NULL),
  ('cat-income-5', 'Бонус', '🏆', 'income', '#f472b6', NULL),
  ('cat-expense-1', 'Еда', '🍽️', 'expense', '#f87171', 20000),
  ('cat-expense-2', 'Жильё', '🏠', 'expense', '#fb923c', 50000),
  ('cat-expense-3', 'Транспорт', '🚗', 'expense', '#60a5fa', 10000),
  ('cat-expense-4', 'Развлечения', '🎮', 'expense', '#a78bfa', 5000),
  ('cat-expense-5', 'Здоровье', '💊', 'expense', '#34d399', 8000),
  ('cat-expense-6', 'Путешествия', '✈️', 'expense', '#38bdf8', 100000),
  ('cat-expense-7', 'Покупки', '🛍️', 'expense', '#f472b6', 15000),
  ('cat-expense-8', 'Подарки', '🎁', 'expense', '#fb923c', 10000),
  ('cat-expense-9', 'Образование', '📚', 'expense', '#60a5fa', 10000);

-- =============================================
-- 9. Triggers: updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_transactions_updated_at
  BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_goals_updated_at
  BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
