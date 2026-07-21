/**
 * Dashboard Stats API — PostgreSQL Backend
 * Provides aggregated data for dashboard charts
 * 🔒 Fixed: Input validation, parameterized queries
 */
import { NextResponse } from 'next/server';
import { init, query } from '@/lib/db';
import { z } from 'zod';

const DashboardQuerySchema = z.object({
  userId: z.coerce.number().int().positive().default(1),
  days: z.coerce.number().int().min(1).max(365).default(30),
});

export async function GET(request: Request) {
  try {
    await init();
    
    const parsed = DashboardQuerySchema.safeParse(Object.fromEntries(
      new URL(request.url).searchParams.entries()
    ));
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: parsed.error.errors },
        { status: 400 }
      );
    }
    
    const { userId, days } = parsed.data;
    
    // Validate days range
    if (days < 1 || days > 365) {
      return NextResponse.json({ error: 'Days must be between 1 and 365' }, { status: 400 });
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // Get transactions within date range
    const txResult = await query(
      `SELECT * FROM transactions 
       WHERE user_id = $1 AND date >= $2 
       ORDER BY date DESC`,
      [userId, cutoffDate.toISOString().split('T')[0]]
    );
    
    const transactions = txResult.rows;
    
    // Calculate totals
    const income = transactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
    
    const expense = transactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
    
    // Monthly aggregation (last 12 months)
    const monthlyMap = new Map<string, { income: number; expense: number }>();
    const allTxResult = await query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    );
    
    allTxResult.rows.forEach((t: any) => {
      const dateStr = typeof t.date === 'string' ? t.date : new Date(t.date).toISOString().split('T')[0];
      const month = dateStr.slice(0, 7); // YYYY-MM
      if (!monthlyMap.has(month)) monthlyMap.set(month, { income: 0, expense: 0 });
      const m = monthlyMap.get(month)!;
      if (t.type === 'income') m.income += Number(t.amount);
      else m.expense += Number(t.amount);
    });
    
    const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    
    const monthlyData = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, data]) => {
        const m = new Date(month + '-01');
        return {
          month: monthNames[m.getMonth()],
          income: data.income,
          expense: data.expense,
          profit: data.income - data.expense,
        };
      });
    
    // Pie data - expenses by category
    const expenseByCategory = transactions
      .filter((t: any) => t.type === 'expense')
      .reduce((acc: any, t: any) => {
        const cat = t.category || 'Прочее';
        acc[cat] = (acc[cat] || 0) + Number(t.amount);
        return acc;
      }, {});
    
    const COLORS: Record<string, string> = {
      'Еда': '#f87171', 'Жилье': '#60a5fa', 'Транспорт': '#a78bfa',
      'Развлечения': '#fb923c', 'Здоровье': '#34d399', 'Путешествия': '#f472b6',
      'Покупки': '#38bdf8', 'Подарки': '#fbbf24', 'Образование': '#818cf8',
      'Зарплата': '#34d399', 'Фриланс': '#60a5fa', 'Инвестиции': '#a78bfa',
      'Прочее': '#888888',
    };
    
    const pieData = Object.entries(expenseByCategory)
      .map(([name, value]) => ({
        name,
        value: Math.round(value as number),
        color: COLORS[name as keyof typeof COLORS] || '#888888',
      }))
      .filter((d) => d.value > 0);
    
    // Top categories
    const topCategories = [...pieData]
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
    
    // Weekly data (last 7 days)
    const weeklyMap = new Map<string, { income: number; expense: number }>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];
      const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      weeklyMap.set(dayNames[d.getDay()], { income: 0, expense: 0 });
    }
    
    transactions.forEach((t: any) => {
      const d = new Date(t.date);
      const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      const dayName = dayNames[d.getDay()];
      if (weeklyMap.has(dayName)) {
        if (t.type === 'income') weeklyMap.get(dayName)!.income += Number(t.amount);
        else weeklyMap.get(dayName)!.expense += Number(t.amount);
      }
    });
    
    const weeklyData = Array.from(weeklyMap.entries())
      .map(([day, data]) => ({ day, ...data }));
    
    // Budget progress - by category
    const budgetProgress = topCategories.map((c) => ({
      name: c.name,
      current: c.value,
      limit: 50000, // Simplified - real implementation would use category limits
      color: c.color,
    }));
    
    return NextResponse.json({
      balance: income - expense,
      totalIncome: income,
      totalExpense: expense,
      transactionsCount: transactions.length,
      monthlyData,
      pieData,
      weeklyData,
      topCategories,
      budgetProgress,
    });
  } catch (error) {
    console.error('[Dashboard API GET] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}