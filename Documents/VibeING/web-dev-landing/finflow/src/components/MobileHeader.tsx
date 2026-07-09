"use client";

import { Menu, Bell } from "lucide-react";
import { Page } from "@/lib/types";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-30 glass-strong border-b border-white/5 px-4 py-3 flex items-center justify-between">
      <button className="text-white/50" onClick={onMenuClick}>
        <Menu className="w-5 h-5" />
      </button>
      <div className="font-bold">
        <span className="text-gradient">Fin</span>
        <span className="text-white/30">Flow</span>
      </div>
      <button className="p-2 rounded-xl hover:bg-white/5 transition-colors text-white/50">
        <Bell className="w-5 h-5" />
      </button>
    </header>
  );
}
