/**
 * Repository for Transactions — PostgreSQL
 * Converted from .js → .ts with full type safety.
 */

import { query } from '../db';

export async function getTransactions(userId: number) {
  return query<{
    id: number;
    user_id: number;
    amount: number;
    type: string;
    category: string | null;
    description: string | null;
    date: string;
  }>('SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC', [userId]);
}

export async function addTransaction(
  userId: number,
  amount: number,
  type: string,
  category: string | null,
  description: string | null,
  date: string
) {
  return query<{ id: number; user_id: number; amount: number; type: string; category: string | null; description: string | null; date: string }>(
    `INSERT INTO transactions (user_id, amount, type, category, description, date) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, amount, type, category, description, date]
  );
}

export async function updateTransaction(
  id: number,
  amount: number,
  type: string,
  category: string | null,
  description: string | null
) {
  return query<{ id: number; user_id: number; amount: number; type: string; category: string | null; description: string | null; date: string }>(
    `UPDATE transactions SET amount = $1, type = $2, category = $3, description = $4 
     WHERE id = $5 RETURNING *`,
    [amount, type, category, description, id]
  );
}

export async function deleteTransaction(id: number) {
  return query<{ id: number }>(
    'DELETE FROM transactions WHERE id = $1 RETURNING *',
    [id]
  );
}

export async function getStats(userId: number) {
  const income = await query<{ total: string }>(
    'SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND type = $2',
    [userId, 'income']
  );
  
  const expense = await query<{ total: string }>(
    'SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND type = $2',
    [userId, 'expense']
  );
  
  return {
    income: Number(income.rows[0]?.total || 0),
    expense: Number(expense.rows[0]?.total || 0),
    balance: Number(income.rows[0]?.total || 0) - Number(expense.rows[0]?.total || 0)
  };
}