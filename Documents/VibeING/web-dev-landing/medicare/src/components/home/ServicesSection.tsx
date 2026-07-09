"use client";

import { motion } from "framer-motion";
import { Stethoscope, Video, Pill, FileText, ChevronRight } from "lucide-react";

const services = [
  { icon: <Stethoscope size={24} />, title: "Терапия", desc: "Первичный приём, диагностика, направление", color: "bg-blue-500" },
  { icon: <Video size={24} />, title: "Видео-консультация", desc: "Консультация с врачом по видеосвязи", color: "bg-green-500" },
  { icon: <Pill size={24} />, title: "Онлайн-аптека", desc: "Заказ лекарств с доставкой на дом", color: "bg-purple-500" },
  { icon: <FileText size={24} />, title: "Мед. записи", desc: "История болезней, рецепты, анализы", color: "bg-orange-500" },
];

export function ServicesSection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-bold text-2xl sm:text-3xl text-[#1E293B]">Наши услуги</h2>
          <p className="text-[#475569]/50 mt-2 max-w-md mx-auto text-sm sm:text-base">Полный спектр медицинских услуг онлайн</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group p-5 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0891B2]/30 transition-all cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
              <h3 className="font-bold text-sm sm:text-base mb-2 text-[#1E293B]">{s.title}</h3>
              <p className="text-xs sm:text-sm text-[#475569]/50 leading-relaxed">{s.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-[#0891B2] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Подробнее <ChevronRight size={12} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
