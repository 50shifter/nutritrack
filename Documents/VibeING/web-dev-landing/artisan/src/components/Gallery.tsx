"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { photos } from "@/data/photos";
import { X, Eye } from "lucide-react";
import Image from "next/image";
import Skeleton from "@/components/Skeleton";

export default function Gallery() {
  const [lightbox, setLightbox] = useState<typeof photos[0] | null>(null);
  const [filter, setFilter] = useState("Все");
  const [loading, setLoading] = useState(false);
  const categories = ["Все", "Портреты", "Природа", "Свадьбы", "Street"];

  const filtered = filter === "Все" ? photos : photos.filter((p) => p.category === filter);

  const handleFilter = (cat: string) => {
    setLoading(true);
    setFilter(cat);
    setTimeout(() => setLoading(false), 300);
  };

  // Keyboard navigation for lightbox
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && lightbox) {
      setLightbox(null);
    }
  };

  return (
    <section id="portfolio" className="py-20 px-6" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-gold-light text-xs tracking-widest uppercase">Портфолио</span>
          <h2 className="font-serif text-4xl font-bold mt-2">Работы</h2>
        </motion.div>

        {/* Filter buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase transition-all ${
                filter === cat
                  ? "bg-gold text-dark-900 font-medium"
                  : "bg-white/[0.03] text-white/40 hover:text-gold-light hover:bg-white/[0.05] border border-white/[0.03]"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Masonry grid */}
        {loading ? (
          <div className="masonry">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="masonry">
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="masonry-item"
                >
                  <div className="photo-card" onClick={() => setLightbox(p)} role="button" tabIndex={0} aria-label={`Открыть: ${p.title}`}>
                    <div className="relative overflow-hidden rounded-xl">
                      <Image
                        src={p.src}
                        alt={p.title}
                        width={600}
                        height={parseInt(p.height)}
                        className="w-full object-cover transition-transform duration-500 photo-card-hover"
                        loading="lazy"
                      />
                      <div className="photo-card-overlay">
                        <div>
                          <h3 className="font-serif text-white">{p.title}</h3>
                          <p className="text-gold-light text-sm">{p.category}</p>
                        </div>
                      </div>
                      <div className="photo-card-icon">
                        <Eye size={20} className="text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div className="text-center py-12 text-white/30 text-sm">Нет работ в этой категории</div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal
            aria-label={lightbox.title}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 p-2 text-white/60 hover:text-white transition-colors z-[101]"
              aria-label="Закрыть"
            >
              <X size={28} />
            </button>
            <div className="max-w-[90vw] max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
              <Image
                src={lightbox.src.replace("w=600", "w=1400")}
                alt={lightbox.title}
                width={1400}
                height={parseInt(lightbox.height) * (1400 / parseInt(lightbox.width))}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white font-serif text-lg">{lightbox.title}</h3>
                <p className="text-gold-light text-sm">{lightbox.category}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
