/**
 * Repository for Goals — PostgreSQL
 * Converted from .js → .ts with full type safety.
 */

import { query } from '../db';

export async function getGoals(userId: number) {
  return query<{
    id: number;
    user_id: number;
    name: string;
    target_amount: number;
    current_amount: number;
    deadline: string | null;
    color: string | null;
    created_at: string;
  }>('SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
}

export async function addGoal(
  userId: number,
  name: string,
  targetAmount: number,
  deadline: string | null
) {
  return query<{ id: number; user_id: number; name: string; target_amount: number; current_amount: number; deadline: string | null; color: string | null }>(
    'INSERT INTO goals (user_id, name, target_amount, deadline) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, name, targetAmount, deadline || null]
  );
}

export async function updateGoal(
  id: number,
  name: string,
  targetAmount: number,
  currentAmount: number,
  deadline: string | null
) {
  return query<{ id: number; user_id: number; name: string; target_amount: number; current_amount: number; deadline: string | null; color: string | null }>(
    'UPDATE goals SET name = $1, target_amount = $2, current_amount = $3, deadline = $4 WHERE id = $5 RETURNING *',
    [name, targetAmount, currentAmount, deadline, id]
  );
}

export async function deleteGoal(id: number) {
  return query<{ id: number }>(
    'DELETE FROM goals WHERE id = $1 RETURNING *',
    [id]
  );
}