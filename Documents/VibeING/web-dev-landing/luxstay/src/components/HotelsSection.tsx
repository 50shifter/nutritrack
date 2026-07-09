"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { hotels, roomsByHotel } from "@/data/hotels";
import { Star, MapPin, Bed, Maximize2, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type RoomType = "all" | "стандарт" | "люкс" | "премиум";

const priceLabel = (n: number) => `${n.toLocaleString()} ₽`;

export default function HotelsSection() {
  const [filterCity, setFilterCity] = useState("all");
  const [filterType, setFilterType] = useState<RoomType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const cities = ["all", ...new Set(hotels.map((h) => h.city))];

  const filtered = hotels
    .filter((h) => filterCity === "all" || h.city === filterCity)
    .filter((h) => {
      if (!searchQuery) return true;
      return (
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .filter((h) => {
      if (filterType === "all") return true;
      return h.rooms.some((r) => r.type === filterType);
    });

  return (
    <section id="hotels" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-gold-light text-xs tracking-widest uppercase">Коллекция</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mt-3">Наши отели</h2>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3 mb-10 justify-center">
          {/* Search */}
          <input
            type="text"
            placeholder="Поиск отеля или города..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-dark-700/50 text-sm border border-gold/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/30 flex-1 max-w-xs"
          />

          {/* City filter */}
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-dark-700/50 text-sm border border-gold/10 text-white focus:outline-none focus:border-gold/30"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "Все города" : c}
              </option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as RoomType)}
            className="px-4 py-2.5 rounded-lg bg-dark-700/50 text-sm border border-gold/10 text-white focus:outline-none focus:border-gold/30"
          >
            <option value="all">Все типы</option>
            <option value="стандарт">Стандарт</option>
            <option value="люкс">Люкс</option>
            <option value="премиум">Премиум</option>
          </select>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-white/30">Ничего не найдено</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src={h.photo}
                  alt={h.name}
                  width={600}
                  height={400}
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/20 to-transparent" />
                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-dark-900/60 backdrop-blur">
                  <Star size={12} className="fill-gold text-gold" />
                  <span className="text-xs font-medium">{h.rating}</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={14} className="text-gold-light" />
                    <span className="text-sm text-white/60">{h.city}, {h.country}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold">{h.name}</h3>
                  <p className="text-sm text-white/40 mt-2 line-clamp-2">{h.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-gold-light text-sm font-medium">
                    От{" "}
                    <span className="text-xl font-bold">{Math.min(...h.rooms.map((r) => r.price)).toLocaleString()} ₽</span>{" "}
                    <span className="text-xs text-white/40 font-normal">/ ночь</span>
                  </div>
                  {/* Room types */}
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {[...new Set(h.rooms.map((r) => r.type))].map((t) => (
                      <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/5 border border-white/5 text-white/30">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
