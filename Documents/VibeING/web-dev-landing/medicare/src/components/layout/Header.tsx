"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartPulse, Search, Calendar, X, Menu, User, LogIn } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { id: "/", label: "Главная", href: "/" },
    { id: "/doctors", label: "Врачи", href: "/doctors" },
    { id: "/records", label: "Записи", href: "/records" },
    { id: "/pharmacy", label: "Аптека", href: "/pharmacy" },
    { id: "/blog", label: "Блог", href: "/blog" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0891B2] flex items-center justify-center">
            <HeartPulse size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-[#1E293B]">Medi<span className="text-[#0891B2]">Care</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.id}
              href={l.href}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                pathname === l.href
                  ? "bg-[#0891B2]/10 text-[#0891B2] font-medium"
                  : "text-[#475569] hover:text-[#0891B2]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search toggle */}
          {!searchOpen ? (
            <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors" aria-label="Поиск">
              <Search size={18} className="text-[#475569]" />
            </button>
          ) : (
            <button onClick={() => setSearchOpen(false)} className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors" aria-label="Закрыть поиск">
              <X size={18} className="text-[#475569]" />
            </button>
          )}

          {/* Profile / Auth */}
          <Link href="/profile" className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors" aria-label="Профиль">
            <User size={18} className="text-[#475569]" />
          </Link>

          {/* Sign in */}
          <Link href="/auth/signin" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0891B2] text-white text-sm font-medium hover:bg-[#0891B2]/90 transition-colors">
            <LogIn size={14} />
            <span>Войти</span>
          </Link>

          {/* Desktop mobile toggle (for showing mobile menu button) */}
          <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors" aria-label="Меню">
            <Menu size={18} className="text-[#475569]" />
          </button>
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-[#E2E8F0] overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-3">
              <input
                type="text"
                placeholder="Поиск врачей, статей..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] text-sm outline-none focus:border-[#0891B2] transition-colors"
                autoFocus
                aria-label="Поиск"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-white shadow-xl md:hidden"
            >
              <div className="p-4 flex items-center justify-between border-b border-[#E2E8F0]">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0891B2] flex items-center justify-center">
                    <HeartPulse size={16} className="text-white" />
                  </div>
                  <span className="font-bold text-base text-[#1E293B]">Medi<span className="text-[#0891B2]">Care</span></span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-[#F1F5F9]">
                  <X size={18} className="text-[#475569]" />
                </button>
              </div>
              <div className="p-4 space-y-1">
                {links.map(l => (
                  <Link
                    key={l.id}
                    href={l.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg text-sm transition-colors ${
                      pathname === l.href ? "bg-[#0891B2]/10 text-[#0891B2] font-medium" : "text-[#475569] hover:text-[#0891B2] hover:bg-[#F1F5F9]"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-[#E2E8F0]">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-[#475569] hover:bg-[#F1F5F9] transition-colors"
                  >
                    <User size={16} /> Профиль
                  </Link>
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm bg-[#0891B2] text-white font-medium hover:bg-[#0891B2]/90 transition-colors mt-1"
                  >
                    <LogIn size={16} /> Войти
                  </Link>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
