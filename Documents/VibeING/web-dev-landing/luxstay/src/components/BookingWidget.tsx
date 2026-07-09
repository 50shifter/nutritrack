"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Users, Search } from "lucide-react";
import Link from "next/link";

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const formatDate = (d: Date) => d.toISOString().split("T")[0];

export default function BookingWidget() {
  const [checkIn, setCheckIn] = useState(formatDate(today));
  const [checkOut, setCheckOut] = useState(formatDate(tomorrow));
  const [guests, setGuests] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!checkIn) errs.checkIn = "Выберите дату заезда";
    if (!checkOut) errs.checkOut = "Выберите дату выезда";
    if (checkIn && checkOut && checkIn >= checkOut)
      errs.checkOut = "Выезд должен быть после заезда";
    if (guests < 1 || guests > 10) errs.guests = "От 1 до 10 гостей";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Redirect to booking page with params
    const params = new URLSearchParams({ checkIn, checkOut, guests: String(guests) });
    window.location.href = `/booking?${params.toString()}`;
  };

  // Set min dates
  useEffect(() => {
    setCheckIn(formatDate(today));
    setCheckOut(formatDate(tomorrow));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative z-20 -mt-20 max-w-4xl mx-auto px-6"
    >
      <form
        onSubmit={handleSubmit}
        className="glass rounded-2xl p-4 sm:p-6 backdrop-blur-xl bg-white/[0.02] border border-white/[0.05]"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Check-in */}
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Заезд</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={formatDate(today)}
              className={`w-full px-3 py-2.5 rounded-lg bg-dark-700/50 text-sm border text-white focus:outline-none transition-colors ${
                errors.checkIn ? "border-red-500" : "border-gold/10 focus:border-gold/30"
              }`}
            />
            {errors.checkIn && <span className="text-[10px] text-red-400 mt-0.5 block">{errors.checkIn}</span>}
          </div>

          {/* Check-out */}
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Выезд</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || formatDate(today)}
              className={`w-full px-3 py-2.5 rounded-lg bg-dark-700/50 text-sm border text-white focus:outline-none transition-colors ${
                errors.checkOut ? "border-red-500" : "border-gold/10 focus:border-gold/30"
              }`}
            />
            {errors.checkOut && <span className="text-[10px] text-red-400 mt-0.5 block">{errors.checkOut}</span>}
          </div>

          {/* Guests */}
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Гости</label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-lg bg-dark-700/50 text-sm border border-gold/10 text-white focus:outline-none focus:border-gold/30"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "гость" : n < 5 ? "гостя" : "гостей"}
                </option>
              ))}
            </select>
            {errors.guests && <span className="text-[10px] text-red-400 mt-0.5 block">{errors.guests}</span>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="py-2.5 rounded-lg font-medium text-sm bg-gold text-dark-900 hover:bg-gold-light transition-colors flex items-center justify-center gap-2"
          >
            <Search size={16} /> Найти
          </button>
        </div>
      </form>
    </motion.div>
  );
}
