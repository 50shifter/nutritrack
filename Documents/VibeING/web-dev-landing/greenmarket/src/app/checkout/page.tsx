"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Truck, Store, Check, CreditCard, MapPin, AlertCircle } from "lucide-react";
import { useCart } from "@/lib/context";
import { PageSkeleton } from "@/components/Skeleton";
import { z } from "zod";
import type { CheckoutForm } from "@/lib/types";
import { initMetrics, trackEvent } from "@shared-metrics/lib/metrics-client";


export { PageSkeleton as loading };

const checkoutSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа"),
  email: z.string().email("Некорректный email"),
  phone: z.string().min(10, "Введите номер телефона"),
  address: z.string().min(5, "Укажите адрес"),
  city: z.string().min(2, "Город"),
  postalCode: z.string().min(4, "Индекс"),
  deliveryMethod: z.enum(["courier", "pickup"]),
  pickupPoint: z.string().optional(),
});

type CheckoutStep = "delivery" | "payment" | "confirmation";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>("delivery");
  const [formData, setFormData] = useState<CheckoutForm>({
    name: "", email: "", phone: "", address: "", city: "", postalCode: "",
    deliveryMethod: "courier",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
  const [processing, setProcessing] = useState(false);

  const deliveryCost = total >= 2000 ? 0 : 299;
  const finalTotal = total + deliveryCost;

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <p className="text-xl font-bold mb-2">Корзина пуста</p>
          <p className="text-white/40 text-sm mb-6">Добавьте товары перед оформлением</p>
          <a href="/catalog" className="px-6 py-3 rounded-xl bg-green text-white font-medium hover:bg-green/80 transition-colors">
            Перейти в каталог
          </a>
        </div>
      </div>
    );
  }

  const validateStep = (currentStep: CheckoutStep): boolean => {
    try {
      const data: Partial<CheckoutForm> = {};
      if (currentStep === "delivery") {
        data.name = formData.name;
        data.email = formData.email;
        data.phone = formData.phone;
        data.address = formData.address;
        data.city = formData.city;
        data.postalCode = formData.postalCode;
        data.deliveryMethod = formData.deliveryMethod;
        if (formData.deliveryMethod === "pickup" && !formData.pickupPoint) {
          throw new Error("Укажите пункт выдачи");
        }
      }
      checkoutSchema.parse(data);
      setErrors({});
      return true;
    } catch (e: any) {
      if (e.errors) {
        const newErrors: Record<string, string> = {};
        e.errors.forEach((err: any) => {
          const path = err.path[0];
          if (typeof path === "string") newErrors[path] = err.message;
        });
        setErrors(newErrors as Partial<Record<keyof CheckoutForm, string>>);
      }
      return false;
    }
  };

  const handleContinue = () => {
    if (step === "delivery" && validateStep("delivery")) {
      setStep("payment");
    } else if (step === "payment") {
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        setStep("confirmation");
        clearCart();
        // Track successful order
        trackEvent("order_placed", {
          total: String(finalTotal),
          itemCount: String(items.length),
          deliveryMethod: formData.deliveryMethod,
          items: items.map(i => i.product.name).join(","),
        });
      }, 2000);
    }
  };

  // Track checkout started when entering page
  useEffect(() => {
    initMetrics({
      projectId: "greenmarket",
      endpoint: "/api/metrics",
      debug: process.env.NODE_ENV === "development",
    });
    trackEvent("checkout_started", { itemCount: String(items.length) });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Georgia, serif' }}>Оформление заказа</h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-10">
          {[
            { key: "delivery" as CheckoutStep, label: "Доставка", num: 1 },
            { key: "payment" as CheckoutStep, label: "Оплата", num: 2 },
            { key: "confirmation" as CheckoutStep, label: "Подтверждение", num: 3 },
          ].map((s, i) => (
            <div key={s.key} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                step === s.key ? "bg-green/20 text-green-light" :
                step === "confirmation" && s.num < 3 ? "bg-green/20 text-green-light" :
                "bg-white/[0.03] text-white/30"
              }`}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-current">
                  {step === "confirmation" && s.num < i + 1 ? "✓" : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-px my-auto mx-2 ${step === s.key || (step === "confirmation" && s.num < i + 1) ? "bg-green/30" : "bg-white/[0.03]"}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === "delivery" && <DeliveryForm formData={formData} setFormData={setFormData as any} errors={errors as any} />}
            {step === "payment" && <PaymentForm />}
            {step === "confirmation" && <ConfirmationForm total={finalTotal} formData={formData} />}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.03]">
              <h3 className="text-sm font-semibold mb-4">Ваш заказ</h3>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img src={item.product.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.product.name}</p>
                      <p className="text-[10px] text-white/30">×{item.qty}</p>
                    </div>
                    <span className="text-xs font-medium">{(item.product.price * item.qty).toLocaleString()} ₽</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-white/[0.03] pt-3">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Товары</span>
                  <span>{total.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Доставка</span>
                  <span className={deliveryCost === 0 ? "text-green-light" : ""}>{deliveryCost === 0 ? "Бесплатно" : `${deliveryCost} ₽`}</span>
                </div>
                {total < 2000 && (
                  <p className="text-[10px] text-white/20">До бесплатной доставки {(2000 - total).toLocaleString()} ₽</p>
                )}
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/[0.03]">
                  <span>Итого</span>
                  <span className="text-green-light">{finalTotal.toLocaleString()} ₽</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {step !== "confirmation" && (
          <div className="flex items-center justify-between mt-8">
            {step !== "delivery" ? (
              <button onClick={() => setStep("delivery" as CheckoutStep)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.03] text-sm text-white/50 hover:text-white/80 hover:bg-white/[0.03] transition-colors">
                <ChevronLeft size={16} /> Назад
              </button>
            ) : <div />}
            <button
              onClick={handleContinue}
              disabled={processing}
              className="px-8 py-3 rounded-xl bg-green text-white font-medium hover:bg-green/80 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {processing ? (
                <>
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Обработка...
                </>
              ) : (
                step === "payment" ? "Симулировать оплату" : "Продолжить"
              )}
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DeliveryForm({ formData, setFormData, errors }: { formData: CheckoutForm; setFormData: (f: Partial<CheckoutForm>) => void; errors: Record<string, string | undefined> }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Данные доставки</h2>
      <div>
        <label className="text-xs text-white/40 mb-1.5 block">Имя</label>
        <input type="text" value={formData.name} onChange={(e) => setFormData({ name: e.target.value })}
          className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border text-sm placeholder:text-white/20 focus:outline-none transition-colors ${errors.name ? "border-red-500/30" : "border-white/[0.03] focus:border-green/30"}`}
          placeholder="Ваше имя" />
        {errors.name && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Email</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({ email: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border text-sm placeholder:text-white/20 focus:outline-none transition-colors ${errors.email ? "border-red-500/30" : "border-white/[0.03] focus:border-green/30"}`}
            placeholder="email@example.com" />
          {errors.email && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.email}</p>}
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Телефон</label>
          <input type="tel" value={formData.phone} onChange={(e) => setFormData({ phone: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border text-sm placeholder:text-white/20 focus:outline-none transition-colors ${errors.phone ? "border-red-500/30" : "border-white/[0.03] focus:border-green/30"}`}
            placeholder="+7 (999) 123-45-67" />
          {errors.phone && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.phone}</p>}
        </div>
      </div>

      {/* Delivery method */}
      <div>
        <label className="text-xs text-white/40 mb-3 block">Способ доставки</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setFormData({ deliveryMethod: "courier" })}
            className={`p-4 rounded-xl border text-center transition-colors ${
              formData.deliveryMethod === "courier" ? "border-green/50 bg-green/5" : "border-white/[0.03] hover:bg-white/[0.03]"
            }`}
          >
            <Truck size={20} className="mx-auto mb-2" />
            <p className="text-xs font-medium">Курьер</p>
            <p className="text-[10px] text-white/30 mt-0.5">24 часа</p>
          </button>
          <button
            onClick={() => setFormData({ deliveryMethod: "pickup" })}
            className={`p-4 rounded-xl border text-center transition-colors ${
              formData.deliveryMethod === "pickup" ? "border-green/50 bg-green/5" : "border-white/[0.03] hover:bg-white/[0.03]"
            }`}
          >
            <Store size={20} className="mx-auto mb-2" />
            <p className="text-xs font-medium">Пункт выдачи</p>
            <p className="text-[10px] text-white/30 mt-0.5">1-2 дня</p>
          </button>
        </div>
      </div>

      {formData.deliveryMethod === "pickup" && (
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Пункт выдачи</label>
          <select value={formData.pickupPoint || ""} onChange={(e) => setFormData({ pickupPoint: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.03] text-sm text-white/40 focus:outline-none focus:border-green/30">
            <option value="">Выберите пункт</option>
            <option value="moscow-tverskaya">Москва, Тверская 12</option>
            <option value="moscow-arbat">Москва, Арбат 5</option>
            <option value="spb Nevsky">СПб, Невский 28</option>
          </select>
        </div>
      )}

      <div>
        <label className="text-xs text-white/40 mb-1.5 block">Адрес</label>
        <input type="text" value={formData.address} onChange={(e) => setFormData({ address: e.target.value })}
          className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border text-sm placeholder:text-white/20 focus:outline-none transition-colors ${errors.address ? "border-red-500/30" : "border-white/[0.03] focus:border-green/30"}`}
          placeholder="Улица, дом, квартира" />
        {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Город</label>
          <input type="text" value={formData.city} onChange={(e) => setFormData({ city: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border text-sm placeholder:text-white/20 focus:outline-none transition-colors ${errors.city ? "border-red-500/30" : "border-white/[0.03] focus:border-green/30"}`}
            placeholder="Москва" />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Индекс</label>
          <input type="text" value={formData.postalCode} onChange={(e) => setFormData({ postalCode: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border text-sm placeholder:text-white/20 focus:outline-none transition-colors ${errors.postalCode ? "border-red-500/30" : "border-white/[0.03] focus:border-green/30"}`}
            placeholder="123456" />
        </div>
      </div>
    </div>
  );
}

function PaymentForm() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Способ оплаты</h2>
      <div className="space-y-3">
        {[
          { label: "Банковская карта", desc: "Visa, Mastercard, МИР", icon: <CreditCard size={20} /> },
          { label: "Apple Pay", desc: "Быстрая оплата", icon: <span className="text-lg">🍎</span> },
          { label: "Google Pay", desc: "Оплата через Google", icon: <span className="text-lg">🔵</span> },
        ].map((m) => (
          <label key={m.label} className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.03] hover:bg-white/[0.03] cursor-pointer transition-colors">
            <input type="radio" name="payment" defaultValue={m.label} defaultChecked={m.label === "Банковская карта"} className="accent-green" />
            {m.icon}
            <div>
              <p className="text-sm font-medium">{m.label}</p>
              <p className="text-xs text-white/30">{m.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function ConfirmationForm({ total, formData }: { total: number; formData: CheckoutForm }) {
  return (
    <div className="text-center py-12 space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="w-20 h-20 rounded-full bg-green/20 flex items-center justify-center mx-auto"
      >
        <Check size={36} className="text-green-light" />
      </motion.div>
      <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20">🐾 Демо-режим</span>
      <div>
        <h2 className="text-2xl font-bold mb-2">Спасибо за заказ! 🎉</h2>
        <p className="text-white/40 text-sm">Это pet-project — оплата не проводилась, заказ симулирован 🐾</p>
      </div>
      <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.03] inline-block text-left max-w-sm">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/40">Заказ</span>
          <span className="text-green-light font-bold">#{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/40">Сумма</span>
          <span className="font-bold">{total.toLocaleString()} ₽</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/40">Доставка</span>
          <span className="font-medium">{formData.deliveryMethod === "courier" ? "Курьером" : "Пункт выдачи"}</span>
        </div>
      </div>
      <a href="/" className="inline-block px-6 py-3 rounded-xl bg-green text-white font-medium hover:bg-green/80 transition-colors">
        Вернуться на главную
      </a>
    </div>
  );
}
