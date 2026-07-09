"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Heart, Package, CreditCard, MapPin, Star, Bell, Save, Check, AlertCircle } from "lucide-react";
import { z } from "zod";
import { StarRating } from "@/components/ProductCard";
import { REVIEWS, PRODUCTS } from "@/lib/mock-data";
import { useCart } from "@/lib/context";
import { PageSkeleton } from "@/components/Skeleton";


export { PageSkeleton as loading };

const profileSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа"),
  email: z.string().email("Некорректный email"),
  phone: z.string().min(10, "Введите номер"),
});

type Tab = "profile" | "orders" | "wishlist" | "addresses";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState({ name: "Алексей", email: "alex@email.com", phone: "+7 999 123-45-67" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof profile, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    try { profileSchema.parse(profile); setErrors({}); setSaving(true); setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }, 800); }
    catch (e: any) {
      const ne: Record<string, string> = {};
      e.errors?.forEach((err: any) => { if (typeof err.path[0] === "string") ne[err.path[0]] = err.message; });
      setErrors(ne as any);
    }
  };

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/30 to-blue-500/30 flex items-center justify-center text-2xl font-bold text-green-light">А</div>
          <div>
            <h1 className="text-2xl font-bold">Алексей</h1>
            <p className="text-sm text-white/30">Premium клиент с января 2025</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {([
            { key: "profile" as Tab, label: "Профиль", icon: <User size={16} /> },
            { key: "orders" as Tab, label: "Заказы", icon: <Package size={16} /> },
            { key: "wishlist" as Tab, label: "Избранное", icon: <Heart size={16} /> },
            { key: "addresses" as Tab, label: "Адреса", icon: <MapPin size={16} /> },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key ? "bg-green/20 text-green-light" : "text-white/40 hover:bg-white/[0.03] hover:text-white/60"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "profile" && <ProfileTab profile={profile} setProfile={setProfile as any} errors={errors} onSave={handleSave} saving={saving} saved={saved} />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "wishlist" && <WishlistTab />}
        {activeTab === "addresses" && <AddressesTab />}
      </div>
    </div>
  );
}

function ProfileTab({ profile, setProfile, errors, onSave, saving, saved }: {
  profile: { name: string; email: string; phone: string };
  setProfile: (p: Partial<typeof profile>) => void;
  errors: Record<string, string | undefined>;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <h3 className="text-sm font-semibold mb-5">Личные данные</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Имя</label>
            <input type="text" value={profile.name} onChange={(e) => setProfile({ name: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border text-sm placeholder:text-white/20 focus:outline-none transition-colors ${errors.name ? "border-red-500/30" : "border-white/[0.03] focus:border-green/30"}`} />
            {errors.name && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Email</label>
            <input type="email" value={profile.email} onChange={(e) => setProfile({ email: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border text-sm placeholder:text-white/20 focus:outline-none transition-colors ${errors.email ? "border-red-500/30" : "border-white/[0.03] focus:border-green/30"}`} />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Телефон</label>
            <input type="tel" value={profile.phone} onChange={(e) => setProfile({ phone: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border text-sm placeholder:text-white/20 focus:outline-none transition-colors ${errors.phone ? "border-red-500/30" : "border-white/[0.03] focus:border-green/30"}`} />
            {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-sm font-semibold mb-4">Уведомления</h3>
        <div className="space-y-4">
          {[
            { label: "Email-уведомления", desc: "Получать заказы на email", checked: true },
            { label: "Push-уведомления", desc: "Уведомления в браузере", checked: true },
            { label: "Новости и акции", desc: "Специальные предложения", checked: false },
          ].map((n, i) => (
            <label key={i} className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium">{n.label}</p>
                <p className="text-xs text-white/30">{n.desc}</p>
              </div>
              <div className={`w-10 h-6 rounded-full transition-colors relative ${n.checked ? "bg-green/30" : "bg-white/10"}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${n.checked ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Save */}
      <button onClick={onSave} disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green text-white font-medium hover:bg-green/80 transition-colors disabled:opacity-50">
        {saving ? "Сохранение..." : saved ? <><Check size={16} /> Сохранено</> : <><Save size={16} /> Сохранить</>}
      </button>
    </div>
  );
}

function OrdersTab() {
  const orders = [
    { id: "#GM-2847", date: "15 янв 2025", status: "delivered", statusLabel: "Доставлен", total: 4590, items: 5 },
    { id: "#GM-3012", date: "20 янв 2025", status: "in_transit", statusLabel: "В пути", total: 2190, items: 3 },
    { id: "#GM-3156", date: "22 янв 2025", status: "processing", statusLabel: "Обработка", total: 5890, items: 7 },
  ];
  const statusColors: Record<string, string> = {
    processing: "text-yellow-400 bg-yellow-500/10",
    shipped: "text-blue-400 bg-blue-500/10",
    in_transit: "text-green-400 bg-green-500/10",
    delivered: "text-green-light bg-green-light/10",
    cancelled: "text-red-400 bg-red-500/10",
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold">{order.id}</p>
              <p className="text-xs text-white/30">{order.date}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
              {order.statusLabel}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/30">{order.items} товаров</p>
            <p className="text-sm font-bold">{order.total.toLocaleString()} ₽</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function WishlistTab() {
  const { addToCart } = useCart();
  const wishlistItems = PRODUCTS.slice(0, 4);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {wishlistItems.map((item) => (
        <div key={item.id} className="glass rounded-2xl p-4 flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.name}</p>
            <div className="flex items-center gap-1 mt-1">
              <StarRating rating={item.rating} size={10} />
              <span className="text-xs text-white/30">{item.rating}</span>
            </div>
            <p className="text-sm font-bold text-green-light mt-1">{item.price} ₽</p>
          </div>
          <button
            onClick={() => addToCart(item)}
            className="px-3 py-1.5 rounded-lg bg-green/20 text-green-light text-xs font-medium hover:bg-green/30 transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50"
            aria-label={`Добавить ${item.name} в корзину`}
          >
            В корзину
          </button>
        </div>
      ))}
    </div>
  );
}

function AddressesTab() {
  const addresses = [
    { id: "1", label: "Дом", street: "ул. Тверская, 12, кв. 45", city: "Москва", isDefault: true },
    { id: "2", label: "Работа", street: "пр. Мира, 78, офис 201", city: "Москва", isDefault: false },
  ];

  return (
    <div className="space-y-4">
      <button className="w-full p-4 rounded-xl border border-dashed border-white/[0.1] text-sm text-white/40 hover:text-white/60 hover:border-white/[0.2] transition-colors flex items-center justify-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Добавить адрес
      </button>
      {addresses.map((a) => (
        <div key={a.id} className="glass rounded-2xl p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-bold">{a.label}</p>
              {a.isDefault && <span className="px-2 py-0.5 rounded-md bg-green/20 text-green-light text-[10px] font-medium">Основной</span>}
            </div>
            <p className="text-xs text-white/40">{a.street}</p>
            <p className="text-xs text-white/30">{a.city}</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-white/[0.03] text-white/30 hover:text-white/60 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          </button>
        </div>
      ))}
    </div>
  );
}
