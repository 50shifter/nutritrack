"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="screen-section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/60 via-dark-900/40 to-dark-900" />
      </div>
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <div className="flex items-center gap-3 justify-center mb-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs tracking-widest uppercase"
          >
            Бутик-отели мира
          </motion.span>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold leading-tight"
        >
          Путешествуйте<br />
          <span className="gold-shimmer">со вкусом</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-lg text-white/40 max-w-lg mx-auto"
        >
          Откройте для себя лучшие бутик-отели мира. Роскошь, комфорт и уникальные впечатления.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8"
        >
          <Link
            href="#hotels"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-gold/30 text-gold-light font-medium hover:bg-gold hover:text-dark-900 transition-all"
          >
            Обзор отелей <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/30 text-xs tracking-widest"
        aria-hidden
      >
        ↓
      </motion.div>
    </section>
  );
}
