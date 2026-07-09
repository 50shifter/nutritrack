"use client";

import { motion } from "framer-motion";
import { Shield, Clock, Star } from "lucide-react";

const features = [
  { icon: <Shield size={24} />, title: "Безопасно", desc: "Все данные защищены шифрованием" },
  { icon: <Clock size={24} />, title: "Быстро", desc: "Запись за 2 минуты, консультация в день обращения" },
  { icon: <Star size={24} />, title: "Качественно", desc: "Врачи с опытом от 5 лет, рейтинги пациентов" },
];

export function WhyUsSection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-bold text-2xl sm:text-3xl text-[#1E293B]">Почему MediCare?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="text-center p-6 rounded-2xl bg-white border border-[#E2E8F0]"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0891B2]/10 flex items-center justify-center text-[#0891B2] mx-auto mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-[#1E293B] mb-2">{f.title}</h3>
              <p className="text-sm text-[#475569]/50 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
