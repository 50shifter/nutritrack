"use client";

import { useState, useEffect } from "react";
import { loadCart, updateQty, removeFromCart, cartTotal, saveCart, clearCart } from "@/store/cartStore";
import { toast } from "@/components/ToastProvider";
import type { CartItem } from "@/store/cartStore";
import EmptyState from "@/components/EmptyState";
import QuantityControls from "@/components/QuantityControls";
import CartSummary from "@/components/CartSummary";
import SearchBar from "@/components/SearchBar";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    setCart(loadCart());
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const newCart = updateQty(prev, id, delta);
      saveCart(newCart);
      return newCart;
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => {
      const newCart = removeFromCart(prev, id);
      saveCart(newCart);
      toast.info("Товар удалён из корзины");
      return newCart;
    });
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "FOOD20") {
      setDiscount(20);
      toast.success("Промокод FOOD20 применён! Скидка 20%");
    } else {
      toast.error("Неверный промокод");
    }
  };

  const total = cartTotal(cart);
  const discountAmount = Math.round(total * (discount / 100));
  const finalTotal = total - discountAmount;
  const deliveryFee = total >= 1500 ? 0 : 199;

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="p-2 rounded-full bg-dark-700/50 hover:bg-dark-600 transition-colors" aria-label="На главную">
          <ArrowLeft size={20} className="text-white/60" />
        </Link>
        <h1 className="text-xl md:text-2xl font-bold">Корзина</h1>
      </div>

      {cart.length === 0 ? (
        <EmptyState icon="cart" title="Корзина пуста" description="Добавьте что-нибудь вкусное!" />
      ) : (
        <div className="space-y-6">
          {/* Cart items */}
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="food-card flex items-center gap-3 p-3 md:p-4">
                <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm md:text-base truncate">{item.name}</div>
                  <div className="text-xs text-white/40 truncate mt-0.5">{item.restaurant}</div>
                  <div className="text-peach-light font-bold mt-1">{(item.qty * item.price).toLocaleString()} ₽</div>
                </div>
                <QuantityControls qty={item.qty} onUpdate={(d) => updateQuantity(item.id, d)} onRemove={() => removeItem(item.id)} price={item.price} />
              </div>
            ))}
          </div>

          {/* Promo code */}
          <div className="food-card p-4">
            <h3 className="font-bold mb-3">Промокод</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Введите код..."
                className="flex-1 px-3 py-2 rounded-lg bg-dark-600 text-sm outline-none placeholder:text-white/20 border border-white/[0.03]"
                aria-label="Промокод"
              />
              <button onClick={applyPromo} className="px-4 py-2 rounded-lg bg-peach text-white text-sm font-medium hover:bg-peach-light transition-colors">
                Применить
              </button>
            </div>
            {discount > 0 && <p className="text-xs text-emerald-400 mt-2">✓ Скидка {discount}% применена</p>}
          </div>

          {/* Price breakdown */}
          <div className="food-card p-4">
            <h3 className="font-bold mb-4">Итого</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-white/60">
                <span>Товары ({cart.reduce((s, i) => s + i.qty, 0)} шт)</span>
                <span>{total.toLocaleString()} ₽</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Скидка {discount}%</span>
                  <span>−{discountAmount.toLocaleString()} ₽</span>
                </div>
              )}
              <div className="flex justify-between text-white/60">
                <span>Доставка</span>
                <span className={deliveryFee === 0 ? "text-emerald-400" : ""}>{deliveryFee === 0 ? "Бесплатно" : `${deliveryFee} ₽`}</span>
              </div>
              <div className="border-t border-white/[0.03] my-2 pt-2 flex justify-between font-bold text-lg">
                <span>К оплате</span>
                <span className="text-peach-light">{(finalTotal + deliveryFee).toLocaleString()} ₽</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full py-3.5 rounded-xl bg-peach text-white font-medium text-center mt-4 hover:bg-peach-light transition-colors active:scale-[0.98]"
            >
              Оформить заказ →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
