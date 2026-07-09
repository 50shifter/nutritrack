"use client";

import { motion } from "framer-motion";
import { services } from "@/data/photos";

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-gold-light text-xs tracking-widest uppercase">Услуги</span>
          <h2 className="font-serif text-3xl font-bold mt-2">Что я делаю</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:border-gold/20 transition-colors group"
            >
              <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">{s.icon}</div>
              <h3 className="font-serif font-bold mb-2">{s.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed mb-4">{s.desc}</p>
              <div className="text-gold-light font-bold text-sm border-t border-white/[0.03] pt-3">{s.price}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
