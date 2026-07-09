const CART_KEY = "foodhub-cart";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  restaurant: string;
  restaurantId?: number;
}

/**
 * Safe localStorage wrapper — returns null if localStorage unavailable (SSR, private mode).
 */
function safeStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    localStorage.getItem(CART_KEY); // will throw if not available
    return localStorage;
  } catch {
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════════ */
/* LOAD / SAVE                                                    */
/* ═══════════════════════════════════════════════════════════════ */

export function loadCart(): CartItem[] {
  const storage = safeStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  const storage = safeStorage();
  if (!storage) return;
  try {
    storage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    // localStorage full — ignore silently
  }
}

/* ═══════════════════════════════════════════════════════════════ */
/* CROSS-TAB SYNC                                                 */
/* Listen for storage events from other tabs/windows.             */
/* ═══════════════════════════════════════════════════════════════ */

let onCartChange: ((cart: CartItem[]) => void) | null = null;

export function subscribeToCartChange(fn: (cart: CartItem[]) => void): void {
  onCartChange = fn;
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === CART_KEY && e.newValue) {
      try {
        const cart: CartItem[] = JSON.parse(e.newValue);
        if (onCartChange) onCartChange(cart);
      } catch {
        /* corrupt data — ignore */
      }
    }
  });
}

/* ═══════════════════════════════════════════════════════════════ */
/* CART OPERATIONS                                                */
/* ═══════════════════════════════════════════════════════════════ */

export function addToCart(cart: CartItem[], item: Omit<CartItem, "qty">): CartItem[] {
  const existing = cart.find((i) => i.id === item.id);
  if (existing) {
    return cart.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
  }
  return [...cart, { ...item, qty: 1 }];
}

export function updateQty(cart: CartItem[], id: string, delta: number): CartItem[] {
  return cart
    .map((i) => (i.id === id ? { ...i, qty: Math.max(i.qty + delta, 0) } : i))
    .filter((i) => i.qty > 0);
}

export function removeFromCart(cart: CartItem[], id: string): CartItem[] {
  return cart.filter((i) => i.id !== id);
}

export function cartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, i) => sum + i.qty * i.price, 0);
}

export function cartCount(cart: CartItem[]): number {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

export function clearCart(): void {
  saveCart([]);
}
