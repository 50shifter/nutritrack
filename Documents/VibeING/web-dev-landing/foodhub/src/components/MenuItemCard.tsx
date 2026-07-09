"use client";

import Image from "next/image";
import { Star, Flame } from "lucide-react";
import type { MenuItem } from "@/data/food";

interface Props {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAdd }: Props) {
  return (
    <div className="food-card flex gap-4 p-3 md:p-4 group animate-fade-in">
      <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 overflow-hidden rounded-xl">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="96px"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm md:text-base">{item.name}</h3>
            {item.popular && (
              <span className="flex items-center gap-0.5 text-[10px] text-peach">
                <Flame size={12} /> Хит
              </span>
            )}
          </div>
          <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{item.desc}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            {item.popular && (
              <Star size={12} className="fill-yellow-500 text-yellow-500" />
            )}
            <span className="text-sm md:text-base font-bold text-peach-light">{item.price} ₽</span>
          </div>
          <button
            onClick={() => onAdd(item)}
            className="px-4 py-1.5 rounded-xl bg-peach text-white text-sm font-medium hover:bg-peach-light transition-colors active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-light"
            aria-label={`Добавить "${item.name}" в корзину`}
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
}
