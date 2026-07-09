"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ru">
      <body className="bg-[#0F1410] min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">💥</div>
          <h1 className="text-xl font-bold mb-2">Критическая ошибка</h1>
          <p className="text-sm text-white/40 mb-6">Что-то пошло не так на уровне приложения</p>
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-xl bg-green text-white font-medium text-sm hover:bg-green/80 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </body>
    </html>
  );
}
