"use client";

import { motion } from "framer-motion";
import { steps } from "@/data/process";
import { ArrowRight } from "lucide-react";

export default function ProcessSection() {
  return (
    <section className="py-20 px-6 bg-dark-700/30">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-gold-light text-xs tracking-widest uppercase">Процесс</span>
          <h2 className="font-serif text-4xl font-bold mt-2">Как мы работаем</h2>
          <p className="text-white/40 mt-3 max-w-md mx-auto">
            От заявки до готовых фото — прозрачный и понятный процесс
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:border-gold/20 transition-colors group"
            >
              {/* Step number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gold text-dark-900 flex items-center justify-center text-sm font-bold">
                {s.step}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <s.icon size={22} className="text-gold-light" />
              </div>

              <h3 className="font-serif font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>

              {/* Connector arrow */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                  <ArrowRight size={16} className="text-white/10" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
