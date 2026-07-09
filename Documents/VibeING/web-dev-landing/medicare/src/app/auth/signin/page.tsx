"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeartPulse, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

function SignInFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error === "CredentialsSignin" ? "Неверный email или пароль" : "Произошла ошибка");
      } else {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0891B2]/5 via-white to-[#F1F5F9] px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#0891B2] flex items-center justify-center">
            <HeartPulse size={22} className="text-white" />
          </div>
          <span className="font-bold text-xl text-[#1E293B]">Medi<span className="text-[#0891B2]">Care</span></span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="font-bold text-2xl text-[#1E293B]">Вход в аккаунт</h1>
            <p className="text-sm text-text/50 mt-2">Введите данные для входа в личный кабинет</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}

          {/* Demo credentials */}
          {!searchParams.get("demo") && (
            <div className="p-3 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] text-xs">
              <span className="text-text/40 font-medium">Демо-режим:</span>
              <br />
              email: demo@medicare.ru / пароль: demo123
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-text/50 uppercase tracking-wider flex items-center gap-1.5 mb-2"><Mail size={14} /> Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl bg-[#F1F5F9] border border-transparent focus:border-[#0891B2] text-sm outline-none transition-colors" />
            </div>

            <div>
              <label className="text-xs text-text/50 uppercase tracking-wider flex items-center gap-1.5 mb-2"><Lock size={14} /> Пароль</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="Минимум 6 символов" className="w-full px-4 py-3 rounded-xl bg-[#F1F5F9] border border-transparent focus:border-[#0891B2] text-sm outline-none transition-colors" />
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-[#0891B2] text-white font-medium hover:bg-[#0891B2]/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#0891B2]/20 disabled:opacity-50">
              {loading ? "Вход..." : <><ArrowRight size={16} /> Войти</>}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-xs text-text/40">или</span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => signIn("google", { callbackUrl: "/profile" })} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-medium hover:bg-gray-50 transition-colors">Google</button>
            <button onClick={() => signIn("github", { callbackUrl: "/profile" })} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-medium hover:bg-gray-50 transition-colors">GitHub</button>
          </div>

          {/* Link to signup */}
          <p className="text-center text-sm text-text/50">Нет аккаунта? <Link href="/auth/signup" className="text-[#0891B2] font-medium hover:underline">Зарегистрироваться</Link></p>
        </div>

        {/* Back to home */}
        <p className="text-center text-xs text-text/40 mt-6"><Link href="/" className="hover:text-[#0891B2] transition-colors">← Вернуться на главную</Link></p>
      </motion.div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInFormInner />
    </Suspense>
  );
}
