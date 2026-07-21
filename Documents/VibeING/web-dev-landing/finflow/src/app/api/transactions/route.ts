/**
 * Transactions API — PostgreSQL Backend
 * 🔒 Fixed: Added Zod validation for input sanitization.
 */
import { NextResponse } from 'next/server';
import { init } from '@/lib/db';
import { 
  getTransactions, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction,
  getStats 
} from '@/lib/repositories/transaction-repo';
import { z } from 'zod';

const TransactionSchema = z.object({
  userId: z.coerce.number().int().positive(),
  amount: z.coerce.number().positive(),
  type: z.enum(['income', 'expense']),
  category: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  date: z.coerce.date(),
});

const PaginationSchema = z.object({
  userId: z.coerce.number().int().positive().default(1),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(request: Request) {
  try {
    await init();
    
    const parsed = PaginationSchema.safeParse(Object.fromEntries(
      new URL(request.url).searchParams.entries()
    ));
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: parsed.error.errors },
        { status: 400 }
      );
    }
    
    const { userId, page, perPage } = parsed.data;
    
    const transactions = await getTransactions(parseInt(userId));
    
    // Sort by date descending
    const sorted = transactions.rows
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const total = sorted.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const paginated = sorted.slice(start, start + perPage);
    
    // Get stats
    const stats = await getStats(parseInt(userId));
    
    return NextResponse.json({
      data: paginated,
      stats: stats,
      pagination: { page, perPage, total, totalPages }
    });
  } catch (error) {
    console.error('[Transactions API GET] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await init();
    
    const body = await request.json();
    const parsed = TransactionSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid transaction data', details: parsed.error.errors },
        { status: 400 }
      );
    }
    
    const { userId, amount, type, category, description, date } = parsed.data;
    
    const result = await addTransaction(
      userId,
      amount,
      type,
      category || null,
      description || null,
      date.toISOString().split('T')[0]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('[Transactions API POST] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await init();
    
    const body = await request.json();
    const parsed = z.object({
      id: z.coerce.number().int().positive(),
      amount: z.coerce.number().positive().optional(),
      type: z.enum(['income', 'expense']).optional(),
      category: z.string().max(100).optional(),
      description: z.string().max(500).optional(),
    }).safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid update data', details: parsed.error.errors },
        { status: 400 }
      );
    }
    
    const { id, amount, type, category, description } = parsed.data;
    
    if (!amount && !type && !category && !description) {
      return NextResponse.json(
        { error: 'At least one field to update required' },
        { status: 400 }
      );
    }
    
    const result = await updateTransaction(
      id,
      amount ?? 0,
      type ?? 'expense',
      category ?? null,
      description ?? null
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('[Transactions API PUT] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await init();
    
    const { searchParams } = new URL(request.url);
    const parsed = z.object({ id: z.coerce.number().int().positive() }).safeParse(
      Object.fromEntries(searchParams.entries())
    );
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Valid transaction ID required' },
        { status: 400 }
      );
    }
    
    const result = await deleteTransaction(parsed.data.id);
    return NextResponse.json(result.rows[0] || { id: parsed.data.id });
  } catch (error) {
    console.error('[Transactions API DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}