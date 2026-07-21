/**
 * PostgreSQL Database Connection — FinFlow
 * 🔒 No hardcoded credentials — all from environment variables.
 */

import { Pool } from 'pg';

// ─── Require env vars at startup (fail-fast) ───────────────────
function getEnv(name: string, fallback?: string): string {
  const val = process.env[name];
  if (val === undefined || val === '') {
    if (fallback !== undefined) {
      console.warn(`⚠️  ${name} not set, using fallback: ${fallback}`);
      return fallback;
    }
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return val;
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: getEnv('DB_NAME', 'vibeing_finflow'),
  user: getEnv('DB_USER', 'vibeing'),
  password: getEnv('DB_PASSWORD'), // 🔒 No fallback — must be set
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err: Error) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

export function query<T = any>(text: string, params?: unknown[]): Promise<{ rows: T[] }> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production') {
      console.log(`  ↳ Query executed in ${duration}ms`);
    }
    return result;
  } catch (error) {
    console.error('❌ Query error:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

export async function init(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    console.log('✅ PostgreSQL initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize PostgreSQL:', error instanceof Error ? error.message : String(error));
    console.log('   Make sure PostgreSQL is running on localhost:5432');
    console.log('   And that DB_NAME, DB_USER, DB_PASSWORD are set');
    return false;
  }
}

export { pool };
export type { QueryResult } from 'pg';