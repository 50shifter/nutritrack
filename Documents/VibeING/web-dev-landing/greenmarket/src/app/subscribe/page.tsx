"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X as XIcon, ArrowRight, Clock, Palette, Gift } from "lucide-react";
import { SUBSCRIPTION_PLANS, PRODUCTS } from "@/lib/mock-data";
import type { SubscriptionPlan } from "@/lib/types";
import { PageSkeleton } from "@/components/Skeleton";


export { PageSkeleton as loading };

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(SUBSCRIPTION_PLANS[1]);
  const [frequency, setFrequency] = useState("biweekly");
  const [curatedItems, setCuratedItems] = useState<Set<number>>(new Set());
  const [excludedItems, setExcludedItems] = useState<Set<number>>(new Set());
  const [showCustomization, setShowCustomization] = useState(false);
  const [saving, setSaving] = useState(false);

  const frequencyMap = {
    weekly: { label: "Еженедельно", daysBetween: 7 },
    biweekly: { label: "Раз в 2 недели", daysBetween: 14 },
    monthly: { label: "Раз в месяц", daysBetween: 30 },
  };

  const nextDelivery = new Date();
  nextDelivery.setDate(nextDelivery.getDate() + frequencyMap[frequency as keyof typeof frequencyMap].daysBetween);

  const toggleItem = (id: number) => {
    setCuratedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < selectedPlan.items) next.add(id);
      return next;
    });
  };

  const toggleExclude = (id: number) => {
    setExcludedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubscribe = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 2000);
  };

  const filteredProducts = PRODUCTS.filter((p) => !excludedItems.has(p.id));
  const canCustomize = curatedItems.size < selectedPlan.items;

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-green/10 text-green-light text-xs font-medium mb-4 border border-green/20">
              🌿 Эко-подписка
            </span>
            <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>Регулярная доставка</h1>
            <p className="text-white/40 text-sm max-w-md mx-auto">Получайте свежий набор эко-продуктов регулярно. Измените, отложите или отмените в любой момент.</p>
          </motion.div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <motion.button
              key={plan.id}
              onClick={() => { setSelectedPlan(plan); setCuratedItems(new Set()); }}
              className={`relative p-6 rounded-2xl border text-left transition-all ${
                selectedPlan.id === plan.id
                  ? "border-green/50 bg-green/5 shadow-lg shadow-green/5"
                  : "border-white/[0.03] bg-white/[0.02] hover:border-white/[0.08]"
              }`}
            >
              {selectedPlan.id === plan.id && (
                <div className="absolute top-3 right-3">
                  <Check size={16} className="text-green-light" />
                </div>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.label}</h3>
              <p className="text-2xl font-bold text-green-light mb-2">{plan.price.toLocaleString()} ₽</p>
              <p className="text-xs text-white/30 mb-3">{plan.period}</p>
              <p className="text-xs text-white/40 mb-4">{plan.description}</p>
              <div className="flex items-center gap-2 text-xs text-white/30">
                <Gift size={12} />
                {plan.items} товаров
              </div>
            </motion.button>
          ))}
        </div>

        {/* Frequency */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-semibold mb-4">Периодичность доставки</h3>
          <div className="grid grid-cols-3 gap-3">
            {(["weekly", "biweekly", "monthly"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  frequency === f ? "border-green/50 bg-green/5" : "border-white/[0.03] hover:border-white/[0.08]"
                }`}
              >
                <Clock size={18} className="mx-auto mb-2 text-white/40" />
                <p className="text-xs font-medium">{frequencyMap[f].label}</p>
                <p className="text-[10px] text-white/20 mt-0.5">Каждые {frequencyMap[f].daysBetween} дней</p>
              </button>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-white/[0.02] text-xs text-white/30 flex items-center gap-2">
            <Clock size={14} />
            Следующая доставка: {nextDelivery.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>

        {/* Customization */}
        <div className="glass rounded-2xl p-6 mb-8">
          <button
            onClick={() => setShowCustomization(!showCustomization)}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-2">
              <Palette size={18} className="text-green-light" />
              <h3 className="text-sm font-semibold">Кастомизация</h3>
              <span className="text-xs text-white/30">({curatedItems.size}/{selectedPlan.items} выбрано)</span>
            </div>
            <ChevronIcon open={showCustomization} />
          </button>

          <AnimatePresence>
            {showCustomization && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredProducts.map((product) => {
                    const isSelected = curatedItems.has(product.id);
                    const isExcluded = excludedItems.has(product.id);

                    return (
                      <div
                        key={product.id}
                        className={`relative rounded-xl border overflow-hidden transition-all ${
                          isExcluded ? "border-white/[0.02] opacity-30" :
                          isSelected ? "border-green/50" : "border-white/[0.03] hover:border-white/[0.08]"
                        }`}
                      >
                        <div className="aspect-square overflow-hidden">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium truncate">{product.name}</p>
                          <p className="text-xs text-green-light font-bold">{product.price} ₽</p>
                        </div>
                        {isExcluded && (
                          <>
                            <div className="absolute inset-0 bg-black/50" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <XIcon size={20} className="text-red-400" />
                            </div>
                          </>
                        )}
                        {!isExcluded && (
                          <button
                            onClick={() => toggleItem(product.id)}
                            className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                              isSelected ? "bg-green text-white" : "bg-black/50 text-white/60"
                            }`}
                          >
                            {isSelected ? <Check size={12} /> : <ArrowRight size={12} />}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Exclude section */}
                <div className="mt-6 pt-6 border-t border-white/[0.03]">
                  <h4 className="text-xs font-semibold mb-3 text-red-400">Исключить из коробки</h4>
                  <p className="text-[10px] text-white/30 mb-3">Отметьте товары, которые не хотите получать</p>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCTS.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => toggleExclude(product.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          excludedItems.has(product.id)
                            ? "bg-red-500/20 text-red-400"
                            : "bg-white/[0.03] text-white/40 hover:bg-white/[0.05]"
                        }`}
                      >
                        {excludedItems.has(product.id) ? "✕ " : "+ "}{product.name}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Summary + Subscribe */}
        <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold">{selectedPlan.label} — {frequencyMap[frequency as keyof typeof frequencyMap].label}</h3>
            <p className="text-xs text-white/30 mt-1">
              {curatedItems.size > 0 ? `${curatedItems.size} из ${selectedPlan.items} товаров выбрано` : "Будет автоматически подобрано"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-green-light">{selectedPlan.price.toLocaleString()} ₽</p>
              <p className="text-[10px] text-white/30">Демо-подписка (без списания)</p>
            </div>
            <button
              onClick={handleSubscribe}
              disabled={saving}
              className="px-8 py-3 rounded-xl bg-green text-white font-medium hover:bg-green/80 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Оформляем...
                </>
              ) : (
                <>
                  Симулировать подписку →
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${open ? "rotate-180" : ""}`}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
