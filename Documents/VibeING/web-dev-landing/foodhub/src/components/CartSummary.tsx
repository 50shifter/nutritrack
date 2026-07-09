"use client";

import Link from "next/link";
import { cartTotal } from "@/store/cartStore";
import type { CartItem } from "@/store/cartStore";

interface Props {
  cart: CartItem[];
  compact?: boolean;
}

export default function CartSummary({ cart, compact }: Props) {
  if (cart.length === 0) return null;
  const total = cartTotal(cart);

  return (
    <div className={`${compact ? "food-card p-4 mt-4 md:hidden" : "hidden md:block w-64 food-card p-4 h-fit"}`}>
      <h3 className="font-bold mb-4">Ваш заказ</h3>
      <div className="space-y-2 mb-4">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-white/60 truncate flex-1 mr-2">{item.name} × {item.qty}</span>
            <span className="text-peach-light font-medium whitespace-nowrap">{(item.qty * item.price).toLocaleString()} ₽</span>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.03] my-3" />
      <div className="flex justify-between font-bold mb-4">
        <span>Итого</span>
        <span className="text-peach-light">{total.toLocaleString()} ₽</span>
      </div>
      <Link
        href="/checkout"
        className="block w-full py-3 rounded-xl bg-peach text-white font-medium text-sm text-center hover:bg-peach-light transition-colors active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-light"
      >
        Оформить →
      </Link>
    </div>
  );
}
