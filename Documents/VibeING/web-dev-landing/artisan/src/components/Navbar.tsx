"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavbarProps {
  activeSection: string;
}

const navLinks = [
  { href: "#portfolio", label: "Портфолио" },
  { href: "#services", label: "Услуги" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#contact", label: "Контакты" },
];

export default function Navbar({ activeSection }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-dark-900/90 backdrop-blur-xl border-b border-white/[0.03] py-3" : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
          ARTISAN<span className="text-gold-light">.</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-xs tracking-wider uppercase transition-colors relative ${
                activeSection === l.href.slice(1) ? "text-gold-light" : "text-white/40 hover:text-gold-light"
              }`}
            >
              {l.label}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-gold-light transition-all duration-500 ${
                  activeSection === l.href.slice(1) ? "w-full" : "w-0 hover:w-full"
                }`}
              />
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        {/* Theme toggle */}
        <ThemeToggle />

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Меню"
          aria-expanded={mobileOpen}
        >
          <span className={`block w-6 h-0.5 bg-gold-light transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gold-light transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gold-light transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-[52px] bg-dark-900/95 backdrop-blur-xl border-b border-white/[0.03] transition-all duration-300 ${
          mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center py-6 gap-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={`text-sm tracking-wider uppercase transition-colors ${
                activeSection === l.href.slice(1) ? "text-gold-light" : "text-white/60 hover:text-gold-light"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
