import Link from "next/link";
import { HeartPulse, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#0891B2] flex items-center justify-center">
                <HeartPulse size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg">Medi<span className="text-[#0891B2]">Care</span></span>
            </Link>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Телемедицина нового поколения. Врачи онлайн 24/7.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-[#E2E8F0]">Услуги</h4>
            <ul className="space-y-2">
              {[
                { label: "Врачи", href: "/doctors" },
                { label: "Записи", href: "/records" },
                { label: "Аптека", href: "/pharmacy" },
                { label: "Блог", href: "/blog" },
              ].map(s => (
                <li key={s.href}>
                  <Link href={s.href} className="text-sm text-[#94A3B8] hover:text-[#0891B2] transition-colors">{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-[#E2E8F0]">Компания</h4>
            <ul className="space-y-2">
              {["О нас", "Карьера", "Партнёры", "Контакты"].map(l => (
                <li key={l}><a href="#" className="text-sm text-[#94A3B8] hover:text-[#0891B2] transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-[#E2E8F0]">Правовое</h4>
            <ul className="space-y-2">
              {["Конфиденциальность", "Условия", "Лицензии", "Возврат"].map(l => (
                <li key={l}><a href="#" className="text-sm text-[#94A3B8] hover:text-[#0891B2] transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-[#E2E8F0]">Контакты</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-[#94A3B8]">
                <Phone size={14} className="text-[#0891B2] shrink-0" /> +7 (800) 123-45-67
              </li>
              <li className="flex items-center gap-2 text-sm text-[#94A3B8]">
                <Mail size={14} className="text-[#0891B2] shrink-0" /> info@medicare.ru
              </li>
              <li className="flex items-center gap-2 text-sm text-[#94A3B8]">
                <MapPin size={14} className="text-[#0891B2] shrink-0" /> Москва
              </li>
            </ul>
            {/* Socials */}
            <div className="flex gap-3 mt-4">
              {["Facebook", "Twitter", "Instagram", "YouTube"].map((label, i) => (
                <a key={i} href="#" aria-label={label} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0891B2] transition-colors">
                  <span className="text-[#94A3B8] text-sm">{label[0]}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <span>© 2025 MediCare. Все права защищены.</span>
          <span>Лицензия № ЛО-77-01-021367</span>
        </div>
      </div>
    </footer>
  );
}
