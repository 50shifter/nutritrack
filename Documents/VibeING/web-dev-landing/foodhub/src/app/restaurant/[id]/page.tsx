"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { restaurants } from "@/data/food";
import { addToCart, saveCart, cartTotal as calcCartTotal, cartCount as calcCartCount, loadCart } from "@/store/cartStore";
import { toast } from "@/components/ToastProvider";
import type { CartItem } from "@/store/cartStore";
import MenuItemCard from "@/components/MenuItemCard";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";
import { ArrowLeft, Star, Truck, Clock, MapPin, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const restaurant = restaurants.find((r) => r.id === id);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const toastRef = useRef<Record<string, number>>({});

  useEffect(() => {
    setCart(loadCart());
  }, []);

  const showToast = (message: string) => {
    const now = Date.now();
    if (toastRef.current[message] && now - toastRef.current[message] < 500) return;
    toastRef.current[message] = now;
    toast.success(message);
  };

  if (!restaurant) {
    return (
      <div className="p-4 md:p-6 min-h-screen flex items-center justify-center">
        <EmptyRestaurant />
      </div>
    );
  }

  const categories = Array.from(new Set(restaurant.menu.map((m) => m.category)));
  const filteredMenu = restaurant.menu.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = !activeCategory || item.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {/* Hero image */}
      <div className="relative h-56 md:h-80 overflow-hidden">
        <Image src={restaurant.image} alt={restaurant.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 md:top-6 md:left-6 p-2 rounded-full bg-dark-900/60 backdrop-blur-sm hover:bg-dark-900/80 transition-colors text-white"
          aria-label="Назад"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:max-w-lg">
          <h1 className="text-xl md:text-3xl font-bold text-white mb-2">{restaurant.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
            <span className="flex items-center gap-1">
              <Star size={14} className="fill-yellow-500 text-yellow-500" />
              {restaurant.rating}
            </span>
            <span className="flex items-center gap-1">
              <Truck size={14} />
              {restaurant.deliveryTime} мин
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {restaurant.deliveryFee} ₽ доставка
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={14} className="text-white/40" />
          <span className="text-xs text-white/40">Мин. заказ: {restaurant.minOrder} ₽</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {restaurant.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-peach-muted text-peach text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 md:px-6">
        {/* Search */}
        <div className="mb-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Найти в меню..." size="md" className="max-w-full" />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setActiveCategory("")}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              !activeCategory ? "bg-peach text-white" : "bg-dark-700/50 border border-white/[0.03] text-white/60 hover:text-white"
            }`}
          >
            Все
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeCategory === cat ? "bg-peach text-white" : "bg-dark-700/50 border border-white/[0.03] text-white/60 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu items */}
        {filteredMenu.length === 0 ? (
          <EmptyState icon="search" title="Ничего не найдено" description="Попробуйте изменить параметры" />
        ) : (
          <div className="space-y-3">
            {filteredMenu.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAdd={(menuItem) => {
                  setCart((prev) => {
                    const newCart = addToCart(prev, {
                      id: String(menuItem.id),
                      name: menuItem.name,
                      price: menuItem.price,
                      image: menuItem.image,
                      restaurant: restaurant.name,
                      restaurantId: restaurant.id,
                    });
                    saveCart(newCart);
                    return newCart;
                  });
                  showToast(`${menuItem.name} добавлен в корзину`);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cart bar mobile */}
      {calcCartCount(cart) > 0 && (
        <div className="fixed bottom-16 md:hidden left-4 right-4 z-50">
          <Link
            href="/cart"
            className="flex items-center justify-between p-4 rounded-2xl bg-peach text-white font-medium shadow-lg active:scale-[0.98] transition-transform"
          >
            <span className="flex items-center gap-2">
              <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">{calcCartCount(cart)} товаров</span>
              <span>В корзине</span>
            </span>
            <span className="font-bold">{calcCartTotal(cart).toLocaleString()} ₽</span>
          </Link>
        </div>
      )}
    </div>
  );
}

function EmptyRestaurant() {
  return (
    <div className="text-center py-20">
      <h1 className="text-xl font-bold mb-2">Ресторан не найден</h1>
      <p className="text-sm text-white/40 mb-6">Возможно, он был удалён или ссылка некорректна</p>
      <Link href="/" className="px-6 py-2 rounded-xl bg-peach text-white font-medium text-sm hover:bg-peach-light transition-colors inline-block">
        ← На главную
      </Link>
    </div>
  );
}
