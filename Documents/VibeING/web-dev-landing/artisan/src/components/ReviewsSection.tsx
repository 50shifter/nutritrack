"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/data/photos";
import { Star } from "lucide-react";

export default function ReviewsSection() {
  return (
    <section id="reviews" className="py-20 px-6 bg-dark-700/30">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-gold-light text-xs tracking-widest uppercase">Отзывы</span>
          <h2 className="font-serif text-3xl font-bold mt-2">Клиенты</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.03]"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={12} className="fill-gold-light text-gold-light" />
                ))}
              </div>
              <p className="text-sm text-white/50 italic mb-3 leading-relaxed">"{t.quote}"</p>
              <div>
                <div className="font-medium text-sm">{t.name}</div>
                <div className="text-xs text-gold-light">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
