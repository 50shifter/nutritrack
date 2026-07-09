import { NextResponse } from "next/server";
import { MOCK_TRANSACTIONS, MONTHLY_DATA, PIE_DATA, WEEKLY_DATA, MOCK_CATEGORIES } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  let filteredTransactions = [...MOCK_TRANSACTIONS];
  if (startDate && endDate) {
    filteredTransactions = MOCK_TRANSACTIONS.filter(
      (t) => t.date >= startDate && t.date <= endDate
    );
  }

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const topCategories = MOCK_CATEGORIES.filter(c => c.type === 'expense')
    .map((c) => ({
      name: c.name,
      amount: filteredTransactions
        .filter((t) => t.category === c.name && t.type === "expense")
        .reduce((s, t) => s + t.amount, 0),
      color: c.color,
    }))
    .sort((a, b) => b.amount - a.amount);

  const budgetProgress = MOCK_CATEGORIES.filter(c => c.type === 'expense' && c.limit != null)
    .map((c) => {
      const spent = filteredTransactions
        .filter((t) => t.category === c.name && t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);
      return { name: c.name, current: spent, limit: c.limit!, color: c.color };
    })
    // Only include categories that have a defined limit
    .filter(b => b.limit > 0);

  const data = {
    balance: totalIncome - totalExpense,
    totalIncome,
    totalExpense,
    monthlyData: MONTHLY_DATA,
    pieData: PIE_DATA,
    weeklyData: WEEKLY_DATA,
    topCategories,
    budgetProgress,
  };

  return NextResponse.json(data);
}
