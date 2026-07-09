"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { restaurants, foodCategories } from "@/data/food";
import { addToCart, updateQty, removeFromCart, cartTotal, cartCount, loadCart, saveCart } from "@/store/cartStore";
import { toast } from "@/components/ToastProvider";
import type { CartItem } from "@/store/cartStore";
import { MapPin, Search, Home, Grid, ShoppingBag, Clock, User, Star, ChevronRight, Flame, Truck, Heart } from "lucide-react";
import Link from "next/link";
import DesktopNav from "@/components/DesktopNav";
import MobileNav from "@/components/MobileNav";
import RestaurantCard from "@/components/RestaurantCard";
import SearchBar from "@/components/SearchBar";

import EmptyState from "@/components/EmptyState";
import CartSummary from "@/components/CartSummary";
import QuantityControls from "@/components/QuantityControls";
import Image from "next/image";

const CATEGORY_MAP = {
  "Бургеры": "Бургеры",
  "Японская": "Японская",
  "Пицца": "Итальянская",
  "Шаурма": "Шаурма",
};

const ACTIVE_CATS = foodCategories
  .map((c) => c.replace(/^\w.\s*/, ""))
  .filter((c) => restaurants.some((r) => r.cuisine === (CATEGORY_MAP as any)[c] || r.cuisine === c));

function filterRestaurants(rList: any[], searchQuery: string, selectedCategory: string) {
  return rList.filter((r: any) => {
    const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    if (!selectedCategory) return matchSearch;
    const mapped = (CATEGORY_MAP as any)[selectedCategory] || selectedCategory;
    return matchSearch && r.cuisine === mapped;
  });
}

