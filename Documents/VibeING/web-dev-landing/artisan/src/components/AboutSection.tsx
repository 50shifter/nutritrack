"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutSection() {
  const stats = [
    { n: "500+", l: "Проектов" },
    { n: "200+", l: "Клиентов" },
    { n: "15", l: "Наград" },
  ];

  return (
    <section className="py-20 px-6 bg-dark-700/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Photo */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className="relative rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop"
              alt="Артём Волков — фотограф"
              width={600}
              height={800}
              className="w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/30 to-transparent" />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <span className="text-gold-light text-xs tracking-widest uppercase">Обо мне</span>
          <h2 className="font-serif text-3xl font-bold mt-2">Каждый кадр — история</h2>
          <p className="text-white/40 mt-4 leading-relaxed">
            Меня зовут Артём Волков. Я профессиональный фотограф с 8-летним опытом. Моя страсть — находить красоту в каждом моменте. Я верю, что фотографии — это не просто изображения, а истории, которые остаются с нами на всю жизнь.
          </p>

          {/* Skills / Equipment */}
          <div className="mt-6">
            <h4 className="text-sm font-bold text-white/60 mb-2">Оборудование</h4>
            <div className="flex flex-wrap gap-2">
              {["Sony A7IV", "85mm f/1.4", "35mm f/1.4", "Drone Mavic 3", "Profoto B10"].map((g) => (
                <span key={g} className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.03] text-white/40">
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {stats.map((s) => (
              <div key={s.l} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                <div className="text-xl font-bold gold-text">{s.n}</div>
                <div className="text-xs text-white/40 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
