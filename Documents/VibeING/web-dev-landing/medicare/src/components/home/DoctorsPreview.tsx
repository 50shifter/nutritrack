"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ChevronRight } from "lucide-react";
import type { Doctor } from "@/data/medical";

interface DoctorsPreviewProps {
  doctors: Doctor[];
}

export function DoctorsPreview({ doctors }: DoctorsPreviewProps) {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#F1F5F9]/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="font-bold text-2xl sm:text-3xl text-[#1E293B]">Наши врачи</h2>
            <p className="text-[#475569]/50 mt-1 text-sm sm:text-base">Лучшие специалисты для вашего здоровья</p>
          </div>
          <Link href="/doctors" className="text-[#0891B2] text-sm font-medium flex items-center gap-1 hover:underline hidden sm:flex">
            Все врачи <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {doctors.slice(0, 3).map((d, i) => (
            <DoctorCard key={d.id} doctor={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DoctorCard({ doctor: d, index }: { doctor: Doctor; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="doctor-card bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden"
    >
      <div className="relative">
        <img src={d.image} alt={d.name} className="w-full h-44 sm:h-48 object-cover" />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${d.available ? "bg-green-500/10 text-green-600" : "bg-white/90 text-text"} backdrop-blur-sm`}>
            {d.available ? "Свободен" : "Занят"}
          </span>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-bold text-dark text-[#1E293B]">{d.name}</h3>
        <p className="text-sm text-[#0891B2] mt-1">{d.specialty}</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-[#475569]/40">
          <span className="flex items-center gap-1"><Star size={12} className="fill-yellow-400 text-yellow-400" />{d.rating}</span>
          <span>{d.experience} лет</span>
        </div>
        <Link href={`/doctors/${d.id}`}>
          <button className="mt-3 w-full py-2.5 rounded-xl bg-[#0891B2]/5 text-[#0891B2] text-sm font-medium hover:bg-[#0891B2] hover:text-white transition-all">
            Записаться
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
