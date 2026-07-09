"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/ui/PageTransition";
import Link from "next/link";
import { User, Mail, Phone, Calendar, FileText, ShoppingCart, Bell, Shield, LogOut, Edit3, Check, HeartPulse, Video } from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"info" | "appointments" | "prescriptions" | "orders">("info");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "Иван Петров", email: "ivan@example.com", phone: "+7 (999) 123-45-67", dob: "01.01.1990" });

  const tabs = [
    { id: "info" as const, label: "Профиль", icon: <User size={16} /> },
    { id: "appointments" as const, label: "Записи", icon: <Calendar size={16} /> },
    { id: "prescriptions" as const, label: "Рецепты", icon: <FileText size={16} /> },
    { id: "orders" as const, label: "Заказы", icon: <ShoppingCart size={16} /> },
  ];

  return (
    <main>
      <Header />
      <PageTransition>
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Profile header */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
              {/* Banner */}
              <div className="h-32 bg-gradient-to-r from-[#0891B2]/20 to-[#0891B2]/10 relative" />
              <div className="px-6 pb-6 -mt-12 flex flex-col sm:flex-row items-start sm:items-end gap-4">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-2xl bg-[#F1F5F9] border-4 border-white flex items-center justify-center overflow-hidden shrink-0">
                  <User size={36} className="text-text/30" />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0 pt-12 sm:pt-0">
                  {editing ? (
                    <input value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="text-xl font-bold text-dark bg-transparent border-b border-[#0891B2] outline-none" />
                  ) : (
                    <h1 className="font-bold text-xl text-dark">{formData.name}</h1>
                  )}
                  {!editing && <p className="text-sm text-text/40 mt-1">Пациент</p>}
                </div>
                {/* Actions */}
                <div className="flex gap-2 shrink-0 pt-12 sm:pt-0">
                  <button onClick={() => setEditing(!editing)} className="p-2 rounded-xl bg-[#F1F5F9] hover:bg-gray-200 transition-colors" aria-label="Редактировать">
                    {editing ? <Check size={18} className="text-green-600" /> : <Edit3 size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white rounded-xl border border-[#E2E8F0] p-1 overflow-x-auto">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? "bg-[#0891B2] text-white" : "text-text/60 hover:text-dark"}`}>
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {activeTab === "info" && (
                <motion.div key="info" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-6">
                  <h2 className="font-bold text-lg text-dark">Личная информация</h2>

                  {/* Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Имя", key: "name" as const, icon: <User size={16} /> },
                      { label: "Email", key: "email" as const, icon: <Mail size={16} /> },
                      { label: "Телефон", key: "phone" as const, icon: <Phone size={16} /> },
                      { label: "Дата рождения", key: "dob" as const, icon: <Calendar size={16} /> },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="text-xs text-text/40 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                          {field.icon} {field.label}
                        </label>
                        {editing ? (
                          <input value={formData[field.key]} onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] text-sm outline-none focus:border-[#0891B2] transition-colors" />
                        ) : (
                          <div className="px-4 py-2.5 rounded-xl bg-[#F1F5F9] text-sm font-medium text-dark">{formData[field.key]}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Insurance */}
                  <div>
                    <label className="text-xs text-text/40 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Shield size={16} /> Полис ОМС
                    </label>
                    {editing ? (
                      <input placeholder="Номер полиса" className="w-full px-4 py-2.5 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] text-sm outline-none focus:border-[#0891B2] transition-colors" />
                    ) : (
                      <div className="px-4 py-2.5 rounded-xl bg-[#F1F5F9] text-sm font-medium text-dark">7340 1234 5678 9012</div>
                    )}
                  </div>

                  {editing && (
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setEditing(false)} className="px-6 py-2.5 rounded-xl bg-[#0891B2] text-white font-medium text-sm hover:bg-[#0891B2]/90 transition-colors">Сохранить</button>
                      <button onClick={() => setEditing(false)} className="px-6 py-2.5 rounded-xl border border-[#E2E8F0] text-dark font-medium text-sm hover:bg-gray-50 transition-colors">Отмена</button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "appointments" && (
                <motion.div key="appointments" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
                  <h2 className="font-bold text-lg text-dark">Мои записи</h2>
                  {[
                    { id: "apt-001", doctor: "Елена Смирнова", date: "25.06.2025, 10:00", status: "confirmed" as const },
                    { id: "apt-002", doctor: "Дмитрий Козлов", date: "30.06.2025, 14:30", status: "pending" as const },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#F1F5F9]">
                      <div>
                        <div className="font-medium text-sm text-dark">{a.doctor}</div>
                        <div className="text-xs text-text/40 mt-1">{a.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {a.status === "confirmed" && (
                          <Link href={`/consultation/${a.id}`} className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors flex items-center gap-1">
                            <Video size={12} /> Подключиться
                          </Link>
                        )}
                        <span className={`px-3 py-1 rounded-full text-[10px] font-medium ${a.status === "confirmed" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}>
                          {a.status === "confirmed" ? "Подтверждена" : "Ожидает"}
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "prescriptions" && (
                <motion.div key="prescriptions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
                  <h2 className="font-bold text-lg text-dark">Мои рецепты</h2>
                  {[
                    { medicine: "Витамин D3", dosage: "2000 МЕ / день", doctor: "Елена Смирнова", date: "20.06.2025" },
                    { medicine: "Эналаприл", dosage: "10 мг / день", doctor: "Дмитрий Козлов", date: "15.05.2025" },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#F1F5F9]">
                      <div>
                        <div className="font-medium text-sm text-dark">{p.medicine}</div>
                        <div className="text-xs text-text/40 mt-1">{p.dosage} • {p.doctor} • {p.date}</div>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-[#0891B2]/5 text-[#0891B2] text-xs font-medium hover:bg-[#0891B2]/10 transition-colors">Скачать PDF</button>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
                  <h2 className="font-bold text-lg text-dark">Мои заказы</h2>
                  {[
                    { id: "#ORD-001", items: 3, total: "1350 ₽", status: "Доставлен", date: "18.06.2025" },
                    { id: "#ORD-002", items: 1, total: "780 ₽", status: "В пути", date: "22.06.2025" },
                  ].map((o, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#F1F5F9]">
                      <div>
                        <div className="font-medium text-sm text-dark">{o.id}</div>
                        <div className="text-xs text-text/40 mt-1">{o.items} товара • {o.total} • {o.date}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-medium ${o.status === "Доставлен" ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"}`}>
                        {o.status}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Settings */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
              <h2 className="font-bold text-lg text-dark flex items-center gap-2"><Shield size={18} /> Настройки</h2>

              {/* Notifications */}
              <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-text/40" />
                  <span className="text-sm text-dark">Уведомления</span>
                </div>
                <button className="w-11 h-6 rounded-full bg-[#0891B2] relative transition-colors">
                  <span className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" />
                </button>
              </div>

              {/* Security */}
              <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-text/40" />
                  <span className="text-sm text-dark">Изменить пароль</span>
                </div>
                <button className="text-sm text-[#0891B2] hover:underline font-medium">Изменить</button>
              </div>

              {/* Logout */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <LogOut size={18} className="text-red-400" />
                  <span className="text-sm text-dark">Выйти</span>
                </div>
                <button className="text-sm text-red-500 hover:underline font-medium">Выйти</button>
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
      <Footer />
    </main>
  );
}
