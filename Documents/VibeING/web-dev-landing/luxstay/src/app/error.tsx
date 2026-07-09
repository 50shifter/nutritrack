"use client";

import { useEffect } from "react";
import { Home } from "lucide-react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🏨</div>
        <h1 className="font-serif text-3xl font-bold mb-2">Что-то пошло не так</h1>
        <p className="text-white/40 mb-6 max-w-md">
          Мы уже работаем над исправлением. Пожалуйста, попробуйте обновить страницу.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-full border border-gold/30 text-gold-light text-sm hover:bg-gold hover:text-dark-900 transition-all"
          >
            Обновить
          </button>
          <Link href="/" className="flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-dark-900 text-sm font-medium hover:bg-gold-light transition-colors">
            <Home size={16} /> На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
