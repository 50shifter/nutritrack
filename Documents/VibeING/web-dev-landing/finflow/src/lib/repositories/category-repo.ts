/**
 * Repository for Categories — PostgreSQL
 * Converted from .js → .ts with full type safety.
 */

import { query } from '../db';

export async function getAllCategories() {
  return query<{
    id: number;
    name: string;
    type: 'income' | 'expense';
    color: string;
    limit_amount: number | null;
  }>('SELECT * FROM categories ORDER BY type, name');
}

export async function getCategoriesByType(type: string) {
  return query<{
    id: number;
    name: string;
    type: string;
    color: string;
    limit_amount: number | null;
  }>('SELECT * FROM categories WHERE type = $1 ORDER BY name', [type]);
}

export async function createCategory(
  name: string,
  type: string,
  color: string,
  limitAmount: number | null
) {
  return query<{ id: number; name: string; type: string; color: string; limit_amount: number | null }>(
    'INSERT INTO categories (name, type, color, limit_amount) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, type, color, limitAmount]
  );
}

export async function updateCategory(
  id: number,
  name: string,
  type: string,
  color: string,
  limitAmount: number | null
) {
  return query<{ id: number; name: string; type: string; color: string; limit_amount: number | null }>(
    'UPDATE categories SET name = $1, type = $2, color = $3, limit_amount = $4 WHERE id = $5 RETURNING *',
    [name, type, color, limitAmount, id]
  );
}

export async function deleteCategory(id: number) {
  return query<{ id: number; name: string; type: string; color: string; limit_amount: number | null }>(
    'DELETE FROM categories WHERE id = $1 RETURNING *',
    [id]
  );
}