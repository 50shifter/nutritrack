"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920&q=80"
          alt=""
          fill
          className="object-cover scale-110 opacity-20"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 via-dark-900/30 to-dark-900" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-serif text-6xl sm:text-8xl font-bold tracking-tight"
        >
          ARTISAN
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-gold-light text-lg mt-2"
        >
          Фотограф · Москва
        </motion.p>
        <div className="gold-line mx-auto mt-6" />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-4 text-white/40 max-w-md mx-auto"
        >
          Кинематографичная фотография для тех, кто ценит каждый момент
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <a
            href="#portfolio"
            className="inline-block text-sm tracking-widest uppercase text-gold-light hover:text-white transition-colors"
          >
            ↓ Смотреть работы
          </a>
        </motion.div>
      </div>
    </section>
  );
}
