import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/[0.03]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-serif text-2xl font-bold mb-3">
              Lux<span className="text-gold">Stay</span>.
            </div>
            <p className="text-xs text-white/30 leading-relaxed">
              Роскошные бутик-отели в лучших городах мира. Бронируйте с уверенностью.
            </p>
          </div>

          {/* Hotels */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white/50 mb-3">Отели</h4>
            <ul className="space-y-2">
              {["Париж", "Киото", "Амальфи", "Дубай"].map((c) => (
                <li key={c}>
                  <a href="#hotels" className="text-sm text-white/30 hover:text-gold transition-colors">
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white/50 mb-3">Компания</h4>
            <ul className="space-y-2">
              {["О нас", "Карьера", "Блог", "Контакты"].map((l) => (
                <li key={l}>
                  <a href="#contact" className="text-sm text-white/30 hover:text-gold transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white/50 mb-3">Правовая информация</h4>
            <ul className="space-y-2">
              {["Условия использования", "Политика конфиденциальности", "Cookies"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-white/30 hover:text-gold transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.03] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/20">
          <div>© 2025 LuxStay. Все права защищены.</div>
          <div className="flex items-center gap-4">
            {/* Social placeholders */}
            <a href="#" className="hover:text-gold transition-colors" aria-label="Telegram">TG</a>
            <a href="#" className="hover:text-gold transition-colors" aria-label="Instagram">IG</a>
            <a href="#" className="hover:text-gold transition-colors" aria-label="Facebook">FB</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
