"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Сколько стоят ваши услуги?",
    answer: "Стоимость зависит от типа съёмки и длительности. Портретная — от 15 000 ₽, свадебная — от 50 000 ₽. Используйте наш калькулятор для ориентировочной стоимости.",
  },
  {
    question: "В каком формате я получу фотографии?",
    answer: "Фотографии передаются через облачное хранилище в высоком разрешении (JPEG). При необходимости предоставляем RAW файлы. Также доступна печать и фотокнига.",
  },
  {
    question: "Как быстро я получу готовые фотографии?",
    answer: "Обычно 2-3 недели после съёмки. Для срочных проектов доступна экспресс-обработка за 24 часа (+10 000 ₽).",
  },
  {
    question: "Можно ли внести правки после съёмки?",
    answer: "Да, одна бесплатная коррекция включена. Мы обсуждаем пожелания до съёмки, чтобы результат был идеальным.",
  },
  {
    question: "Вы выезжаете за Москву?",
    answer: "Да, мы работаем по всей России и за рубежом. Стоимость дороги и проживания обсуждается отдельно.",
  },
  {
    question: "Нужна ли предоплата?",
    answer: "Да, для бронирования даты необходима предоплата 30%. Остальное — в день съёмки или после.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-6 bg-dark-700/30">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-gold-light text-xs tracking-widest uppercase">Вопросы</span>
          <h2 className="font-serif text-4xl font-bold mt-2">Частые вопросы</h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-white/[0.03] bg-white/[0.01] overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-sm pr-4">{faq.question}</span>
                {openIndex === i ? (
                  <Minus size={16} className="text-gold-light shrink-0" />
                ) : (
                  <Plus size={16} className="text-white/30 shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 text-sm text-white/50 leading-relaxed">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
