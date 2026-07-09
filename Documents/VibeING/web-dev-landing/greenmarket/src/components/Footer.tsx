import { Leaf, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/[0.03] bg-[#1A241A]/30" role="contentinfo">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Leaf size={20} className="text-green-light" />
              <span className="font-serif text-lg font-bold">GreenMarket</span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed mb-4">
              Органические продукты от проверенных фермеров с доставкой на дом.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="p-2 rounded-lg bg-white/[0.03] text-white/40 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
                  aria-label={s.label}
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Каталог</h4>
            <ul className="space-y-2">
              {["Фрукты", "Овощи", "Молочные продукты", "Мясо", "Напитки"].map((item) => (
                <li key={item}>
                  <a href="/catalog" className="text-xs text-white/40 hover:text-white/60 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Компания</h4>
            <ul className="space-y-2">
              {["О нас", "Фермеры", "Блог", "Карьера", "Контакты"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs text-white/40 hover:text-white/60 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Помощь</h4>
            <ul className="space-y-2">
              {["Доставка", "Возврат", "FAQ", "Политика конфиденциальности", "Условия"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs text-white/40 hover:text-white/60 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <a href="/home" className="text-xs text-white/30 hover:text-white/60 transition-colors">Главная</a>
            <a href="/catalog" className="text-xs text-white/30 hover:text-white/60 transition-colors">Каталог</a>
            <a href="/subscribe" className="text-xs text-white/30 hover:text-white/60 transition-colors">Подписка</a>
            <a href="/profile" className="text-xs text-white/30 hover:text-white/60 transition-colors">Кабинет</a>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/30">
            <span className="flex items-center gap-1"><Phone size={12} /> +7 (800) 123-45-67</span>
            <span className="flex items-center gap-1"><Mail size={12} /> info@greenmarket.ru</span>
          </div>
          <div className="text-xs text-white/20">© 2025 GreenMarket</div>
        </div>
      </div>
    </footer>
  );
}
