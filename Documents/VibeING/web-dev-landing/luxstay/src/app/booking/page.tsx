"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { hotels, roomsByHotel } from "@/data/hotels";
import { Star, MapPin, Bed, Maximize2, Users, Check, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/* ─── SearchParam Hook ─── */
function useQueryParams() {
  const params = useSearchParams();
  return {
    checkIn: params.get("checkIn") || "",
    checkOut: params.get("checkOut") || "",
    guestsParam: params.get("guests") || "1",
  };
}

function BookingContent() {
  const { checkIn, checkOut, guestsParam } = useQueryParams();
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requests: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Initialize metrics on mount
  useEffect(() => {
    initMetrics({
      projectId: "luxstay",
      endpoint: "/api/metrics",
      debug: process.env.NODE_ENV === "development",
    });
  }, []);

  const filteredRooms = selectedHotel
    ? roomsByHotel[hotels[selectedHotel - 1].name]?.filter(
        (r) => r.available && r.maxGuests >= Number(guestsParam)
      )
    : [];

  const selectedHotelData = selectedHotel ? hotels[selectedHotel - 1] : null;
  const selectedRoomData = selectedRoom
    ? filteredRooms.find((r) => r.id === selectedRoom)
    : null;

  const totalNights = checkIn && checkOut
    ? Math.max(1, Math.floor((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const totalPrice = selectedRoomData ? selectedRoomData.price * totalNights : 0;

  const validateStep1 = () => {
    if (!selectedHotel) return "Выберите отель";
    if (!selectedRoom) return "Выберите номер";
    return "";
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Укажите имя";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Укажите корректный email";
    if (!formData.phone.trim()) errs.phone = "Укажите телефон";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) return;
      setStep(2);
    } else if (step === 2) {
      if (!validateStep2()) return;
      setStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Track booking confirmed
    if (selectedHotelData && selectedRoomData) {
      trackEvent("booking_confirmed", {
        hotelId: String(selectedHotel),
        hotelName: selectedHotelData.name,
        roomType: selectedRoomData.type,
        totalPrice: String(totalPrice),
        nights: String(totalNights),
        city: selectedHotelData.city,
      });
    }
  };

  return (
    <main className="min-h-screen bg-dark-900 pt-20 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium border border-gold/20">🐾 Демо-режим</span>
          <Link href="/" className="flex items-center gap-2 text-sm text-white/40 hover:text-gold transition-colors">
            <ArrowLeft size={16} /> На главную
          </Link>
          {/* Stepper */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    step >= s ? "bg-gold text-dark-900" : "bg-dark-700 text-white/30"
                  }`}
                >
                  {step > s ? <Check size={14} /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-8 h-px ${step > s ? "bg-gold" : "bg-dark-700"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {submitted ? (
          /* Confirmation */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-6">
              <Check size={32} className="text-gold" />
            </div>
            <h1 className="font-serif text-3xl font-bold mb-4">Бронирование подтверждено!</h1>
            <p className="text-white/40 max-w-md mx-auto mb-8">
              Спасибо! Ваше бронирование принято.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-dark-900 text-sm font-medium hover:bg-gold-light transition-colors">
              Вернуться на главную
            </Link>
          </motion.div>
        ) : step === 1 ? (
          /* Step 1: Select hotel & room */
          <div className="space-y-8">
            {/* Check-in summary */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03] flex flex-wrap gap-6 text-sm">
              {checkIn && <span>📅 Заезд: <strong className="text-white/80">{checkIn}</strong></span>}
              {checkOut && <span>📅 Выезд: <strong className="text-white/80">{checkOut}</strong></span>}
              <span>👥 Гостей: <strong className="text-white/80">{guestsParam}</strong></span>
            </div>

            {/* Hotels */}
            <h2 className="font-serif text-2xl font-bold">Выберите отель</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hotels.map((h) => (
                <button
                  key={h.id}
                  onClick={() => { setSelectedHotel(h.id); setSelectedRoom(null); }}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    selectedHotel === h.id
                      ? "border-gold bg-gold/5"
                      : "border-white/[0.03] hover:border-gold/20"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                      <Image src={h.photo} alt={h.name} width={96} height={96} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">{h.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={12} className="text-gold-light" />
                        <span className="text-xs text-white/40">{h.city}, {h.country}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={12} className="fill-gold text-gold" />
                        <span className="text-xs font-medium">{h.rating}</span>
                      </div>
                      {selectedHotel === h.id && (
                        <div className="mt-2 text-xs text-gold flex items-center gap-1">
                          <Check size={12} /> Выбрано
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Rooms */}
            {selectedHotelData && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-serif text-2xl font-bold mt-8 mb-4">
                  Доступные номера в <span className="text-gold-light">{selectedHotelData.name}</span>
                </h2>
                <div className="space-y-3">
                  {filteredRooms.length === 0 ? (
                    <p className="text-white/30 text-sm py-4">Нет номеров с достаточной вместимостью</p>
                  ) : (
                    filteredRooms.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setSelectedRoom(r.id)}
                        className={`w-full text-left p-5 rounded-xl border transition-all ${
                          selectedRoom === r.id
                            ? "border-gold bg-gold/5"
                            : "border-white/[0.03] hover:border-gold/20"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm">{r.name}</h4>
                            <span className="text-[10px] uppercase tracking-wider text-white/30 bg-white/[0.05] px-2 py-0.5 rounded mt-1 inline-block">{r.type}</span>
                            <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                              <span className="flex items-center gap-1"><Bed size={12} /> {r.size}</span>
                              <span className="flex items-center gap-1"><Users size={12} /> до {r.maxGuests} гостей</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              {r.amenities.slice(0, 4).map((a) => (
                                <span key={a} className="text-[10px] text-gold/60">· {a}</span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gold-light">{r.price.toLocaleString()} ₽</div>
                            <div className="text-[10px] text-white/30">за ночь</div>
                            {totalNights > 0 && (
                              <div className="text-xs text-white/40 mt-1">{totalNights} ночей = {totalPrice.toLocaleString()} ₽</div>
                            )}
                          </div>
                        </div>
                        {selectedRoom === r.id && (
                          <div className="mt-3 text-xs text-gold flex items-center gap-1">
                            <Check size={12} /> Выбрано
                          </div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Next button */}
            {selectedHotelData && selectedRoomData && (
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-xl bg-gold text-dark-900 font-medium hover:bg-gold-light transition-colors"
              >
                Продолжить ({totalPrice.toLocaleString()} ₽ за {totalNights} ночей)
              </button>
            )}
          </div>
        ) : step === 2 ? (
          /* Step 2: Guest info */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-serif text-2xl font-bold mb-6">Контактные данные</h2>
            <form className="space-y-4">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Имя *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-lg bg-dark-700/50 text-sm border text-white focus:outline-none placeholder-white/20 ${
                    errors.name ? "border-red-500" : "border-gold/10 focus:border-gold/30"
                  }`}
                  placeholder="Иван Иванов"
                />
                {errors.name && <span className="text-[10px] text-red-400 mt-0.5 block">{errors.name}</span>}
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-lg bg-dark-700/50 text-sm border text-white focus:outline-none placeholder-white/20 ${
                    errors.email ? "border-red-500" : "border-gold/10 focus:border-gold/30"
                  }`}
                  placeholder="ivan@example.com"
                />
                {errors.email && <span className="text-[10px] text-red-400 mt-0.5 block">{errors.email}</span>}
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Телефон *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-lg bg-dark-700/50 text-sm border text-white focus:outline-none placeholder-white/20 ${
                    errors.phone ? "border-red-500" : "border-gold/10 focus:border-gold/30"
                  }`}
                  placeholder="+7 (999) 123-45-67"
                />
                {errors.phone && <span className="text-[10px] text-red-400 mt-0.5 block">{errors.phone}</span>}
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Особые пожелания</label>
                <textarea
                  value={formData.requests}
                  onChange={(e) => setFormData((f) => ({ ...f, requests: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-dark-700/50 text-sm border border-gold/10 text-white focus:outline-none focus:border-gold/30 placeholder-white/20 resize-none"
                  placeholder="Поздний заезд, детская кровать и т.д."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-lg border border-white/10 text-sm text-white/60 hover:text-white transition-colors"
                >
                  Назад
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 rounded-xl bg-gold text-dark-900 font-medium hover:bg-gold-light transition-colors"
                >
                  К бронированию
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* Step 3: Summary & confirm */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-serif text-2xl font-bold mb-6">Подтверждение бронирования</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Summary */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                <h3 className="text-sm font-bold mb-4 text-gold-light">Детали бронирования</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-white/30">Отель:</span>
                    <p className="font-medium">{selectedHotelData?.name}</p>
                  </div>
                  <div>
                    <span className="text-white/30">Номер:</span>
                    <p className="font-medium">{selectedRoomData?.name}</p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/30">Заезд:</span>
                    <span className="font-medium">{checkIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/30">Выезд:</span>
                    <span className="font-medium">{checkOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/30">Ночей:</span>
                    <span className="font-medium">{totalNights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/30">Гостей:</span>
                    <span className="font-medium">{guestsParam}</span>
                  </div>
                  <div className="border-t border-white/[0.03] pt-3 flex justify-between">
                    <span className="text-white/30">Итого:</span>
                    <span className="text-lg font-bold text-gold-light">{totalPrice.toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>

              {/* Guest info */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                <h3 className="text-sm font-bold mb-4 text-gold-light">Контактные данные</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-white/30">Имя:</span>
                    <p className="font-medium">{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-white/30">Email:</span>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                  <div>
                    <span className="text-white/30">Телефон:</span>
                    <p className="font-medium">{formData.phone}</p>
                  </div>
                  {formData.requests && (
                    <div>
                      <span className="text-white/30">Пожелания:</span>
                      <p className="font-medium">{formData.requests}</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full mt-6 py-3 rounded-xl bg-gold text-dark-900 font-medium hover:bg-gold-light transition-colors"
                >
                  Подтвердить бронирование — {totalPrice.toLocaleString()} ₽
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-4 text-sm text-white/40 hover:text-gold transition-colors"
            >
              ← Вернуться к редактированию
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}

/* ─── Main Export ─── */
export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-900 pt-20 pb-16 px-6 flex items-center justify-center">
        <div className="text-gold-light animate-pulse text-sm">Загрузка...</div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