function CategoryButtons({ selected, onSelect }: { selected: string; onSelect: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("")}
        className={`px-4 py-2 rounded-full text-sm transition-colors ${
          !selected ? "bg-peach text-white" : "bg-dark-700/50 border border-white/[0.03] text-white/60 hover:text-white"
        }`}
      >
        Все
      </button>
      {ACTIVE_CATS.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            selected === c ? "bg-peach text-white" : "bg-dark-700/50 border border-white/[0.03] text-white/60 hover:text-white"
          }`}
        >
          {foodCategories.find((f) => f.includes(c)) || c}
        </button>
      ))}
    </div>
  );
}

function MobileHome({ cart, onAdd, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }: any) {
  const filtered = filterRestaurants(restaurants, searchQuery, selectedCategory);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-white/30 uppercase tracking-wider">Доставка в</div>
          <button className="flex items-center gap-1 text-sm font-medium hover:text-peach transition-colors">
            <MapPin size={14} className="text-peach" />
            <span>ул. Пушкина, 10</span>
            <ChevronRight size={12} className="text-white/30" />
          </button>
        </div>
        <Link href="/cart" className="relative p-2 rounded-full bg-dark-700/50 hover:bg-dark-600 transition-colors">
          <ShoppingBag size={18} className="text-white/60" />
          {cart.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-peach text-[9px] text-white font-bold flex items-center justify-center">
              {cartCount(cart)}
            </span>
          )}
        </Link>
      </div>
      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Найти ресторан или блюдо..." />
      <h2 className="text-base font-bold">Категории</h2>
      <CategoryButtons selected={selectedCategory} onSelect={setSelectedCategory} />
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold">Популярные</h2>
          <Link href="/catalog" className="text-xs text-peach-light hover:text-peach transition-colors">Все →</Link>
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon="search" title="Рестораны не найдены" description="Попробуйте изменить поиск" />
        ) : (
          <div className="scroll-row">
            {filtered.map((r) => (
              <div key={r.id} className="flex-shrink-0 w-[220px]"><RestaurantCard {...r} mobile /></div>
            ))}
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Flame size={16} className="text-peach" />
          <h2 className="text-base font-bold">Акции дня</h2>
        </div>
        <div className="space-y-3">
          {[
            { title: "Скидка 20% на первый заказ", sub: "Код FOOD20", gradient: "from-orange-500/20 to-orange-600/5" },
            { title: "Бесплатная доставка", sub: "От 1500 ₽", gradient: "from-emerald-500/20 to-emerald-600/5" },
          ].map((d, i) => (
            <div key={i} className={`p-4 rounded-2xl bg-gradient-to-r ${d.gradient} border border-white/[0.03]`}>
              <h3 className="font-bold text-sm">{d.title}</h3>
              <p className="text-xs text-white/40 mt-1">{d.sub}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="h-16 md:hidden" />
    </div>
  );
}

function DesktopHome({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }: any) {
  const filtered = filterRestaurants(restaurants, searchQuery, selectedCategory);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <MapPin size={16} className="text-peach" />
          <span className="text-sm">ул. Пушкина, 10</span>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Найти ресторан..." />
          <Link href="/cart" className="relative p-2 rounded-full bg-dark-700/50 hover:bg-dark-600 transition-colors">
            <ShoppingBag size={18} className="text-white/60" />
          </Link>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-6">Добро пожаловать в FoodHub</h1>
      <h2 className="text-lg font-bold mb-4">Категории</h2>
      <CategoryButtons selected={selectedCategory} onSelect={setSelectedCategory} />
      <h2 className="text-lg font-bold mb-4">Популярные рестораны</h2>
      {filtered.length === 0 ? (
        <EmptyState icon="search" title="Рестораны не найдены" description="Попробуйте изменить параметры" />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {filtered.map((r, i) => (
            <motion.div key={r.id} variants={{ hidden: { opacity: 0, y: 12, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, delay: i * 0.05 } } }} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <RestaurantCard {...r} />
            </motion.div>
          ))}
        </div>
      )}
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Flame size={18} className="text-peach" />Акции дня
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          { title: "Скидка 20% на первый заказ", sub: "Код FOOD20", gradient: "from-orange-500/20 to-orange-600/5" },
          { title: "Бесплатная доставка", sub: "От 1500 ₽", gradient: "from-emerald-500/20 to-emerald-600/5" },
        ].map((d, i) => (
          <div key={i} className={`p-4 rounded-2xl bg-gradient-to-r ${d.gradient} border border-white/[0.03]`}>
            <h3 className="font-bold">{d.title}</h3>
            <p className="text-xs text-white/40 mt-1">{d.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Catalog({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }: any) {
  const filtered = filterRestaurants(restaurants, searchQuery, selectedCategory);

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-base md:text-xl font-bold mb-4">Все рестораны</h2>
      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Поиск ресторана..." className="mb-4 md:mb-6 max-w-md" />
      <CategoryButtons selected={selectedCategory} onSelect={setSelectedCategory} />
      {filtered.length === 0 ? (
        <EmptyState icon="search" title="Рестораны не найдены" description="Попробуйте изменить параметры" />
      ) : (
        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4">
          {filtered.map((r, i) => (
            <motion.div key={r.id} variants={{ hidden: { opacity: 0, y: 12, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, delay: i * 0.05 } } }} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <RestaurantCard {...r} className="mb-4" />
            </motion.div>
          ))}
        </div>
      )}
      <div className="h-16 md:hidden" />
    </div>
  );
}

function CartPage({ cart, onUpdateQty, onRemove }: any) {
  const total = cartTotal(cart);
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-base md:text-xl font-bold mb-4">Корзина ({cart.length})</h2>
      {cart.length === 0 ? (
        <EmptyState icon="cart" title="Корзина пуста" description="Добавьте что-нибудь вкусное!" />
      ) : (
        <div className={cart.length > 2 ? "md:flex md:gap-6" : ""}>
          <div className={cart.length > 2 ? "flex-1 md:space-y-3" : "space-y-3"}>
            {cart.map((item) => (
              <div key={item.id} className="food-card flex items-center gap-3 p-3">
                <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.name}</div>
                  <div className="text-peach-light text-sm font-bold">{(item.qty * item.price).toLocaleString()} ₽</div>
                </div>
                <QuantityControls qty={item.qty} onUpdate={(d) => onUpdateQty(item.id, d)} onRemove={() => onRemove(item.id)} price={item.price} />
              </div>
            ))}
          </div>
          {cart.length > 2 && <CartSummary cart={cart} />}
          {cart.length <= 2 && (
            <div className="food-card p-4 mt-4 md:hidden">
              <div className="flex justify-between mb-3">
                <span className="text-sm text-white/40">Итого</span>
                <span className="text-lg font-bold text-peach-light">{total.toLocaleString()} ₽</span>
              </div>
              <Link href="/checkout" className="block w-full py-3 rounded-xl bg-peach text-white font-medium text-sm text-center hover:bg-peach-light transition-colors">
                Оформить →
              </Link>
            </div>
          )}
        </div>
      )}
      <div className="h-16 md:hidden" />
    </div>
  );
}

function OrdersPage() {
  const orders = [
    { id: "#FH-9384", status: "В пути", items: 3, total: 1630, eta: "~20 мин", date: "Сегодня", progress: 60 },
    { id: "#FH-8271", status: "Доставлен", items: 2, total: 890, date: "Вчера", progress: 100 },
    { id: "#FH-7152", status: "Доставлен", items: 4, total: 2150, date: "18.06", progress: 100 },
  ];
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-base md:text-xl font-bold mb-4">Мои заказы</h2>
      {orders.length === 0 ? (
        <EmptyState icon="orders" title="Заказов пока нет" description="Когда оформите первый заказ, он появится здесь" />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="food-card p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/40">{o.id}</span>
                <span className={`text-xs font-medium ${o.status === "В пути" ? "text-peach-light" : "text-white/60"}`}>{o.status}</span>
              </div>
              <div className="text-xs text-white/40 mb-2">{o.items} блюд • {o.total} ₽</div>
              <div className="text-xs text-white/30 mb-2">{o.date}</div>
              {o.status === "В пути" && (
                <>
                  <div className="h-1.5 rounded-full bg-dark-600 overflow-hidden mb-2">
                    <div className="h-full bg-peach rounded-full transition-all duration-1000" style={{ width: `${o.progress}%` }} />
                  </div>
                  <div className="text-xs text-peach-light">🕐 {o.eta}</div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="h-16 md:hidden" />
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="p-4 md:p-6">
      <div className="food-card md:max-w-md p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-peach/20 flex items-center justify-center text-peach font-bold text-lg">А</div>
          <div>
            <h2 className="font-bold text-lg">Александр</h2>
            <p className="text-xs text-white/40">+7 (999) 123-45-67</p>
          </div>
        </div>
        {[
          { icon: Heart, label: "Избранное", color: "text-pink-500" },
          { icon: MapPin, label: "Адреса", color: "text-blue-400" },
          { icon: User, label: "Настройки", color: "text-white/40" },
          { icon: Clock, label: "История", color: "text-peach" },
        ].map((item) => (
          <button key={item.label} className="food-card w-full flex items-center gap-3 p-3 mb-2 hover:bg-white/[0.02] transition-colors">
            <item.icon size={18} className={item.color} />
            <span className="text-sm font-medium flex-1">{item.label}</span>
            <ChevronRight size={14} className="text-white/20" />
          </button>
        ))}
      </div>
      <div className="h-16 md:hidden" />
    </div>
  );
}

export default function FoodHub() {
  const [active, setActive] = useState("home");
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const toastRef = useRef({});

  const showToast = useCallback((message) => {
    const now = Date.now();
    if (toastRef.current[message] && now - toastRef.current[message] < 500) return;
    toastRef.current[message] = now;
    toast.success(message);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (["home", "catalog", "cart", "orders", "profile"].includes(hash)) setActive(hash);
    setCart(loadCart());
    const handler = () => { const h = window.location.hash.replace("#", ""); if (["home", "catalog", "cart", "orders", "profile"].includes(h)) setActive(h); };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const handleSetActive = (a) => { setActive(a); window.location.hash = a; };
  const updateCart = useCallback((newCart) => { setCart(newCart); saveCart(newCart); }, []);

  const handleAddToCart = useCallback(
    (item) => { updateCart(addToCart(cart, item)); showToast(`${item.name} добавлен в корзину`); },
    [cart, updateCart, showToast],
  );

  const handleUpdateQty = useCallback((id, delta) => { updateCart(updateQty(cart, id, delta)); }, [cart, updateCart]);
  const handleRemoveItem = useCallback((id) => { updateCart(removeFromCart(cart, id)); }, [cart, updateCart]);

  return (
    <main>
      <div className="hidden md:block">
        <DesktopNav active={active} setActive={handleSetActive} cartCount={cartCount(cart)} />
        <motion.div className="desktop-content" key={active} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}>
          {active === "home" && <DesktopHome searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />}
          {active === "catalog" && <Catalog searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />}
          {active === "cart" && <CartPage cart={cart} onUpdateQty={handleUpdateQty} onRemove={handleRemoveItem} />}
          {active === "orders" && <OrdersPage />}
          {active === "profile" && <ProfilePage />}
        </motion.div>
      </div>
      <div className="md:hidden">
        {active === "home" && <MobileHome cart={cart} onAdd={handleAddToCart} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />}
        {active === "catalog" && <Catalog searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />}
        {active === "cart" && <CartPage cart={cart} onUpdateQty={handleUpdateQty} onRemove={handleRemoveItem} />}
        {active === "orders" && <OrdersPage />}
        {active === "profile" && <ProfilePage />}
        <MobileNav active={active} setActive={handleSetActive} cartCount={cartCount(cart)} />
      </div>
    </main>
  );
}
