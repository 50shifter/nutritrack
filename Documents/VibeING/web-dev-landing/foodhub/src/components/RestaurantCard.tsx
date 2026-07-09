"use client";

import Link from "next/link";
import { Star, Truck } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
  className?: string;
  mobile?: boolean;
  delay?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function RestaurantCard({
  id, name, cuisine, rating, deliveryTime, image, className, mobile, delay = 0,
}: Props) {
  return (
    <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay }}>
      <Link
        href={`/restaurant/${id}`}
        className={`food-card overflow-hidden group ${className || ""}`}
        aria-label={`${name} — ${cuisine}, рейтинг ${rating}`}
      >
        <div className={`${mobile ? "h-28" : "h-32 md:h-36"} overflow-hidden`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className={`${mobile ? "p-3" : "p-4 md:p-4"}`}>
          <h3 className={`${mobile ? "font-bold text-sm" : "font-bold"}`}>{name}</h3>
          {cuisine && <p className={`${mobile ? "text-xs" : "text-xs"} text-white/40 mt-0.5`}>{cuisine}</p>}
          <div className={`${mobile ? "flex items-center gap-2 mt-1 text-[10px]" : "flex items-center gap-3 mt-2 text-xs"} text-white/40`}>
            <span className="flex items-center gap-0.5">
              <Star size={mobile ? 10 : 12} className="fill-yellow-500 text-yellow-500" />
              {rating}
            </span>
            {mobile ? <span>•</span> : <span className="hidden md:inline">•</span>}
            <span className="flex items-center gap-0.5">
              <Truck size={mobile ? 10 : 12} />
              {deliveryTime} мин
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
