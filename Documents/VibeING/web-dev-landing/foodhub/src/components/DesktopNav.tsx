"use client";

import { Home, Grid, ShoppingBag, Clock, User } from "lucide-react";

interface NavItem {
  id: string;
  icon: typeof Home;
  label: string;
}

interface Props {
  active: string;
  setActive: (a: string) => void;
  cartCount: number;
}

const navItems: NavItem[] = [
  { id: "home", icon: Home, label: "Главная" },
  { id: "catalog", icon: Grid, label: "Каталог" },
  { id: "cart", icon: ShoppingBag, label: "Корзина" },
  { id: "orders", icon: Clock, label: "Заказы" },
  { id: "profile", icon: User, label: "Профиль" },
];

export default function DesktopNav({ active, setActive, cartCount }: Props) {
  return (
    <aside className="desktop-sidebar" role="navigation" aria-label="Основная навигация">
      <div className="px-6 pb-6 mb-4 border-b border-white/[0.03]">
        <h1 className="text-lg font-bold">🍔 FoodHub</h1>
      </div>
      {navItems.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            className={isActive ? "active" : ""}
            onClick={() => setActive(item.id)}
            aria-current={isActive ? "page" : undefined}
            aria-label={item.label}
          >
            <item.icon size={18} />
            <span className="flex-1 text-left">{item.label}</span>
            {item.id === "cart" && cartCount > 0 && (
              <span className="bg-peach text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        );
      })}
      <div className="absolute bottom-8 left-0 right-0 px-6">
        <button
          className="w-full py-2.5 rounded-xl bg-peach text-white text-sm font-medium hover:bg-peach-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-light"
          aria-label="Смотреть акции"
        >
          🎁 Акции
        </button>
      </div>
    </aside>
  );
}
