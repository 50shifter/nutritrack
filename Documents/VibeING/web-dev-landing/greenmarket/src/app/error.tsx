"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0F1410]">
      <div className="text-center">
        <div className="text-6xl mb-4">😵</div>
        <h1 className="text-xl font-bold mb-2">Что-то пошло не так</h1>
        <p className="text-sm text-white/40 mb-6">{error.message || "Неизвестная ошибка"}</p>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-xl bg-green text-white font-medium text-sm hover:bg-green/80 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
