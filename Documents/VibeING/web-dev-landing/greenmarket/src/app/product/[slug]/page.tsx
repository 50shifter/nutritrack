"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Star, ChevronLeft, ChevronRight, Heart, Plus, Minus, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { StarRating } from "@/components/ProductCard";
import ReviewItem, { ReviewsList } from "@/components/Reviews";
import { PRODUCTS, CATEGORIES as allCategories, REVIEWS } from "@/lib/mock-data";
import { useCart } from "@/lib/context";
import Image from "next/image";
import { PageSkeleton } from "@/components/Skeleton";
import type { Product } from "@/lib/types";
import { initMetrics, trackEvent } from "@shared-metrics/lib/metrics-client";


export { PageSkeleton as loading };

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = PRODUCTS.find((p) => p.slug === slug);

  // Track product view on mount
  useEffect(() => {
    if (product) {
      initMetrics({
        projectId: "greenmarket",
        endpoint: "/api/metrics",
        debug: process.env.NODE_ENV === "development",
      });
      trackEvent("product_viewed", {
        productId: product.id,
        name: product.name,
        category: product.category,
        price: String(product.price),
      });
    }
  }, [product]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) {
    return (
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <p className="text-xl font-bold mb-2">Товар не найден</p>
          <a href="/catalog" className="text-green-light hover:underline">← Вернуться в каталог</a>
        </div>
      </div>
    );
  }

  return <ProductContent product={product} />;
}

function ProductContent({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  // Track add to cart
  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    trackEvent("product_added_to_cart", {
      productId: product.id,
      name: product.name,
      price: String(product.price),
      qty: String(qty),
    });
  };

  const relatedProducts = PRODUCTS
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const productReviews = REVIEWS.filter((r) => r.productId === product.id);
  const images = [product.image, ...(product.images?.slice(1) || [])];

  const ecoRatings: Record<string, { label: string; color: string }> = {
    "B+": { label: "B+", color: "text-yellow-400" },
    A: { label: "A", color: "text-green-400" },
    "A+": { label: "A+", color: "text-green-light" },
  };
  const ecoLabel = ecoRatings[product.ecoRating] || ecoRatings["B+"];

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/30 mb-8" aria-label="Навигация">
          <a href="/home" className="hover:text-white/60 transition-colors">Главная</a>
          <span>/</span>
          <a href="/catalog" className="hover:text-white/60 transition-colors">Каталог</a>
          <span>/</span>
          <span className="text-white/60">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Gallery */}
          <div>
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="aspect-square rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.03] mb-4"
            >
              <Image src={images[selectedImage]} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </motion.div>
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-green" : "border-transparent"
                  }`}
                  aria-label={`Изображение ${i + 1}`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            {product.badge && (
              <span className="inline-block px-3 py-1 rounded-md bg-green text-white text-xs font-bold mb-3">{product.badge}</span>
            )}
            {product.organic && (
              <span className="inline-block px-3 py-1 rounded-md bg-green/10 text-green-light text-xs border border-green/20 ml-2">ECO</span>
            )}
            <h1 className="text-3xl font-bold mt-3 mb-2" style={{ fontFamily: 'Georgia, serif' }}>{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={product.rating} />
              <span className="text-sm text-white/40">{product.rating}</span>
              <span className="text-sm text-white/20">({product.reviews} отзывов)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-green-light">{product.price} ₽</span>
              {product.oldPrice && (
                <>
                  <span className="text-lg text-white/20 line-through">{product.oldPrice} ₽</span>
                  <span className="text-sm text-green-light">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Eco rating */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03] mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/40">Эко-рейтинг:</span>
                <span className={`text-lg font-bold ${ecoLabel.color}`}>{ecoLabel.label}</span>
                <span className="text-xs text-white/20 ml-auto">{product.weight}</span>
              </div>
            </div>

            <p className="text-sm text-white/50 leading-relaxed mb-6">{product.description}</p>
            {product.ingredients && (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03] mb-6">
                <h4 className="text-sm font-semibold mb-2">Состав</h4>
                <p className="text-xs text-white/40">{product.ingredients}</p>
              </div>
            )}

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center rounded-lg border border-white/[0.03] overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-white/[0.03] transition-colors" aria-label="Уменьшить количество">
                  <Minus size={16} className="text-white/40" />
                </button>
                <span className="w-12 text-center font-medium">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-white/[0.03] transition-colors" aria-label="Увеличить количество">
                  <Plus size={16} className="text-white/40" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-xl bg-green text-white font-medium hover:bg-green/80 transition-colors active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50"
                aria-label={`Добавить ${product.name} в корзину`}
              >
                В корзину
              </button>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`p-3 rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50 ${
                  wishlisted ? "border-red-500/30 bg-red-500/10" : "border-white/[0.03] hover:bg-white/[0.03]"
                }`}
                aria-label={wishlisted ? "Убрать из избранного" : "Добавить в избранное"}
              >
                <Heart size={20} className={wishlisted ? "fill-red-500 text-red-500" : "text-white/40"} />
              </button>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              {[
                { icon: "🚚", text: "Бесплатная доставка от 2000 ₽" },
                { icon: "✅", text: "Гарантия свежести 24 часа" },
                { icon: "🔄", text: "Возврат в течение 7 дней" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2 text-sm text-white/40">
                  <span>{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Georgia, serif' }}>Отзывы покупателей</h2>
          {productReviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {productReviews.map((r) => (
                <ReviewItem key={r.id} review={r} />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-white/[0.02] border border-white/[0.03] text-center">
              <p className="text-white/40 text-sm">Отзывов пока нет. Будьте первым!</p>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Georgia, serif' }}>Похожие товары</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={addToCart}
                  onView={(slug) => { window.location.href = `/product/${slug}`; }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
