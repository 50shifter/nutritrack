"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md";
}

export default function SearchBar({ value, onChange, placeholder = "Поиск...", className, size = "md" }: Props) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-700/50 border border-white/[0.03] ${className || "max-w-md"}`}>
      <Search size={size === "sm" ? 14 : 16} className="text-white/30 flex-shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/20"
        aria-label={placeholder}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="text-white/30 hover:text-white/60 transition-colors text-xs"
          aria-label="Очистить поиск"
        >
          ✕
        </button>
      )}
    </div>
  );
}
