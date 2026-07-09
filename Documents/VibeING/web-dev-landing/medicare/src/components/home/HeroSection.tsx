"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Video, ArrowRight, HeartPulse } from "lucide-react";
import { Counter } from "@/components/ui/Counter";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0891B2]/5 via-white to-[#F1F5F9]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0891B2]/10 text-[#0891B2] text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-[#0891B2]" style={{ animation: "pulse-ring 2s infinite" }} />
              Онлайн-консультации 24/7
            </span>

            <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-[#1E293B] leading-tight">
              Ваше здоровье<br />
              <span className="text-[#0891B2]">под контролем</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-[#475569]/70 max-w-md leading-relaxed">
              Записывайтесь к врачам онлайн, получайте консультации по видеосвязи и управляйте своим здоровьем.
            </p>

            <div className="flex flex-wrap gap-3 mt-6 sm:mt-8">
              <Link
                href="/doctors"
                className="px-5 py-2.5 sm:py-3 rounded-xl bg-[#0891B2] text-white font-medium text-sm hover:bg-[#0891B2]/90 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-[#0891B2]/20"
              >
                Записаться к врачу <ArrowRight size={16} />
              </Link>
              <button className="px-5 py-2.5 sm:py-3 rounded-xl border border-[#E2E8F0] text-sm font-medium hover:border-[#0891B2] hover:text-[#0891B2] transition-all flex items-center gap-2">
                <Video size={16} /> Видеоконсультация
              </button>
            </div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 pt-8 border-t border-[#E2E8F0]">
                {[{ n: 150, s: "+", l: "Врачей" }, { n: 50000, s: "+", l: "Пациентов" }, { n: 12, s: "", l: "Лет опыта" }].map(s => (
                  <div key={s.l}>
                    <div className="text-2xl sm:text-3xl font-bold text-[#1E293B]">
                      <Counter target={s.n} suffix={s.s} />
                    </div>
                    <div className="text-xs text-[#475569]/50 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right - mockup */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl border border-[#E2E8F0]">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=700&fit=crop"
                alt="Врач на консультации"
                className="w-full h-[280px] sm:h-[360px] lg:h-[400px] object-cover"
              />
              {/* Status overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-3 sm:p-4 flex items-center gap-3 shadow-lg">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shrink-0">OK</div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[#1E293B] truncate">Врач подключён</div>
                  <div className="text-xs text-[#475569]/50">Видеоконсультация • 12 мин</div>
                </div>
                <div className="ml-auto flex gap-1.5 shrink-0">
                  <button className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors" aria-label="Чат">
                    <HeartPulse size={14} className="text-[#0891B2]" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors" aria-label="Завершить">
                    <HeartPulse size={14} className="text-white rotate-[90deg]" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
