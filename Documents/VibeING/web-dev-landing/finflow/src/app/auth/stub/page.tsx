"use client";

import { Wallet, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";

export default function PetProjectStub() {
  return (
    <div className="min-h-screen bg-[#030305] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-indigo-600/8 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="glass-strong rounded-3xl p-8 border border-white/[0.06] text-center space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Wallet className="w-[22px] h-[22px] text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-white">Fin</span><span className="text-white/30">Flow</span>
              </h1>
            </div>
          </div>

          {/* Info icon */}
          <div className="w-16 h-16 mx-auto rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
            <Info className="w-7 h-7 text-yellow-400" />
          </div>

          {/* Text */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white">Pet-project</h2>
            <p className="text-sm text-white/50 leading-relaxed">
              Это демонстрационный проект. Реальная авторизация через Google не подключена — все данные хранятся локально в браузере.
            </p>
          </div>

          {/* Button */}
          <Link href="/dashboard" className="block w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Перейти в демо-режим
          </Link>

          {/* Back */}
          <a href="/auth" className="inline-flex items-center gap-1 text-xs text-white/30 hover:text-white/50 transition-colors">
            ← Вернуться на страницу входа
          </a>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-white/15 mt-6">
          Demo mode. No real authentication is configured.
        </p>
      </div>
    </div>
  );
}
