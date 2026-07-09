"use client";

import { motion } from "framer-motion";

export default function StatsSection() {
  const stats = [
    { n: "4", l: "Отеля" },
    { n: "12", l: "Городов" },
    { n: "200+", l: "Номеров" },
    { n: "15K+", l: "Гостей" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-20 px-6 bg-gold/5 border-y border-gold/10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.l}>
            <div className="font-serif text-4xl font-bold gold-shimmer">{s.n}</div>
            <div className="text-sm text-white/40 mt-2">{s.l}</div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
