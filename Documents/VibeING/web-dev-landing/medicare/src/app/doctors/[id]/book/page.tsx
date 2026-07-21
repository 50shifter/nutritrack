"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { doctors } from "@/data/medical";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/ui/PageTransition";
import { ArrowLeft, Calendar as CalIcon, Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, User, FileText, MessageSquare, Phone, Mail, MapPin, Star } from "lucide-react";
import { initMetrics, trackEvent } from "@shared-metrics/lib/metrics-client";

interface BookingPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = await params;
  const doctorId = parseInt(id);
  const d = doctors.find(doc => doc.id === doctorId);

  if (!d) return <div>Врач не найден</div>;

  return (
    <main>
      <Header />
      <PageTransition>
        <section className="py-8 sm:py-12 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Back */}
            <Link href={`/doctors/${d.id}`} className="inline-flex items-center gap-2 text-sm text-[#0891B2] hover:underline font-medium">
              <ArrowLeft size={16} /> Назад к профилю врача
            </Link>

            {/* Header */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 flex items-center gap-4 sm:gap-6">
              <img src={d.image} alt={d.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover" />
              <div>
                <h1 className="font-bold text-lg sm:text-xl text-dark">Запись к врачу</h1>
                <p className="text-[#0891B2] font-medium">{d.name} — {d.specialty}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-text/40">
                  <span className="flex items-center gap-1"><Star size={12} className="fill-yellow-400 text-yellow-400" />{d.rating}</span>
                  <span>{d.experience} лет опыта</span>
                </div>
              </div>
            </div>

            {/* Steps */}
            <BookingForm doctor={d} />
          </div>
        </section>
      </PageTransition>
      <Footer />
    </main>
  );
}

function BookingForm({ doctor }: { doctor: typeof doctors[0] }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", symptoms: "", purpose: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Initialize metrics and track consultation request on mount
  useEffect(() => {
    initMetrics({
      projectId: "medicare",
      endpoint: "/api/metrics",
      debug: process.env.NODE_ENV === "development",
    });
    trackEvent("consultation_requested", {
      doctorId: String(doctor.id),
      specialty: doctor.specialty,
    });
  }, [doctor.id, doctor.specialty]);

  // Generate next 30 days
  const dates = useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      arr.push(new Date(d));
    }
    return arr;
  }, []);

  // Available time slots (mocked - will be from DB)
  const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00"];

  const handleBook = async () => {
    setLoading(true);
    // Simulate API call - replace with server action
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccess(true);
    setLoading(false);
    // Track successful booking
    trackEvent("doctor_booked", {
      doctorId: String(doctor.id),
      specialty: doctor.specialty,
      date: selectedDate?.toISOString() || "",
      time: selectedTime,
      purpose: formData.purpose,
    });
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl border border-green-200 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="font-bold text-xl text-dark mb-2">Запись оформлена!</h2>
        <p className="text-text/50 mb-4">Мы отправим подтверждение на вашу почту</p>
        <div className="bg-[#F1F5F9] rounded-xl p-4 max-w-sm mx-auto text-left space-y-2">
          <div className="flex justify-between text-sm"><span className="text-text/40">Врач:</span><span className="font-medium">{doctor.name}</span></div>
          <div className="flex justify-between text-sm"><span className="text-text/40">Дата:</span><span className="font-medium">{selectedDate?.toLocaleDateString("ru-RU")}</span></div>
          <div className="flex justify-between text-sm"><span className="text-text/40">Время:</span><span className="font-medium">{selectedTime}</span></div>
        </div>
        <Link href="/profile" className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-[#0891B2] text-white font-medium hover:bg-[#0891B2]/90 transition-colors">Перейти в личный кабинет</Link>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 space-y-6">
      {/* Step indicators */}
      <div className="flex items-center gap-3">
        {[1, 2, 3].map(s => (
          <motion.button key={s} onClick={() => s <= step && setStep(s)} className={`flex items-center gap-2 ${step >= s ? "text-[#0891B2]" : "text-text/30"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step > s ? "bg-green-500 text-white" : step === s ? "bg-[#0891B2] text-white" : "bg-[#F1F5F9] text-text/30"}`}>{step > s ? <CheckCircle size={16} /> : s}</div>
            <span className="text-sm font-medium hidden sm:inline">{s === 1 ? "Выберите дату" : s === 2 ? "Заполните данные" : "Подтверждение"}</span>
          </motion.button>
        ))}
      </div>

      {/* Step 1: Date & Time */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2"><CalIcon size={18} /> Выберите дату</h3>

          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Предыдущий месяц"><ChevronLeft size={20} /></button>
            <span className="font-medium text-dark">{new Date().toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}</span>
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Следующий месяц"><ChevronRight size={20} /></button>
          </div>

          {/* Date grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6">
            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(day => (
              <div key={day} className="text-center text-xs text-text/30 py-1">{day}</div>
            ))}
            {(dates as Date[]).map((d: Date, i: number) => {
              const isSelected = selectedDate?.toDateString() === d.toDateString();
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(d)}
                  className={`relative p-2 sm:p-3 rounded-xl text-sm font-medium transition-all ${
                    isSelected ? "bg-[#0891B2] text-white shadow-lg shadow-[#0891B2]/20 scale-105" : "hover:bg-[#F1F5F9] text-dark"
                  }`}
                >
                  {d.getDate()}
                  <div className={`text-[10px] mt-0.5 ${isSelected ? "opacity-70" : "text-text/30"}`}>
                    {["вс", "пн", "вт", "ср", "чт", "пт", "сб"][d.getDay()]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Time slots */}
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2"><Clock size={18} /> Выберите время</h3>
          {selectedDate ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {timeSlots.map(time => (
                <button key={time} onClick={() => setSelectedTime(time)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedTime === time ? "bg-[#0891B2] text-white shadow-lg shadow-[#0891B2]/20" : "border border-[#E2E8F0] hover:border-[#0891B2] text-dark"
                  }`}>
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text/40 italic">Сначала выберите дату</p>
          )}

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setStep(2)} disabled={!selectedDate || !selectedTime} className="mt-6 w-full sm:w-auto px-8 py-3 rounded-xl bg-[#0891B2] text-white font-medium hover:bg-[#0891B2]/90 transition-colors shadow-lg shadow-[#0891B2]/20 disabled:opacity-40 disabled:shadow-none">Далее →</motion.button>
        </motion.div>
      )}

      {/* Step 2: Patient info */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h3 className="font-bold text-dark mb-4">Ваши данные</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "ФИО", key: "name" as const, icon: <User size={16} />, placeholder: "Иванов Иван Иванович" },
              { label: "Телефон", key: "phone" as const, icon: <Phone size={16} />, placeholder: "+7 (999) 123-45-67" },
              { label: "Email", key: "email" as const, icon: <Mail size={16} />, placeholder: "your@email.com" },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs text-text/50 uppercase tracking-wider flex items-center gap-1.5 mb-2">{field.icon} {field.label}</label>
                <input type={field.key === "email" ? "email" : "text"} value={formData[field.key]} onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder} required className="w-full px-4 py-3 rounded-xl bg-[#F1F5F9] border border-transparent focus:border-[#0891B2] text-sm outline-none transition-colors" />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="text-xs text-text/50 uppercase tracking-wider flex items-center gap-1.5 mb-2"><MessageSquare size={16} /> Жалобы / симптомы</label>
            <textarea value={formData.symptoms} onChange={e => setFormData(p => ({ ...p, symptoms: e.target.value }))} rows={3} placeholder="Опишите ваши симптомы или жалобы..." className="w-full px-4 py-3 rounded-xl bg-[#F1F5F9] border border-transparent focus:border-[#0891B2] text-sm outline-none transition-colors resize-none" />
          </div>

          <div className="mt-4">
            <label className="text-xs text-text/50 uppercase tracking-wider flex items-center gap-1.5 mb-2"><FileText size={16} /> Цель консультации</label>
            <select value={formData.purpose} onChange={e => setFormData(p => ({ ...p, purpose: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-[#F1F5F9] border border-transparent focus:border-[#0891B2] text-sm outline-none transition-colors">
              <option value="">Выберите цель</option>
              <option value="consultation">Первичная консультация</option>
              <option value="followup">Повторный приём</option>
              <option value="second-opinion">Второе мнение</option>
              <option value="prescription">Продление рецепта</option>
              <option value="checkup">Профилактический осмотр</option>
            </select>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-xl border border-[#E2E8F0] text-dark font-medium hover:bg-gray-50 transition-colors">← Назад</button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setStep(3)} className="px-8 py-2.5 rounded-xl bg-[#0891B2] text-white font-medium hover:bg-[#0891B2]/90 transition-colors shadow-lg shadow-[#0891B2]/20">Далее →</motion.button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h3 className="font-bold text-dark mb-4">Подтверждение записи</h3>

          {/* Summary */}
          <div className="bg-[#F1F5F9] rounded-xl p-6 space-y-4 max-w-md">
            <div className="flex items-center gap-4 pb-4 border-b border-[#E2E8F0]">
              <img src={doctor.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <div className="font-bold text-dark">{doctor.name}</div>
                <div className="text-sm text-[#0891B2]">{doctor.specialty}</div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: "Дата и время", value: `${selectedDate?.toLocaleDateString("ru-RU")} в ${selectedTime}` },
                { label: "ФИО пациента", value: formData.name },
                { label: "Телефон", value: formData.phone },
                { label: "Email", value: formData.email },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-text/40">{item.label}</span>
                  <span className="font-medium text-dark max-w-[200px] truncate">{item.value}</span>
                </div>
              ))}
            </div>

            {formData.symptoms && (
              <div className="pt-3 border-t border-[#E2E8F0]">
                <div className="text-xs text-text/40 mb-1">Жалобы</div>
                <p className="text-sm text-dark">{formData.symptoms}</p>
              </div>
            )}

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center gap-2 text-xs text-text/40">
              <AlertCircle size={14} /> Нажимая "Подтвердить", вы соглашаетесь с условиями обработки персональных данных
            </div>
          </div>

          <div className="flex gap-3 mt-6 max-w-md">
            <button onClick={() => setStep(2)} className="px-6 py-2.5 rounded-xl border border-[#E2E8F0] text-dark font-medium hover:bg-gray-50 transition-colors">← Назад</button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleBook} disabled={loading} className="flex-1 py-3 rounded-xl bg-[#0891B2] text-white font-medium hover:bg-[#0891B2]/90 transition-colors shadow-lg shadow-[#0891B2]/20 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? "Оформление..." : <><CheckCircle size={16} /> Подтвердить запись</>}
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
