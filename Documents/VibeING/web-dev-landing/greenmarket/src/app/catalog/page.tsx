"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Filter, Heart, ChevronLeft, ShoppingBag, Check, Tag, Leaf } from "lucide-react";
import { PRODUCTS, CATEGORIES, REVIEWS } from "@/lib/mock-data";
import { useCart, useWishlist } from "@/lib/context";
import ProductCard from "@/components/ProductCard";
import { StarRating } from "@/components/ProductCard";
import { CardSkeleton as Skeleton } from "@/components/Skeleton";
import { PageSkeleton } from "@/components/Skeleton";
import type { Product } from "@/lib/types";


export { PageSkeleton as loading };

type SortField = "default" | "price-asc" | "price-desc" | "rating" | "newest" | "name-asc" | "name-desc";
type CategoryFilter = "Все" | string;

export default function CatalogPage() {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlisted } = useWishlist();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("Все");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(3000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortField>("default");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const perPage = 12;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    let result = [...PRODUCTS];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
      );
    }
    if (category !== "Все") {
      result = result.filter((p) => p.category === category);
    }
    result = result.filter((p) => p.price >= priceMin && p.price <= priceMax);
    result = result.filter((p) => p.rating >= minRating);
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "name-asc": result.sort((a, b) => a.name.localeCompare(b.name, "ru")); break;
      case "name-desc": result.sort((a, b) => b.name.localeCompare(a.name, "ru")); break;
      case "newest": result.sort((a, b) => b.id - a.id); break;
    }

    return result;
  }, [search, category, priceMin, priceMax, minRating, sort, inStockOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const activeFiltersCount = [
    category !== "Все",
    inStockOnly,
    minRating > 0,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearch("");
    setCategory("Все");
    setPriceMin(0);
    setPriceMax(3000);
    setMinRating(0);
    setSort("default");
    setInStockOnly(false);
    setPage(1);
  };

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
            Каталог
            <span className="text-xs font-normal text-white/30 ml-3">{filtered.length} товаров</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`sm:hidden flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                showFilters || activeFiltersCount > 0
                  ? "bg-green/10 border-green/30 text-green-light"
                  : "bg-white/[0.03] border-white/[0.03] text-white/50"
              }`}
            >
              <Filter size={16} />
              Фильтры
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-green text-[9px] text-white flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="search"
              placeholder="Поиск по названию или описанию..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.03] text-sm placeholder:text-white/20 focus:outline-none focus:border-green/30 transition-colors"
              aria-label="Поиск продуктов"
            />
          </div>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortField)}
              className="appearance-none px-4 py-2.5 pr-10 rounded-xl bg-white/[0.03] border border-white/[0.03] text-sm text-white/50 focus:outline-none focus:border-green/30 transition-colors cursor-pointer"
              aria-label="Сортировка"
            >
              <option value="default">По умолчанию</option>
              <option value="price-asc">Цена ↑</option>
              <option value="price-desc">Цена ↓</option>
              <option value="rating">По рейтингу</option>
              <option value="newest">Новинки</option>
              <option value="name-asc">Название А-Я</option>
              <option value="name-desc">Я-А</option>
            </select>
            <ChevronLeft size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none rotate-180" />
          </div>
        </div>

        {/* Active filters */}
        <AnimatePresence>
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 mb-4 flex-wrap"
            >
              {category !== "Все" && (
                <button onClick={() => setCategory("Все")} className="flex items-center gap-1 px-2 py-1 rounded-md bg-green/10 text-green-light text-xs">
                  {category} <span className="ml-0.5">×</span>
                </button>
              )}
              {inStockOnly && (
                <button onClick={() => setInStockOnly(false)} className="flex items-center gap-1 px-2 py-1 rounded-md bg-green/10 text-green-light text-xs">
                  В наличии <span className="ml-0.5">×</span>
                </button>
              )}
              {minRating > 0 && (
                <button onClick={() => setMinRating(0)} className="flex items-center gap-1 px-2 py-1 rounded-md bg-green/10 text-green-light text-xs">
                  {minRating}+ ★ <span className="ml-0.5">×</span>
                </button>
              )}
              <button onClick={resetFilters} className="text-xs text-white/30 hover:text-white/60 ml-auto">
                Сбросить всё
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "fixed inset-0 z-50 bg-[#0F1410] p-6 overflow-y-auto" : "hidden sm:block"} w-full sm:w-64 flex-shrink-0`}>
            {showFilters && (
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Фильтры</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 rounded-lg hover:bg-white/5" aria-label="Закрыть фильтры">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
            )}
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Категория</h4>
                <div className="space-y-1">
                  {["Все", ...CATEGORIES].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setCategory(cat); setPage(1); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        category === cat ? "bg-green/20 text-green-light" : "text-white/40 hover:bg-white/[0.03] hover:text-white/60"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Цена, ₽</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => { setPriceMin(Number(e.target.value)); setPage(1); }}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.03] text-sm placeholder:text-white/20 focus:outline-none focus:border-green/30"
                    placeholder="От"
                    aria-label="Минимальная цена"
                  />
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => { setPriceMax(Number(e.target.value)); setPage(1); }}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.03] text-sm placeholder:text-white/20 focus:outline-none focus:border-green/30"
                    placeholder="До"
                    aria-label="Максимальная цена"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Мин. рейтинг</h4>
                <div className="flex gap-1 flex-wrap">
                  {[0, 3, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => { setMinRating(r); setPage(1); }}
                      className={`px-2 py-1.5 rounded-lg text-xs transition-colors ${
                        minRating === r ? "bg-green/20 text-green-light" : "bg-white/[0.03] text-white/40 hover:text-white/60"
                      }`}
                    >
                      {r === 0 ? "Все" : (
                        <span className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarRating key={i} rating={i < r ? 5 : 0} size={10} />
                          ))}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* In stock */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Наличие</h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => { setInStockOnly(e.target.checked); setPage(1); }}
                    className="accent-green"
                  />
                  <span className="text-sm text-white/60">Только в наличии</span>
                </label>
              </div>

              {/* Reset */}
              <button
                onClick={resetFilters}
                className="w-full py-2 rounded-lg border border-white/[0.05] text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {paged.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onView={(slug) => { window.location.href = `/product/${slug}`; }}
                      onToggleWishlist={() => {
                        if (wishlisted.has(product.id)) {
                          removeFromWishlist(product.id);
                        } else {
                          addToWishlist(product.id);
                        }
                      }}
                      isWishlisted={wishlisted.has(product.id)}
                      delay={i * 0.03}
                    />
                  ))}
                </div>
                {paged.length === 0 && (
                  <div className="py-20 text-center text-white/30">
                    <Filter size={32} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg mb-2">Товары не найдены</p>
                    <p className="text-sm">Попробуйте изменить параметры поиска</p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-8 h-8 rounded-lg bg-white/[0.03] text-white/40 hover:bg-white/[0.05] disabled:opacity-30 transition-colors disabled:cursor-not-allowed"
                      aria-label="Предыдущая страница"
                    >
                      ←
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let p;
                      if (totalPages <= 5) p = i + 1;
                      else if (page <= 3) p = i + 1;
                      else if (page >= totalPages - 2) p = totalPages - 4 + i;
                      else p = page - 2 + i;
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                            page === p ? "bg-green text-white" : "bg-white/[0.03] text-white/40 hover:bg-white/[0.05]"
                          }`}
                          aria-label={`Страница ${p}`}
                          aria-current={page === p ? "page" : undefined}
                        >
                          {p}
                        </button>
                      );
                    })}
                    {totalPages > 5 && (
                      <span className="text-xs text-white/30 self-center">...</span>
                    )}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-8 h-8 rounded-lg bg-white/[0.03] text-white/40 hover:bg-white/[0.05] disabled:opacity-30 transition-colors disabled:cursor-not-allowed"
                      aria-label="Следующая страница"
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Import for useEffect

