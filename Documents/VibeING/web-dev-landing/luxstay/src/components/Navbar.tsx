"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const links = [
  { href: "#hotels", label: "Отели" },
  { href: "#experiences", label: "Впечатления" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#contact", label: "Контакты" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-dark-900/90 backdrop-blur-xl border-b border-gold/10 py-3" : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold">
          Lux<span className="text-gold">Stay</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors relative group ${
                activeSection === l.href.slice(1) ? "text-gold" : "text-white/40 hover:text-gold"
              }`}
            >
              {l.label}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-500 ${
                  activeSection === l.href.slice(1) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </a>
          ))}
          <Link
            href="/booking"
            className="px-5 py-2.5 rounded-full text-sm bg-gold text-dark-900 font-medium hover:bg-gold-light transition-colors"
          >
            Забронировать
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Меню"
          aria-expanded={mobileOpen}
        >
          <span className={`block w-6 h-0.5 bg-gold transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gold transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gold transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-[52px] bg-dark-900/95 backdrop-blur-xl border-b border-gold/10 transition-all duration-300 ${
          mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center py-6 gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="text-white/70 hover:text-gold transition-colors text-lg"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/booking"
            onClick={() => setMobileOpen(false)}
            className="mt-2 px-6 py-3 rounded-full text-sm bg-gold text-dark-900 font-medium"
          >
            Забронировать
          </Link>
        </div>
      </div>
    </nav>
  );
}
