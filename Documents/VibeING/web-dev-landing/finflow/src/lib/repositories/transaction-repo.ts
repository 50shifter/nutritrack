/**
 * Transaction Repository — abstracts mock ↔ real data.
 *
 * Usage:
 *   import { getTransactionRepo } from "@/lib/repositories/transaction-repo";
 *   const repo = getTransactionRepo();
 *   const data = await repo.list(userId);
 *
 * Switch mode in .env.local:
 *   USE_MOCK_DATA=true  → mock data
 *   (default or false)  → real Supabase
 */

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string;
  type: "income" | "expense";
  userId: string;
}

export interface TransactionRepository {
  list(userId: string, opts?: { page?: number; perPage?: number }): Promise<{ data: Transaction[]; total: number }>;
  create(data: Omit<Transaction, "id" | "userId">): Promise<Transaction>;
  update(id: string, data: Partial<Transaction>): Promise<Transaction>;
  delete(id: string): Promise<boolean>;
}

/* ═══════════════════════════════════════════════════════════════ */
/* MOCK IMPLEMENTATION                                            */
/* ═══════════════════════════════════════════════════════════════ */

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "mock-1",
    amount: 150000,
    currency: "RUB",
    category: "salary",
    description: "Зарплата июнь 2026",
    date: "2026-06-30T00:00:00Z",
    type: "income",
    userId: "user-1",
  },
  {
    id: "mock-2",
    amount: 5000,
    currency: "RUB",
    category: "food",
    description: "Продукты",
    date: "2026-06-28T00:00:00Z",
    type: "expense",
    userId: "user-1",
  },
  {
    id: "mock-3",
    amount: 20000,
    currency: "RUB",
    category: "transport",
    description: "Аренда авто",
    date: "2026-06-25T00:00:00Z",
    type: "expense",
    userId: "user-1",
  },
];

class MockTransactionRepository implements TransactionRepository {
  async list(userId: string, opts?: { page?: number; perPage?: number }): Promise<{ data: Transaction[]; total: number }> {
    const perPage = opts?.perPage ?? 20;
    const page = opts?.page ?? 1;
    const filtered = MOCK_TRANSACTIONS.filter((t) => t.userId === userId);
    const start = (page - 1) * perPage;
    return {
      data: filtered.slice(start, start + perPage),
      total: filtered.length,
    };
  }

  async create(data: Omit<Transaction, "id" | "userId">): Promise<Transaction> {
    const newTx: Transaction = { ...data, id: `mock-${Date.now()}`, userId: "mock-user" };
    MOCK_TRANSACTIONS.push(newTx);
    return newTx;
  }

  async update(id: string, data: Partial<Transaction>): Promise<Transaction> {
    const idx = MOCK_TRANSACTIONS.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error(`Transaction ${id} not found`);
    MOCK_TRANSACTIONS[idx] = { ...MOCK_TRANSACTIONS[idx], ...data };
    return MOCK_TRANSACTIONS[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = MOCK_TRANSACTIONS.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    MOCK_TRANSACTIONS.splice(idx, 1);
    return true;
  }
}

/* ═══════════════════════════════════════════════════════════════ */
/* SUPABASE IMPLEMENTATION (production)                           */
/* Placeholder — implement when Supabase is configured            */
/* ═══════════════════════════════════════════════════════════════ */

class SupabaseTransactionRepository implements TransactionRepository {
  // TODO: Implement with actual Supabase client
  async list(userId: string): Promise<{ data: Transaction[]; total: number }> {
    throw new Error("Supabase not configured. Set USE_MOCK_DATA=true in .env.local");
  }
  async create(data: Omit<Transaction, "id" | "userId">): Promise<Transaction> {
    throw new Error("Supabase not configured");
  }
  async update(id: string, data: Partial<Transaction>): Promise<Transaction> {
    throw new Error("Supabase not configured");
  }
  async delete(id: string): Promise<boolean> {
    throw new Error("Supabase not configured");
  }
}

/* ═══════════════════════════════════════════════════════════════ */
/* FACTORY                                                        */
/* ═══════════════════════════════════════════════════════════════ */

export function getTransactionRepo(): TransactionRepository {
  if (process.env.USE_MOCK_DATA === "true") {
    return new MockTransactionRepository();
  }
  return new SupabaseTransactionRepository();
}
