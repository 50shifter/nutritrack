"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeartPulse, Mail, Lock, User, Calendar, AlertCircle, ArrowRight, Phone } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "", dob: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Register via server action
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, phone: form.phone, dob: form.dob }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка регистрации");
      } else {
        // Auto sign in after registration
        await signIn("credentials", { email: form.email, password: form.password, redirect: false });
        router.push("/profile");
        router.refresh();
      }
    } catch {
      setError("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0891B2]/5 via-white to-[#F1F5F9] px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#0891B2] flex items-center justify-center">
            <HeartPulse size={22} className="text-white" />
          </div>
          <span className="font-bold text-xl text-[#1E293B]">Medi<span className="text-[#0891B2]">Care</span></span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="font-bold text-2xl text-[#1E293B]">Регистрация</h1>
            <p className="text-sm text-text/50 mt-2">Создайте аккаунт для доступа к сервисам</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-text/50 uppercase tracking-wider flex items-center gap-1.5 mb-2"><User size={14} /> Имя</label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="Иван Петров" className="w-full px-4 py-3 rounded-xl bg-[#F1F5F9] border border-transparent focus:border-[#0891B2] text-sm outline-none transition-colors" />
            </div>

            <div>
              <label className="text-xs text-text/50 uppercase tracking-wider flex items-center gap-1.5 mb-2"><Mail size={14} /> Email</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl bg-[#F1F5F9] border border-transparent focus:border-[#0891B2] text-sm outline-none transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text/50 uppercase tracking-wider flex items-center gap-1.5 mb-2"><Phone size={14} /> Телефон</label>
                <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+7 (___) ___-__-__" className="w-full px-4 py-3 rounded-xl bg-[#F1F5F9] border border-transparent focus:border-[#0891B2] text-sm outline-none transition-colors" />
              </div>
              <div>
                <label className="text-xs text-text/50 uppercase tracking-wider flex items-center gap-1.5 mb-2"><Calendar size={14} /> Дата рождения</label>
                <input type="date" value={form.dob} onChange={e => setForm(p => ({ ...p, dob: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-[#F1F5F9] border border-transparent focus:border-[#0891B2] text-sm outline-none transition-colors" />
              </div>
            </div>

            <div>
              <label className="text-xs text-text/50 uppercase tracking-wider flex items-center gap-1.5 mb-2"><Lock size={14} /> Пароль</label>
              <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} placeholder="Минимум 6 символов" className="w-full px-4 py-3 rounded-xl bg-[#F1F5F9] border border-transparent focus:border-[#0891B2] text-sm outline-none transition-colors" />
            </div>

            <div>
              <label className="text-xs text-text/50 uppercase tracking-wider flex items-center gap-1.5 mb-2">Подтвердите пароль</label>
              <input type="password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} required placeholder="Повторите пароль" className="w-full px-4 py-3 rounded-xl bg-[#F1F5F9] border border-transparent focus:border-[#0891B2] text-sm outline-none transition-colors" />
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-[#0891B2] text-white font-medium hover:bg-[#0891B2]/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#0891B2]/20 disabled:opacity-50">
              {loading ? "Регистрация..." : <><ArrowRight size={16} /> Создать аккаунт</>}
            </button>
          </form>

          {/* Link to signin */}
          <p className="text-center text-sm text-text/50">
            Уже есть аккаунт?{" "}
            <Link href="/auth/signin" className="text-[#0891B2] font-medium hover:underline">Войти</Link>
          </p>
        </div>

        {/* Back to home */}
        <p className="text-center text-xs text-text/40 mt-6">
          <Link href="/" className="hover:text-[#0891B2] transition-colors">← Вернуться на главную</Link>
        </p>
      </motion.div>
    </div>
  );
}
