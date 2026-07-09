"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setSending(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        setEmail("");
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        setError(data.error || "Ошибка подписки");
      }
    } catch {
      setError("Ошибка сети. Попробуйте позже.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Mail size={32} className="mx-auto text-gold-light mb-4" />
          <h3 className="font-serif text-2xl font-bold mb-2">Будьте в курсе</h3>
          <p className="text-sm text-white/40 mb-6">
            Подпишитесь — получаем новые работы, советы по позированию и эксклюзивные предложения
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl bg-dark-700/50 border border-white/[0.05] text-sm focus:outline-none focus:border-gold/30 placeholder:text-white/20"
            />
            <button
              type="submit"
              disabled={sending}
              className="px-6 py-3 rounded-xl bg-gold text-dark-900 font-medium text-sm hover:bg-gold-light transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {sending ? (
                "..."
              ) : submitted ? (
                <span className="flex items-center gap-1">
                  <CheckCircle size={14} />
                </span>
              ) : (
                "Подписаться"
              )}
            </button>
          </form>
          {error && (
            <div className="flex items-center justify-center gap-1 mt-2 text-red-400 text-xs">
              <AlertCircle size={12} />
              {error}
            </div>
          )}
          {submitted && (
            <div className="flex items-center justify-center gap-1 mt-2 text-green-400 text-xs">
              <CheckCircle size={12} />
              Спасибо за подписку!
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
