// Mock data seed — used in development when no backend is connected
import type { Transaction, Category, Goal, MonthlyData, PieItem, WeeklyData } from "./types";

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "1", date: "2025-01-15", description: "Зарплата", amount: 85000, type: "income", category: "Зарплата" },
  { id: "2", date: "2025-01-14", description: "Продукты", amount: 4500, type: "expense", category: "Еда" },
  { id: "3", date: "2025-01-13", description: "Аренда", amount: 35000, type: "expense", category: "Жилье" },
  { id: "4", date: "2025-01-12", description: "Фриланс", amount: 25000, type: "income", category: "Фриланс" },
  { id: "5", date: "2025-01-11", description: "Транспорт", amount: 1500, type: "expense", category: "Транспорт" },
  { id: "6", date: "2025-01-10", description: "Кофе", amount: 350, type: "expense", category: "Еда" },
  { id: "7", date: "2025-01-09", description: "Подписка", amount: 990, type: "expense", category: "Развлечения" },
  { id: "8", date: "2025-01-08", description: "Кэшбэк", amount: 1200, type: "income", category: "Кэшбэк" },
  { id: "9", date: "2025-01-07", description: "Аптека", amount: 2300, type: "expense", category: "Здоровье" },
  { id: "10", date: "2025-01-06", description: "Отпуск", amount: 50000, type: "expense", category: "Путешествия" },
  { id: "11", date: "2025-01-05", description: "Инвестиции", amount: 15000, type: "income", category: "Инвестиции" },
  { id: "12", date: "2025-01-04", description: "Одежда", amount: 8500, type: "expense", category: "Покупки" },
  { id: "13", date: "2025-01-03", description: "Ресторан", amount: 3200, type: "expense", category: "Еда" },
  { id: "14", date: "2025-01-02", description: "Бонус", amount: 5000, type: "income", category: "Бонус" },
  { id: "15", date: "2025-01-01", description: "Новогодний подарок", amount: 7000, type: "expense", category: "Подарки" },
  { id: "16", date: "2024-12-31", description: "Зарплата", amount: 85000, type: "income", category: "Зарплата" },
  { id: "17", date: "2024-12-30", description: "Книги", amount: 1800, type: "expense", category: "Образование" },
  { id: "18", date: "2024-12-29", description: "Спортзал", amount: 3000, type: "expense", category: "Здоровье" },
  { id: "19", date: "2024-12-28", description: "Такси", amount: 650, type: "expense", category: "Транспорт" },
  { id: "20", date: "2024-12-27", description: "Сайлент-спикинг", amount: 12000, type: "income", category: "Фриланс" },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: "1", name: "Зарплата", icon: "💰", type: "income", color: "#34d399", limit: undefined },
  { id: "2", name: "Фриланс", icon: "💻", type: "income", color: "#60a5fa", limit: undefined },
  { id: "3", name: "Инвестиции", icon: "📈", type: "income", color: "#a78bfa", limit: undefined },
  { id: "4", name: "Кэшбэк", icon: "🎁", type: "income", color: "#fbbf24", limit: undefined },
  { id: "5", name: "Бонус", icon: "🏆", type: "income", color: "#f472b6", limit: undefined },
  { id: "6", name: "Еда", icon: "🍽️", type: "expense", color: "#f87171", limit: 20000 },
  { id: "7", name: "Жилье", icon: "🏠", type: "expense", color: "#fb923c", limit: 50000 },
  { id: "8", name: "Транспорт", icon: "🚗", type: "expense", color: "#60a5fa", limit: 10000 },
  { id: "9", name: "Развлечения", icon: "🎮", type: "expense", color: "#a78bfa", limit: 5000 },
  { id: "10", name: "Здоровье", icon: "💊", type: "expense", color: "#34d399", limit: 8000 },
  { id: "11", name: "Путешествия", icon: "✈️", type: "expense", color: "#38bdf8", limit: 100000 },
  { id: "12", name: "Покупки", icon: "🛍️", type: "expense", color: "#f472b6", limit: 15000 },
  { id: "13", name: "Подарки", icon: "🎁", type: "expense", color: "#fb923c", limit: 10000 },
  { id: "14", name: "Образование", icon: "📚", type: "expense", color: "#60a5fa", limit: 10000 },
];

export const MOCK_GOALS: Goal[] = [
  { id: "1", name: "Отпуск в Турции", target: 150000, current: 98000, deadline: "2025-06-01", color: "#34d399" },
  { id: "2", name: "Новый MacBook", target: 250000, current: 180000, deadline: "2025-03-15", color: "#60a5fa" },
  { id: "3", name: "Подушка безопасности", target: 500000, current: 230000, deadline: "2025-12-31", color: "#a78bfa" },
];

export const MONTHLY_DATA: MonthlyData[] = [
  { month: "Авг", income: 95000, expense: 42000, profit: 53000 },
  { month: "Сен", income: 88000, expense: 38000, profit: 50000 },
  { month: "Окт", income: 102000, expense: 55000, profit: 47000 },
  { month: "Ноя", income: 91000, expense: 47000, profit: 44000 },
  { month: "Дек", income: 120000, expense: 72000, profit: 48000 },
  { month: "Янв", income: 110000, expense: 52000, profit: 58000 },
];

export const PIE_DATA: PieItem[] = MOCK_CATEGORIES
  .filter((c) => c.type === "expense")
  .map((c) => {
    const total = MOCK_TRANSACTIONS
      .filter((t) => t.type === "expense" && t.category === c.name)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: c.name, value: total, color: c.color };
  })
  .filter((d) => d.value > 0);

export const WEEKLY_DATA: WeeklyData[] = [
  { day: "Пн", income: 12000, expense: 5000 },
  { day: "Вт", income: 8000, expense: 7000 },
  { day: "Ср", income: 15000, expense: 6000 },
  { day: "Чт", income: 10000, expense: 8000 },
  { day: "Пт", income: 18000, expense: 9000 },
  { day: "Сб", income: 5000, expense: 12000 },
  { day: "Вс", income: 3000, expense: 4000 },
];

