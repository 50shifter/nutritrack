/**
 * Goals API — PostgreSQL Backend
 * 🔒 Fixed: Zod validation for all inputs
 */
import { NextResponse } from 'next/server';
import { init } from '@/lib/db';
import { getGoals, addGoal, updateGoal, deleteGoal } from '@/lib/repositories/goal-repo';
import { z } from 'zod';

const GoalSchema = z.object({
  name: z.string().min(1).max(200),
  targetAmount: z.number().positive(),
  currentAmount: z.number().nonnegative().default(0),
  deadline: z.string().nullable().optional(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
});

const IdParamSchema = z.object({ id: z.coerce.number().int().positive() });

const UserIdParamSchema = z.object({ userId: z.coerce.number().int().positive().default(1) });

export async function GET(request: Request) {
  try {
    await init();
    
    const parsed = UserIdParamSchema.safeParse(Object.fromEntries(
      new URL(request.url).searchParams.entries()
    ));
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Valid userId required' }, { status: 400 });
    }
    
    const goals = await getGoals(parsed.data.userId);
    return NextResponse.json(goals.rows);
  } catch (error) {
    console.error('[Goals API GET] Error:', error);
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
    const parsed = GoalSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid goal data', details: parsed.error.errors },
        { status: 400 }
      );
    }
    
    const { name, targetAmount, currentAmount, deadline } = parsed.data;
    const userId = body.userId ? parseInt(String(body.userId)) : 1;
    
    const result = await addGoal(userId, name, targetAmount, deadline);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('[Goals API POST] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await init();
    
    const parsedId = IdParamSchema.safeParse(Object.fromEntries(
      new URL(request.url).searchParams.entries()
    ));
    
    if (!parsedId.success) {
      return NextResponse.json({ error: 'Valid goal ID required' }, { status: 400 });
    }
    
    const body = await request.json();
    const parsed = GoalSchema.partial().safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid goal data', details: parsed.error.errors },
        { status: 400 }
      );
    }
    
    const result = await updateGoal(
      parsedId.data.id,
      parsed.data.name,
      parsed.data.targetAmount,
      parsed.data.currentAmount || 0,
      parsed.data.deadline
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('[Goals API PUT] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await init();
    
    const parsedId = IdParamSchema.safeParse(Object.fromEntries(
      new URL(request.url).searchParams.entries()
    ));
    
    if (!parsedId.success) {
      return NextResponse.json({ error: 'Valid goal ID required' }, { status: 400 });
    }
    
    const result = await deleteGoal(parsedId.data.id);
    return NextResponse.json(result.rows[0] || { id: parsedId.data.id });
  } catch (error) {
    console.error('[Goals API DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}