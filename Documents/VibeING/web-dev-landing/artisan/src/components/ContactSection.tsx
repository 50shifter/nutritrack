"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Facebook, Send, CheckCircle, AlertCircle, Send as TelegramIcon } from "lucide-react";

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@artisan.photo" },
  { icon: Phone, label: "Телефон", value: "+7 (999) 123-45-67" },
  { icon: MapPin, label: "Адрес", value: "Москва, Россия" },
];

const socials = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/artisan.photo" },
  { icon: TelegramIcon, label: "Telegram", href: "https://t.me/artisan_photo" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/artisan.photo" },
];

const typeOptions = [
  "Портрет",
  "Свадьба",
  "Коммерческая",
  "Лейфстайл",
  "Другое",
];

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", type: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Укажите имя";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Укажите корректный email";
    if (!form.type) errs.type = "Выберите тип съёмки";
    if (!form.message.trim()) errs.message = "Напишите сообщение";
    else if (form.message.trim().length < 10) errs.message = "Минимум 10 символов";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Форма отправляет данные локально (без серверной части)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    setSubmitError("");

    console.log("Заявка отправлена:", form);

    // Симулируем задержку сети
    await new Promise(r => setTimeout(r, 1500));
    setSubmitted(true);
    setForm({ name: "", email: "", type: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
    setSending(false);
  };

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Info */}
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 className="font-serif text-3xl font-bold mb-4">Давайте создадим</h2>
          <p className="text-white/40 mb-8">
            Свяжитесь со мной для обсуждения вашего проекта. Я отвечаю в течение 24 часов.
          </p>

          <div className="space-y-3">
            {contactInfo.map((c) => (
              <div key={c.value} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                <c.icon size={16} className="text-gold-light shrink-0" />
                <div>
                  <div className="text-xs text-white/40">{c.label}</div>
                  <div className="text-sm">{c.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Socials */}
          <div className="flex gap-3 mt-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/40 hover:text-gold-light hover:border-gold/20 transition-all"
                aria-label={s.label}
              >
                <s.icon size={16} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.03]"
        >
          <div>
            <input
              type="text"
              placeholder="Имя *"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl bg-dark-700/50 border text-sm focus:outline-none placeholder:text-white/20 transition-colors ${
                errors.name ? "border-red-500" : "border-white/[0.05] focus:border-gold/30"
              }`}
            />
            {errors.name && <span className="text-[10px] text-red-400 mt-0.5 block">{errors.name}</span>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email *"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl bg-dark-700/50 border text-sm focus:outline-none placeholder:text-white/20 transition-colors ${
                errors.email ? "border-red-500" : "border-white/[0.05] focus:border-gold/30"
              }`}
            />
            {errors.email && <span className="text-[10px] text-red-400 mt-0.5 block">{errors.email}</span>}
          </div>

          <div>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl bg-dark-700/50 border text-sm focus:outline-none focus:border-gold/30 transition-colors ${
                errors.type ? "border-red-500" : "border-white/[0.05] text-white/50"
              }`}
            >
              <option value="">Тип съёмки</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.type && <span className="text-[10px] text-red-400 mt-0.5 block">{errors.type}</span>}
          </div>

          <div>
            <textarea
              placeholder="Расскажите о проекте..."
              rows={4}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl bg-dark-700/50 border text-sm focus:outline-none placeholder:text-white/20 resize-none transition-colors ${
                errors.message ? "border-red-500" : "border-white/[0.05] focus:border-gold/30"
              }`}
            />
            {errors.message && <span className="text-[10px] text-red-400 mt-0.5 block">{errors.message}</span>}
          </div>

          {/* Error message */}
          {submitError && (
            <div className="flex items-center gap-2 text-red-400 text-xs p-3 rounded-lg bg-red-500/5">
              <AlertCircle size={14} />
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full py-3 rounded-xl bg-gold text-dark-900 font-medium text-sm hover:bg-gold-light transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          title="Демо-режим — заявка не отправляется на сервер"
          >
            {sending ? (
              "Отправка..."
            ) : submitted ? (
              <>
                <CheckCircle size={16} /> Отправлено!
              </>
            ) : (
              <>
                <Send size={16} /> Отправить заявку
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
