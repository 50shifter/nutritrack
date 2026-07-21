/**
 * NutriTrack — Utility Functions
 * FIX (M1): Удалены неиспользуемые функции
 */

export function formatNumber(num, decimals = 1) {
  return Number(num).toFixed(decimals);
}

export function isValidNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export function parseNumber(value, fallback = 0) {
  const num = parseFloat(value);
  return isNaN(num) ? fallback : num;
}

export function getToday() {
  return new Date().toISOString().split('T')[0];
}

export function getDateDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}