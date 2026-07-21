"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { restaurants } from "@/data/food";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MenuItemCard } from "@/components/MenuItemCard";
import { PageSkeleton } from "@/components/Skeleton";
import { ArrowLeft, Star, Clock, MapPin, Phone } from "lucide-react";
import { initMetrics, trackEvent } from "@shared-metrics/lib/metrics-client";

interface RestaurantPageProps {
  params: Promise<{ id: string }>;
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params;
  const restaurantId = parseInt(id);
  const restaurant = restaurants.find(r => r.id === restaurantId);

  if (!restaurant) return <div>Ресторан не найден</div>;

  return (
    <main>
      <Header />
      <RestaurantMetricsWrapper restaurant={restaurant}>
        <section className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-orange-400 hover:underline mb-6">
            <ArrowLeft size={16} /> На главную
          </Link>
          {/* Restaurant Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full md:w-64 h-48 rounded-2xl object-cover"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
              <div className="flex items-center gap-4 text-sm text-white/50 mb-4">
                <span className="flex items-center gap-1"><Star size={14} className="fill-yellow-400 text-yellow-400" />{restaurant.rating}</span>
                <span className="flex items-center gap-1"><Clock size={14} />{restaurant.deliveryTime}</span>
                <span className="flex items-center gap-1"><MapPin size={14} />{restaurant.distance}</span>
              </div>
              <p className="text-white/40 text-sm">{restaurant.description}</p>
            </div>
          </div>
          {/* Menu */}
          <h2 className="text-xl font-bold mb-4">Меню</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurant.menu.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </RestaurantMetricsWrapper>
      <Footer />
    </main>
  );
}

function RestaurantMetricsWrapper({ children, restaurant }: { children: React.ReactNode; restaurant: typeof restaurants[0] }) {
  useEffect(() => {
    initMetrics({
      projectId: "foodhub",
      endpoint: "/api/metrics",
      debug: process.env.NODE_ENV === "development",
    });
    trackEvent("restaurant_viewed", {
      restaurantId: String(restaurant.id),
      name: restaurant.name,
      cuisine: restaurant.cuisine,
    });
  }, [restaurant.id, restaurant.name, restaurant.cuisine]); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}