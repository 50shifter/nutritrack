"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Minus, Plus, Calculator } from "lucide-react";

interface Option {
  label: string;
  price: number;
}

const options = {
  type: [
    { label: "Портретная съёмка", price: 15000 },
    { label: "Свадебная фотография", price: 50000 },
    { label: "Лейфстайл", price: 20000 },
    { label: "Коммерческая съёмка", price: 30000 },
  ] as Option[],
  hours: [
    { label: "1 час", price: 0 },
    { label: "2 часа", price: 8000 },
    { label: "3 часа", price: 12000 },
    { label: "Полный день (8ч)", price: 20000 },
  ] as Option[],
  extras: [
    { label: "Ретушь", price: 5000 },
    { label: "Фотокнига", price: 12000 },
    { label: "Drone съёмка", price: 8000 },
    { label: "2 фотографа", price: 15000 },
    { label: "Срочная обработка (24ч)", price: 10000 },
  ] as Option[],
};

export default function CalculatorSection() {
  const [selectedType, setSelectedType] = useState<Option>(options.type[0]);
  const [selectedHours, setSelectedHours] = useState<Option>(options.hours[0]);
  const [extras, setExtras] = useState<Set<string>>(new Set());

  const toggleExtra = (label: string) => {
    setExtras((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const totalPrice =
    selectedType.price + selectedHours.price + [...extras].reduce((sum, label) => {
      const extra = options.extras.find((e) => e.label === label);
      return sum + (extra?.price || 0);
    }, 0);

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-gold-light text-xs tracking-widest uppercase">Расчёт</span>
          <h2 className="font-serif text-4xl font-bold mt-2">Калькулятор стоимости</h2>
          <p className="text-white/40 mt-3 max-w-md mx-auto">
            Выберите параметры — узнайте ориентировочную стоимость
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Type */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-white/60">Тип съёмки</h3>
            {options.type.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setSelectedType(opt)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  selectedType.label === opt.label
                    ? "border-gold bg-gold/5 text-white"
                    : "border-white/[0.03] text-white/40 hover:border-gold/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{opt.label}</span>
                  <span className="text-gold-light font-bold">{opt.price.toLocaleString()} ₽</span>
                </div>
              </button>
            ))}
          </motion.div>

          {/* Duration */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-white/60">Длительность</h3>
            {options.hours.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setSelectedHours(opt)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  selectedHours.label === opt.label
                    ? "border-gold bg-gold/5 text-white"
                    : "border-white/[0.03] text-white/40 hover:border-gold/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{opt.label}</span>
                  {opt.price > 0 && <span className="text-gold-light font-bold">+{opt.price.toLocaleString()} ₽</span>}
                </div>
              </button>
            ))}
          </motion.div>

          {/* Extras */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-white/60">Дополнительно</h3>
            {options.extras.map((opt) => {
              const isActive = extras.has(opt.label);
              return (
                <button
                  key={opt.label}
                  onClick={() => toggleExtra(opt.label)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                    isActive
                      ? "border-gold bg-gold/5 text-white"
                      : "border-white/[0.03] text-white/40 hover:border-gold/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded flex items-center justify-center ${isActive ? "bg-gold" : "bg-white/[0.03]"}`}>
                        {isActive && <Check size={12} className="text-dark-900" />}
                      </div>
                      <span>{opt.label}</span>
                    </div>
                    <span className="text-gold-light font-bold">+{opt.price.toLocaleString()} ₽</span>
                  </div>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Total */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-gold/20 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calculator size={20} className="text-gold-light" />
            <span className="text-white/40 text-sm uppercase tracking-wider">Ориентировочная стоимость</span>
          </div>
          <div className="font-serif text-5xl font-bold gold-text">{totalPrice.toLocaleString()} ₽</div>
          <p className="text-xs text-white/30 mt-2">Точная цена обсуждается индивидуально</p>
          <a
            href="#contact"
            className="mt-4 inline-block text-gold-light text-sm hover:text-white transition-colors"
          >
            Обсудить детали →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
