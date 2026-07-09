"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ChevronRight } from "lucide-react";
import type { Doctor } from "@/data/medical";

interface DoctorCardProps { doctor: Doctor; index: number }

export function DoctorCard({ doctor: d, index }: DoctorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="doctor-card bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden"
    >
      <div className="relative">
        <img src={d.image} alt={d.name} className="w-full h-48 object-cover" />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-[10px] font-medium backdrop-blur-sm ${d.available ? "bg-green-500/10 text-green-600" : "bg-white/90 text-text"}`}>
            {d.available ? "Свободен" : "Занят"}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-dark">{d.name}</h3>
        <p className="text-sm text-[#0891B2] mt-1">{d.specialty}</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-text/40">
          <span className="flex items-center gap-1"><Star size={12} className="fill-yellow-400 text-yellow-400" />{d.rating}</span>
          <span>{d.experience} лет опыта</span>
        </div>
        <Link href={`/doctors/${d.id}`}>
          <button className="mt-4 w-full py-2.5 rounded-xl bg-[#0891B2]/5 text-[#0891B2] text-sm font-medium hover:bg-[#0891B2] hover:text-white transition-all">
            Записаться
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
