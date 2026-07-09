import { PRODUCTS, REVIEWS, CATEGORIES } from "./mock-data";

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("ru-RU")} ₽`;
}

export function calculatePercentage(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min((current / target) * 100, 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

export function getStarRating(rating: number) {
  return Math.round(rating);
}

export function getProductReviews(productId: number) {
  return REVIEWS.filter((r) => r.productId === productId);
}

export { PRODUCTS, REVIEWS, CATEGORIES };
