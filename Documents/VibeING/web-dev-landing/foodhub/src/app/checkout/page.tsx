"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loadCart, cartTotal, saveCart, clearCart } from "@/store/cartStore";
import { toast } from "@/components/ToastProvider";
import type { CartItem } from "@/store/cartStore";
import { MapPin, CreditCard, Truck, Clock, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { initMetrics, trackEvent } from "@shared-metrics/lib/metrics-client";

interface FormData {
  name: string;
  phone: string;
  address: string;
  comment: string;
  payment: "card" | "cash" | "app";
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "Александр",
    phone: "+7 (999) 123-45-67",
    address: "ул. Пушкина, 10, кв. 5",
    comment: "",
    payment: "card",
  });

  useEffect(() => {
    setCart(loadCart());
    // Initialize metrics and track checkout started
    initMetrics({
      projectId: "foodhub",
      endpoint: "/api/metrics",
      debug: process.env.NODE_ENV === "development",
    });
    trackEvent("checkout_started", { itemCount: String(cart.length), total: String(total) });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const total = cartTotal(cart);
  const deliveryFee = total >= 1500 ? 0 : 199;
  const finalTotal = total + deliveryFee;

  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleSubmit = useCallback(() => {
    setLoading(true);

    // Validate
    if (!formData.name.trim()) { toast.error("Введите имя"); setLoading(false); return; }
    if (!formData.phone.trim()) { toast.error("Введите номер телефона"); setLoading(false); return; }
    if (!formData.address.trim()) { toast.error("Введите адрес доставки"); setLoading(false); return; }

    // DEMO: это pet-project — заказ симулируется без реальной оплаты
    console.log("[DEMO] Заказ оформлен (симуляция):", formData);
    setTimeout(() => {
      clearCart();
      setCart([]);
      setLoading(false);
      setOrderPlaced(true);
      // Track order placed
      trackEvent("order_placed", {
        total: String(finalTotal),
        itemCount: String(cart.length),
        paymentMethod: formData.payment,
        items: cart.map(i => i.name).join(","),
      });
    }, 2000);
  }, [formData]);

  if (cart.length === 0) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Корзина пуста</h1>
          <p className="text-sm text-white/40 mb-6">Добавьте товары перед оформлением</p>
          <Link href="/" className="px-6 py-2.5 rounded-xl bg-peach text-white font-medium text-sm inline-block">
            На главную
          </Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20">🐾 Демо-режим</span>
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
            <Check size={40} className="text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Заказ оформлен! 🎉</h1>
            <p className="text-sm text-white/40">Это pet-project — оплата не проводилась, заказ симулирован 🐾</p>
          </div>
          <div className="food-card p-4 max-w-sm mx-auto">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/40">Номер заказа</span>
              <span className="text-peach-light font-medium">#{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/40">Сумма</span>
              <span className="font-medium">{finalTotal.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Оплата</span>
              <span className="font-medium">{formData.payment === "card" ? "Картой" : formData.payment === "cash" ? "Наличными" : "Приложением"}</span>
            </div>
          </div>
          <Link href="/" className="px-8 py-3 rounded-xl bg-peach text-white font-medium inline-block hover:bg-peach-light transition-colors">
            На главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto pb-32">
      <Link href="/cart" className="text-sm text-peach-light hover:text-peach transition-colors inline-block mb-4">
        ← Вернуться в корзину
      </Link>

      <h1 className="text-xl md:text-2xl font-bold mb-6">Оформление заказа</h1>

      <div className="space-y-6">
        {/* Order summary */}
        <div className="food-card p-4">
          <h3 className="font-bold mb-3">Ваш заказ</h3>
          <div className="space-y-2 mb-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-white/60 truncate mr-2">{item.name} × {item.qty}</span>
                <span className="text-peach-light font-medium whitespace-nowrap">{(item.qty * item.price).toLocaleString()} ₽</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.03] my-2" />
          <div className="flex justify-between font-bold">
            <span>Итого</span>
            <span className="text-peach-light">{finalTotal.toLocaleString()} ₽</span>
          </div>
        </div>

        {/* Name */}
        <div className="food-card p-4">
          <label className="text-sm font-medium mb-2 block">Имя *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg bg-dark-600 text-sm outline-none border border-white/[0.03] placeholder:text-white/20 focus:border-peach/50 transition-colors"
            placeholder="Ваше имя"
            aria-label="Имя"
          />
        </div>

        {/* Phone */}
        <div className="food-card p-4">
          <label className="text-sm font-medium mb-2 block">Телефон *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg bg-dark-600 text-sm outline-none border border-white/[0.03] placeholder:text-white/20 focus:border-peach/50 transition-colors"
            placeholder="+7 (___) ___-__-__"
            aria-label="Телефон"
          />
        </div>

        {/* Address */}
        <div className="food-card p-4">
          <label className="text-sm font-medium mb-2 block">Адрес доставки *</label>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-peach flex-shrink-0 mt-2.5" />
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="flex-1 px-3 py-2.5 rounded-lg bg-dark-600 text-sm outline-none border border-white/[0.03] placeholder:text-white/20 focus:border-peach/50 transition-colors"
              placeholder="Улица, дом, квартира"
              aria-label="Адрес доставки"
            />
          </div>
        </div>

        {/* Payment */}
        <div className="food-card p-4">
          <h3 className="font-bold mb-3">Способ оплаты</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "card" as const, label: "Картой", icon: CreditCard },
              { value: "cash" as const, label: "Наличными", icon: Truck },
              { value: "app" as const, label: "Приложение", icon: Clock },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFormData({ ...formData, payment: option.value })}
                className={`p-3 rounded-xl border text-sm font-medium transition-colors flex flex-col items-center gap-1.5 ${
                  formData.payment === option.value
                    ? "border-peach bg-peach/10 text-peach"
                    : "border-white/[0.03] bg-dark-600/50 text-white/60 hover:text-white"
                }`}
              >
                <option.icon size={18} />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="food-card p-4">
          <label className="text-sm font-medium mb-2 block">Комментарий</label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg bg-dark-600 text-sm outline-none border border-white/[0.03] placeholder:text-white/20 focus:border-peach/50 transition-colors resize-none h-20"
            placeholder="Позвонить, не звонить, интерком и т.д."
            aria-label="Комментарий к заказу"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-peach text-white font-bold text-base hover:bg-peach-light transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-light"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Оформляем...
            </span>
          ) : (
            `Симулировать оплату (${finalTotal.toLocaleString()} ₽)`
          )}
        </button>
      </div>
    </div>
  );
}
