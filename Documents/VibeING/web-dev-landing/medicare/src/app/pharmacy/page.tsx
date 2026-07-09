"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/ui/PageTransition";
import { Search, ShoppingCart, Plus, Minus, X, Pill, Star } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  dosage: string;
  rating: number;
}

const products: Product[] = [
  { id: 1, name: "Витамин D3", price: 450, image: "https://images.unsplash.com/photo-1584308666744-642ee3057b10?w=300&h=300&fit=crop", category: "Витамины", description: "Поддержка иммунитета и костной ткани. 60 капсул.", dosage: "1 таблетка в день", rating: 4.8 },
  { id: 2, name: "Омега-3", price: 780, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop", category: "Витамины", description: "Полезные жирные кислоты для сердца и мозга. 90 капсул.", dosage: "2 капсулы в день", rating: 4.7 },
  { id: 3, name: "Эналаприл", price: 120, image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=300&h=300&fit=crop", category: "Рецептурные", description: "Антигипертензивное средство. 20 таб.", dosage: "По назначению врача", rating: 4.9 },
  { id: 4, name: "Ибупрофен", price: 85, image: "https://images.unsplash.com/photo-1471864190281-a93a30a0c18b?w=300&h=300&fit=crop", category: "Обезболивающие", description: "Противовоспалительное и обезболивающее. 30 таб.", dosage: "По необходимости", rating: 4.6 },
  { id: 5, name: "Мультивитамины A-Z", price: 920, image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&h=300&fit=crop", category: "Витамины", description: "Комплекс витаминов и минералов. 60 таблеток.", dosage: "1 таблетка в день", rating: 4.5 },
  { id: 6, name: "Магний B6", price: 380, image: "https://images.unsplash.com/photo-1559757175-5e977c4f3e6b?w=300&h=300&fit=crop", category: "Витамины", description: "Поддержка нервной системы. 30 таблеток.", dosage: "1 таблетка 2 раза в день", rating: 4.8 },
];

export default function PharmacyPage() {
  const [cart, setCart] = useState<Map<number, number>>(new Map());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showCart, setShowCart] = useState(false);

  const categories = ["Все", ...Array.from(new Set(products.map(p => p.category)))];

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || category === "Все" || p.category === category;
    return matchSearch && matchCat;
  });

  const addToCart = (id: number) => {
    setCart(prev => {
      const next = new Map(prev);
      next.set(id, (next.get(id) || 0) + 1);
      return next;
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const next = new Map(prev);
      if ((next.get(id) || 0) > 1) {
        next.set(id, next.get(id)! - 1);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const cartTotal = Array.from(cart.entries()).reduce((sum, [id, qty]) => {
    const product = products.find(p => p.id === id);
    return sum + (product?.price || 0) * qty;
  }, 0);

  const cartCount = Array.from(cart.values()).reduce((a, b) => a + b, 0);

  return (
    <main>
      <Header />
      <PageTransition>
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h2 className="font-bold text-3xl text-dark mb-2">Онлайн-аптека</h2>
              <p className="text-text/50">Заказ лекарств с доставкой на дом</p>
            </div>

            {/* Search & filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0]">
                <Search size={16} className="text-text/30" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск лекарств..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-text/30" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map(c => (
                  <button key={c} onClick={() => setCategory(c === "Все" ? "" : c)} className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${category === (c === "Все" ? "" : c) ? "bg-[#0891B2] text-white" : "bg-white border border-[#E2E8F0] text-dark hover:border-[#0891B2]"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Cart toggle */}
            {cartCount > 0 && (
              <motion.button initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onClick={() => setShowCart(!showCart)} className="fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full bg-[#0891B2] text-white font-medium shadow-xl shadow-[#0891B2]/30 flex items-center gap-2 hover:bg-[#0891B2]/90 transition-colors">
                <ShoppingCart size={20} />
                <span>{cartCount}</span>
                <span className="text-sm">{cartTotal.toLocaleString()} ₽</span>
              </motion.button>
            )}

            {/* Cart panel */}
            {showCart && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="fixed right-4 top-20 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] p-5 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-dark">Корзина</h3>
                  <button onClick={() => setShowCart(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Закрыть"><X size={16} /></button>
                </div>
                {Array.from(cart.entries()).map(([id, qty]) => {
                  const product = products.find(p => p.id === id);
                  if (!product) return null;
                  return (
                    <div key={id} className="flex items-center gap-3 py-3 border-b border-[#E2E8F0] last:border-0">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-dark truncate">{product.name}</div>
                        <div className="text-xs text-text/40">{product.price} ₽</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => removeFromCart(id)} className="w-7 h-7 rounded-lg bg-[#F1F5F9] flex items-center justify-center hover:bg-gray-200 transition-colors"><Minus size={14} /></button>
                        <span className="text-sm font-medium w-6 text-center">{qty}</span>
                        <button onClick={() => addToCart(id)} className="w-7 h-7 rounded-lg bg-[#F1F5F9] flex items-center justify-center hover:bg-gray-200 transition-colors"><Plus size={14} /></button>
                      </div>
                    </div>
                  );
                })}
                <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-text/50">Итого:</span>
                    <span className="font-bold text-dark">{cartTotal.toLocaleString()} ₽</span>
                  </div>
                  <button className="w-full py-2.5 rounded-xl bg-[#0891B2] text-white font-medium text-sm hover:bg-[#0891B2]/90 transition-colors">Оформить заказ</button>
                </div>
              </motion.div>
            )}

            {/* Products grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:border-[#0891B2]/30 transition-all">
                  <div className="overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] text-[#0891B2] font-medium uppercase tracking-wider">{p.category}</span>
                    <h3 className="font-bold text-dark mt-1">{p.name}</h3>
                    <p className="text-sm text-text/50 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-3">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-dark">{p.rating}</span>
                    </div>

                    {/* Dosage */}
                    <div className="mt-2 text-xs text-text/40">📋 {p.dosage}</div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E2E8F0]">
                      <span className="font-bold text-lg text-dark">{p.price} ₽</span>
                      <button onClick={() => addToCart(p.id)} className="px-4 py-2 rounded-xl bg-[#0891B2]/5 text-[#0891B2] text-sm font-medium hover:bg-[#0891B2] hover:text-white transition-all flex items-center gap-1.5">
                        <ShoppingCart size={14} /> В корзину
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-text/40">Лекарства не найдены. Попробуйте изменить запрос.</div>
            )}
          </div>
        </section>
      </PageTransition>
      <Footer />
    </main>
  );
}
