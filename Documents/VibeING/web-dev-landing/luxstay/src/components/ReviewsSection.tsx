"use client";

import { motion } from "framer-motion";
import { reviews } from "@/data/hotels";
import { Star } from "lucide-react";

export default function ReviewsSection() {
  return (
    <section id="reviews" className="py-24 px-6 bg-dark-800/50">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-gold-light text-xs tracking-widest uppercase">Доверяют</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mt-3">Отзывы гостей</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.03]"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} size={12} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm text-white/50 leading-relaxed mb-4">&ldquo;{r.comment}&rdquo;</p>
              <div>
                <div className="font-medium text-sm">{r.name}</div>
                <div className="text-xs text-gold-light">{r.hotel} · {r.date}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
