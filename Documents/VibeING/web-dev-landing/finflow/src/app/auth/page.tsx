"use client";

import { useState, useCallback } from "react";
import { Wallet, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1200));

    // Stub: accept any email/password that looks valid
    if (!form.email.includes("@") || form.password.length < 6) {
      setError("Проверьте email и пароль (минимум 6 символов)");
      setLoading(false);
      return;
    }

    // Save to localStorage
    localStorage.setItem("finflow_user", JSON.stringify({
      email: form.email,
      name: form.name || form.email.split("@")[0],
      loggedIn: true,
      createdAt: new Date().toISOString(),
    }));

    router.push("/dashboard");
  }, [form, router]);

  const handleGoogle = useCallback(async () => {
    setError("");
    setLoading(true);

    // Simulate Google OAuth redirect delay
    await new Promise((r) => setTimeout(r, 1800));

    // Stub Google profile
    localStorage.setItem("finflow_user", JSON.stringify({
      email: "user@gmail.com",
      name: "Google User",
      loggedIn: true,
      provider: "google",
      createdAt: new Date().toISOString(),
    }));

    router.push("/auth/stub");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#030305] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-indigo-600/8 blur-[100px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }} />
      </div>

      <div className="w-full max-w-md">
        {/* Back button */}
        <a href="/" className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> На главную
        </a>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-8 border border-white/[0.06]">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Wallet className="w-[22px] h-[22px] text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-white">Fin</span><span className="text-white/30">Flow</span>
              </h1>
              <p className="text-[10px] text-white/20 tracking-[0.15em] uppercase">VibeING Studio</p>
            </div>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm font-medium text-white/70 hover:bg-white/[0.08] hover:text-white transition-all disabled:opacity-50 mb-6"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {/* Google G icon */}
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 010-9.18l-7.98-6.19a24.0 24.0 0 000 21.56l7.98-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                Войти через Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[11px] text-white/20 uppercase tracking-wider">или</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Имя</label>
                <input
                  type="text" placeholder="Ваше имя"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm placeholder-white/20 text-white focus:outline-none focus:border-violet-500/30 focus:ring-1 focus:ring-violet-500/30 transition-all"
                />
              </div>
            )}
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Email</label>
              <input
                type="email" placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm placeholder-white/20 text-white focus:outline-none focus:border-violet-500/30 focus:ring-1 focus:ring-violet-500/30 transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Пароль</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm placeholder-white/20 text-white focus:outline-none focus:border-violet-500/30 focus:ring-1 focus:ring-violet-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/10 text-xs text-red-300 flex items-center gap-2">
                <span className="shrink-0">⚠</span> {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "login" ? (
                <>
                  <Mail className="w-4 h-4" /> Войти
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Создать аккаунт
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-white/30 mt-6">
            {mode === "login" ? (
              <>Нет аккаунта?{' '}
                <button onClick={() => { setMode("register"); setError(""); }} className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                  Зарегистрироваться
                </button>
              </>
            ) : (
              <>Уже есть аккаунт?{' '}
                <button onClick={() => { setMode("login"); setError(""); }} className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                  Войти
                </button>
              </>
            )}
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-white/15 mt-6">
          Демо-режим. Данные хранятся локально в браузере.
        </p>
      </div>
    </div>
  );
}
