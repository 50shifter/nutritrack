"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme;
    if (stored === "light") {
      setTheme("light");
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    if (next === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center hover:border-gold/20 transition-colors"
      aria-label="Переключить тему"
    >
      {theme === "dark" ? <Sun size={14} className="text-gold-light" /> : <Moon size={14} className="text-gold-light" />}
    </button>
  );
}

