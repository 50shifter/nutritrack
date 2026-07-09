"use client";

import { motion } from "framer-motion";
import { experiences } from "@/data/hotels";
import { MapPin, Clock, Star } from "lucide-react";
import Image from "next/image";

export default function ExperiencesSection() {
  return (
    <section id="experiences" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-gold-light text-xs tracking-widest uppercase">Уникально</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mt-3">Впечатления</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.03] hover:border-gold/20 transition-colors"
            >
              <div className="overflow-hidden h-48">
                <Image
                  src={e.image}
                  alt={e.title}
                  width={400}
                  height={200}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-xs text-gold-light mb-2">
                  <MapPin size={12} /> {e.hotel} · {e.city}
                </div>
                <h3 className="font-bold text-lg mb-1">{e.title}</h3>
                <p className="text-sm text-white/40 line-clamp-2">{e.description}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.03]">
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-white/30" />
                    <span className="text-xs text-white/30">{e.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={10} className="fill-gold text-gold" />
                    <span className="text-xs text-gold-light">{e.rating}</span>
                  </div>
                  <span className="text-gold-light font-bold text-sm">{e.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
