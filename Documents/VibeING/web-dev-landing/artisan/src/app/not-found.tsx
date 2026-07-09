import { CameraOff, Search, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="font-serif text-8xl font-bold gold-text mb-4">404</div>
        <h1 className="font-serif text-2xl font-bold mb-2">Кадр не найден</h1>
        <p className="text-white/40 mb-6 max-w-md">
          Запрашиваемая страница не существует или была перемещена.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-dark-900 text-sm font-medium hover:bg-gold-light transition-colors"
          >
            <Home size={14} /> На главную
          </Link>
          <a
            href="#portfolio"
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-gold/30 text-gold-light text-sm hover:bg-gold hover:text-dark-900 transition-all"
          >
            <Search size={14} /> Смотреть работы
          </a>
        </div>
      </div>
    </div>
  );
}
