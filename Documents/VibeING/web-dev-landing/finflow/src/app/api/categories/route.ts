/**
 * Categories API — PostgreSQL Backend (Full CRUD)
 * 🔒 Fixed: Zod validation for all inputs
 */
import { NextResponse } from 'next/server';
import { init } from '@/lib/db';
import { 
  getAllCategories, 
  getCategoriesByType,
  createCategory,
  updateCategory,
  deleteCategory 
} from '@/lib/repositories/category-repo';
import { z } from 'zod';

const CategorySchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['income', 'expense']),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, 'Invalid color format').optional().default('#888888'),
  limitAmount: z.number().nonnegative().optional().nullable(),
});

const IdParamSchema = z.object({ id: z.coerce.number().int().positive() });

export async function GET(request: Request) {
  try {
    await init();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'income' | 'expense' | null
    
    const categories = type 
      ? await getCategoriesByType(type)
      : await getAllCategories();
    
    return NextResponse.json(categories.rows);
  } catch (error) {
    console.error('[Categories API GET] Error:', error);
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
    const parsed = CategorySchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid category data', details: parsed.error.errors },
        { status: 400 }
      );
    }
    
    const { name, type, color, limitAmount } = parsed.data;
    
    const result = await createCategory(name, type, color, limitAmount);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('[Categories API POST] Error:', error);
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
      return NextResponse.json({ error: 'Valid category ID required' }, { status: 400 });
    }
    
    const body = await request.json();
    const parsed = CategorySchema.partial().safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid category data', details: parsed.error.errors },
        { status: 400 }
      );
    }
    
    const { name, type, color, limitAmount } = parsed.data;
    const result = await updateCategory(parsedId.data.id, name, type, color, limitAmount);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('[Categories API PUT] Error:', error);
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
      return NextResponse.json({ error: 'Valid category ID required' }, { status: 400 });
    }
    
    const result = await deleteCategory(parsedId.data.id);
    return NextResponse.json(result.rows[0] || { id: parsedId.data.id });
  } catch (error) {
    console.error('[Categories API DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}