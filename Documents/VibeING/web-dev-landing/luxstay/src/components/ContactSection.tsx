"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setForm({ name: "", email: "", message: "" });
    } catch {
      setSubmitted(false);
      alert("Ошибка отправки. Попробуйте позже.");
    }
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-12">
            <span className="text-gold-light text-xs tracking-widest uppercase">Свяжитесь</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mt-3">Готовы начать?</h2>
            <p className="text-lg text-white/40 mt-4 max-w-lg mx-auto">
              Забронируйте ваш идеальный номер прямо сейчас. Мы поможем организовать незабываемое путешествие.
            </p>
          </div>

          {/* Contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Mail, label: "Email", value: "booking@luxstay.com" },
              { icon: Phone, label: "Телефон", value: "+7 (800) 123-45-67" },
              { icon: MapPin, label: "Офис", value: "Москва, Тверская 12" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                <c.icon size={20} className="text-gold-light shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/30">{c.label}</div>
                  <div className="text-sm">{c.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Ваше имя</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-dark-700/50 text-sm border border-gold/10 text-white focus:outline-none focus:border-gold/30 placeholder-white/20"
                  placeholder="Иван Иванов"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-dark-700/50 text-sm border border-gold/10 text-white focus:outline-none focus:border-gold/30 placeholder-white/20"
                  placeholder="ivan@example.com"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Сообщение</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-dark-700/50 text-sm border border-gold/10 text-white focus:outline-none focus:border-gold/30 placeholder-white/20 resize-none"
                placeholder="Расскажите, какой отпуск вы мечтаете..."
              />
            </div>
            <button
              type="submit"
              disabled={submitted}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gold text-dark-900 font-medium text-sm hover:bg-gold-light transition-all disabled:opacity-50"
            >
              {submitted ? (
                <>
                  <CheckCircle size={16} /> Отправлено
                </>
              ) : (
                <>
                  <Send size={16} /> Отправить
                </>
              )}
            </button>
          </form>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/booking"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gold text-dark-900 font-medium text-sm hover:bg-gold-light transition-all hover:scale-105 active:scale-95"
            >
              Забронировать номер <span className="text-lg">→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
