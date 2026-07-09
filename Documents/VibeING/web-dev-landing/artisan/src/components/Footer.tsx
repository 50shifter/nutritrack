import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/[0.03]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-serif text-2xl font-bold tracking-tight mb-3">
              ARTISAN<span className="text-gold-light">.</span>
            </div>
            <p className="text-xs text-white/30 leading-relaxed">
              Кинематографичная фотография для тех, кто ценит каждый момент.
            </p>
          </div>

          {/* Portfolio */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white/50 mb-3">Портфолио</h4>
            <ul className="space-y-2">
              {["Портреты", "Свадьбы", "Street", "Природа"].map((c) => (
                <li key={c}>
                  <a href="#portfolio" className="text-sm text-white/30 hover:text-gold-light transition-colors">
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white/50 mb-3">Услуги</h4>
            <ul className="space-y-2">
              {["Портретная", "Свадебная", "Лейфстайл", "Коммерческая"].map((s) => (
                <li key={s}>
                  <a href="#services" className="text-sm text-white/30 hover:text-gold-light transition-colors">
                    {s} съёмка
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white/50 mb-3">Правовая информация</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-white/30 hover:text-gold-light transition-colors">Конфиденциальность</Link></li>
              <li><Link href="/terms" className="text-sm text-white/30 hover:text-gold-light transition-colors">Условия</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white/50 mb-3">Контакты</h4>
            <ul className="space-y-2 text-sm text-white/30">
              <li>hello@artisan.photo</li>
              <li>+7 (999) 123-45-67</li>
              <li>Москва</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.03] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/20">
          <span>© 2025 Artisan. Все права защищены.</span>
          <div className="flex items-center gap-4">
            <a href="https://instagram.com/artisan.photo" target="_blank" rel="noopener noreferrer" className="hover:text-gold-light transition-colors">Instagram</a>
            <a href="https://facebook.com/artisan.photo" target="_blank" rel="noopener noreferrer" className="hover:text-gold-light transition-colors">Facebook</a>
            <a href="https://t.me/artisan_photo" target="_blank" rel="noopener noreferrer" className="hover:text-gold-light transition-colors">Telegram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
