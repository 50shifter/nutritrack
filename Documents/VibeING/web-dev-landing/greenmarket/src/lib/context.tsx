"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { CartItem, Product } from "./types";

const CART_KEY = "greenmarket-cart";
const WISHLIST_KEY = "greenmarket-wishlist";

/* ─── Cart Context ─── */
interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  addToCart: (product: Product) => void;
  updateQty: (productId: number, delta: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, loaded]);

  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
  }, []);

  const updateQty = useCallback((productId: number, delta: number) => {
    setItems((prev) => prev.map((i) => {
      if (i.product.id === productId) {
        const newQty = i.qty + delta;
        return newQty > 0 ? { ...i, qty: newQty } : i;
      }
      return i;
    }));
  }, []);

  const removeItem = useCallback((productId: number) => setItems((prev) => prev.filter((i) => i.product.id !== productId)), []);
  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  if (!loaded) return <>{children}</>;

  return (
    <CartContext.Provider value={{ items, total, itemCount, addToCart, updateQty, removeItem, clearCart, isOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) return { items: [], total: 0, itemCount: 0, addToCart: () => {}, updateQty: () => {}, removeItem: () => {}, clearCart: () => {}, isOpen: false, openCart: () => {}, closeCart: () => {} };
  return ctx;
}

/* ─── Wishlist Context ─── */
interface WishlistContextType {
  wishlisted: Set<number>;
  addToWishlist: (id: number) => void;
  removeFromWishlist: (id: number) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlisted, setWishlisted] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      if (saved) setWishlisted(new Set(JSON.parse(saved)));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(WISHLIST_KEY, JSON.stringify([...wishlisted]));
  }, [wishlisted, loaded]);

  const addToWishlist = useCallback((id: number) => {
    setWishlisted((prev) => { const next = new Set(prev); next.add(id); return next; });
  }, []);

  const removeFromWishlist = useCallback((id: number) => {
    setWishlisted((prev) => { const next = new Set(prev); next.delete(id); return next; });
  }, []);

  if (!loaded) return <>{children}</>;

  return (
    <WishlistContext.Provider value={{ wishlisted, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) return { wishlisted: new Set<number>(), addToWishlist: () => {}, removeFromWishlist: () => {} };
  return ctx;
}
