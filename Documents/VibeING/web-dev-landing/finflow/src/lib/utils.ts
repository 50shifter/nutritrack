// Shared utilities

export function formatCurrency(amount: number, currency: string = "RUB"): string {
  const symbols: Record<string, string> = { RUB: "₽", USD: "$", EUR: "€" };
  const symbol = symbols[currency] || "₽";
  return `${amount.toLocaleString("ru-RU")} ${symbol}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export function calculatePercentage(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min((current / target) * 100, 100);
}

export function calculateChange(current: number, previous: number): { value: number; percent: string; direction: "up" | "down" } {
  if (previous === 0) return { value: 0, percent: "0%", direction: "up" };
  const change = current - previous;
  const percent = Math.abs(Math.round((change / previous) * 100)).toString();
  return { value: change, percent: `${percent}%`, direction: change >= 0 ? "up" : "down" };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Time range selector labels
export interface TimeRange {
  label: string;
  days: number;
}

export const TIME_RANGES: TimeRange[] = [
  { label: "7 дней", days: 7 },
  { label: "30 дней", days: 30 },
  { label: "90 дней", days: 90 },
  { label: "Всё время", days: 0 },
];

export function formatPercent(value: number): string {
  return `${value}%`;
}
