"use client";

import { motion } from "framer-motion";
import { PRODUCTS, CATEGORIES as allCategories, REVIEWS } from "@/lib/mock-data";
import { ShoppingCart, Leaf, Truck, Star, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/context";
import ProductCard from "@/components/ProductCard";
import FeatureCard from "@/components/FeatureCard";
import { StarRating } from "@/components/ProductCard";
import { ReviewsList } from "@/components/Reviews";
import { PageSkeleton } from "@/components/Skeleton";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <ProductsSection />
      <Features />
      <Testimonials />
    </>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-16">
      <motion.div animate={{ y: [0, -30, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-32 left-[10%] text-6xl opacity-10">🌿</motion.div>
      <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, delay: 1, repeat: Infinity }} className="absolute top-48 right-[15%] text-4xl opacity-10">🍃</motion.div>
      <motion.div animate={{ y: [0, -25, 0] }} transition={{ duration: 6, delay: 2, repeat: Infinity }} className="absolute bottom-32 left-[20%] text-5xl opacity-10">🌱</motion.div>
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=70" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1410] via-[#0F1410]/80 to-[#0F1410]" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-muted text-green-light text-xs font-medium border border-green/20">
              🌿 100% органические продукты
            </span>
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20">🐾 Демо</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight max-w-2xl" style={{ fontFamily: 'Georgia, serif' }}>
            Свежее с фермы<br />
            <span className="text-green-light">к вашему столу</span>
          </h1>
          <p className="mt-6 text-lg text-white/40 max-w-md leading-relaxed">
            Органические продукты от проверенных фермеров. Бесплатная доставка от 2000 ₽.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <a href="/catalog" className="px-8 py-3.5 rounded-full bg-green text-white font-medium text-sm hover:bg-green/80 transition-all hover:scale-105 active:scale-95">
              Перейти в каталог
            </a>
            <a href="#features" className="px-8 py-3.5 rounded-full border border-white/[0.1] text-sm font-medium hover:border-green/30 hover:text-green-light transition-all">
              Подробнее
            </a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="grid grid-cols-3 gap-6 mt-16 max-w-lg">
          {[{ n: "500+", l: "Товаров" }, { n: "24ч", l: "Доставка" }, { n: "50+", l: "Фермеров" }].map((s) => (
            <div key={s.l}>
              <div className="text-2xl font-bold text-green-light">{s.n}</div>
              <div className="text-xs text-white/30">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: <Search size={28} />, title: "Выберите продукты", desc: "Более 500 органических товаров в каталоге" },
    { icon: <ShoppingCart size={28} />, title: "Оформите подписку", desc: "Выберите коробку и периодичность доставки" },
    { icon: <Truck size={28} />, title: "Получите свежесть", desc: "Доставим за 24 часа прямо к двери" },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>Как работает подписка</h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">Три простых шага к свежим органическим продуктам каждый день</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.03]"
            >
              <div className="w-14 h-14 rounded-2xl bg-green/10 flex items-center justify-center mx-auto mb-4 text-green-light">
                {s.icon}
              </div>
              <div className="text-xs text-white/20 font-bold mb-2">ШАГ {i + 1}</div>
              <h3 className="font-bold mb-2">{s.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  const { addToCart } = useCart();
  const [filter, setFilter] = useState("Все");
  const [wishlisted, setWishlisted] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = filter === "Все" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  return (
    <section id="products" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Каталог</h2>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-full text-xs transition-all ${filter === cat ? "bg-green text-white" : "bg-white/[0.03] text-white/40 hover:bg-white/[0.05] hover:text-white/60"}`}>
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-[#1A241A]/50 border border-white/[0.03] overflow-hidden animate-pulse">
                <div className="aspect-square bg-white/[0.02]" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-white/[0.05] rounded w-3/4" />
                  <div className="h-2 bg-white/[0.03] rounded w-1/2" />
                  <div className="h-4 bg-white/[0.05] rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={addToCart}
                  onView={(slug) => { window.location.href = `/product/${slug}`; }}
                  onToggleWishlist={(p) => {
                    const next = new Set(wishlisted);
                    if (next.has(p.id)) next.delete(p.id); else next.add(p.id);
                    setWishlisted(next);
                  }}
                  isWishlisted={wishlisted.has(product.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-[#1A241A]/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>Почему мы</h2>
          <p className="text-white/40 text-sm">Наши преимущества, которые делают вашу жизнь лучше</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: <Leaf size={28} />, title: "100% органика", desc: "Сертифицированные органические продукты от фермеров" },
            { icon: <Truck size={28} />, title: "Быстрая доставка", desc: "Доставим за 24 часа. Бесплатно от 2000 ₽" },
            { icon: <Star size={28} />, title: "Гарантия свежести", desc: "Вернём деньги, если продукт не понравится" },
          ].map((f, i) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>Отзывы</h2>
          <p className="text-white/40 text-sm">Что говорят наши покупатели</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REVIEWS.slice(0, 6).map((r, i) => (
            <ReviewItem key={r.id} review={r} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewItem({ review, delay }: { review: { id: number; name: string; rating: number; text: string; date: string }; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.03] transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center text-sm font-bold text-green-light">
            {review.name[0]}
          </div>
          <div>
            <p className="text-sm font-medium">{review.name}</p>
            <p className="text-[10px] text-white/30">{review.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={12} className={i < review.rating ? "fill-green-light text-green-light" : "fill-transparent text-white/20"} />
          ))}
        </div>
      </div>
      <p className="text-xs text-white/50 leading-relaxed">{review.text}</p>
    </motion.div>
  );
}
