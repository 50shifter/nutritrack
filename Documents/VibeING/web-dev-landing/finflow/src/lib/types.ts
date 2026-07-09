// Shared types for FinFlow

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  lucideIcon?: string;
  type: "income" | "expense";
  color: string;
  limit?: number;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  profit: number;
}

export interface WeeklyData {
  day: string;
  income: number;
  expense: number;
}

export interface UserSettings {
  name: string;
  email: string;
  currency: "RUB" | "USD" | "EUR";
  notifications: {
    email: boolean;
    push: boolean;
    spendingReminders: boolean;
  };
}

export type Page = "dashboard" | "transactions" | "categories" | "goals" | "settings";

// Transaction list items for sorting/filtering
export interface TransactionListItem extends Transaction {
  categoryIcon?: string;
}

// Pie chart data
export interface PieItem {
  name: string;
  value: number;
  color: string;
}

// CSV export interface
export interface CSVExportData {
  headers: string[];
  rows: string[][];
}

export interface BudgetProgress {
  name: string;
  current: number;
  limit: number;
  color: string;
}
