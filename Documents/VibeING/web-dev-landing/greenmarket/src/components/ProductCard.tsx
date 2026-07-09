import type { Product } from "@/lib/types";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onView: (slug: string) => void;
  delay?: number;
  onToggleWishlist?: (p: Product) => void;
  isWishlisted?: boolean;
}

export default function ProductCard({ product, onAddToCart, onView, delay = 0, onToggleWishlist, isWishlisted }: ProductCardProps) {
  return (
    <motion.div
      className="group relative rounded-2xl bg-[#1A241A]/50 border border-white/[0.03] overflow-hidden hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300 hover:-translate-y-1"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Badges */}
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 px-2 py-1 rounded-md bg-green text-white text-[10px] font-bold">
          {product.badge}
        </span>
      )}
      {product.organic && (
        <span className="absolute top-3 right-3 z-10 px-2 py-1 rounded-md bg-green/10 text-green-light text-[10px] border border-green/20">
          ECO
        </span>
      )}
      {isWishlisted && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(product); }}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/50 text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          aria-label={`Убрать ${product.name} из избранного`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
        </button>
      )}
      {!isWishlisted && onToggleWishlist && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/50 text-white/40 hover:text-white/80 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50"
          aria-label={`Добавить ${product.name} в избранное`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
        </button>
      )}

      {/* Image */}
      <div className="aspect-square overflow-hidden cursor-pointer" onClick={() => onView(product.slug)} role="link" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onView(product.slug); } }}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <h3
          className="text-sm font-medium truncate cursor-pointer hover:text-green-light transition-colors"
          onClick={() => onView(product.slug)}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onView(product.slug); } }}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <StarRating rating={product.rating} size={11} />
          <span className="text-xs text-white/30 ml-0.5">{product.rating}</span>
          <span className="text-xs text-white/20">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-bold text-green-light">{product.price} ₽</span>
          {product.oldPrice && (
            <span className="text-xs text-white/20 line-through">{product.oldPrice} ₽</span>
          )}
        </div>
        <button
          onClick={() => onAddToCart(product)}
          className="mt-2 w-full py-2 rounded-lg bg-green/20 text-green-light text-xs font-medium hover:bg-green/30 transition-colors flex items-center justify-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50"
          aria-label={`Добавить ${product.name} в корзину`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          В корзину
        </button>
      </div>
    </motion.div>
  );
}

export function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <span className="inline-flex items-center" aria-label={`Рейтинг: ${rating} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={i < full ? "fill-green-light text-green-light" : "fill-transparent text-white/20"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}
