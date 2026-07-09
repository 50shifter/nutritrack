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

export default function MobileNav({ active, setActive, cartCount }: Props) {
  return (
    <nav className="mobile-bottom-nav" role="navigation" aria-label="Мобильная навигация">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              className={isActive ? "active" : ""}
              onClick={() => setActive(item.id)}
              aria-current={isActive ? "page" : undefined}
              aria-label={`${item.label}${cartCount > 0 && item.id === "cart" ? `, ${cartCount} товаров` : ""}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
