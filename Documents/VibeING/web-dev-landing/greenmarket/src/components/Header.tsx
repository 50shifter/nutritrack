"use client";

import { ShoppingCart, Search, Leaf, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/context";
import Link from "next/link";

export default function Header() {
  const { itemCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      window.location.href = `/catalog?q=${encodeURIComponent(searchValue.trim())}`;
    }
  };

  const navItems = [
    { href: "/catalog", label: "Каталог" },
    { href: "/subscribe", label: "Подписка" },
    { href: "/profile", label: "Кабинет" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled ? "bg-[#0F1410]/90 backdrop-blur-lg border-b border-white/[0.03]" : ""
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2 group" aria-label="GreenMarket — на главную">
          <Leaf size={20} className="text-green-light transition-transform group-hover:scale-110" />
          <span className="text-xl font-bold tracking-tight">GreenMarket</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Основная навигация">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-white/60 hover:text-white transition-colors focus:outline-none focus-visible:text-peach"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search + Cart */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.03] focus-within:border-green/30 transition-colors">
            <Search size={16} className="text-white/30 flex-shrink-0" />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Найти продукты..."
              className="bg-transparent text-sm outline-none w-32 placeholder:text-white/20"
              aria-label="Поиск продуктов"
            />
          </form>

          {/* Cart button */}
          <button
            onClick={openCart}
            className="relative p-2 rounded-full hover:bg-white/[0.03] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50"
            aria-label={`Корзина, ${itemCount} товаров`}
          >
            <ShoppingCart size={20} className="text-white/60" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green text-white text-[10px] flex items-center justify-center font-bold animate-bounce-in">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/[0.03] transition-colors"
            aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} className="text-white/60" /> : <Menu size={20} className="text-white/60" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.03] bg-[#0F1410]/95 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.03] mb-3">
              <Search size={16} className="text-white/30" />
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Найти продукты..."
                className="bg-transparent text-sm outline-none flex-1 placeholder:text-white/20"
                aria-label="Поиск продуктов"
              />
            </form>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-4 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.03] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
