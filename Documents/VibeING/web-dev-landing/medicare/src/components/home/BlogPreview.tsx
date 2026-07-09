"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { BlogPost } from "@/data/medical";

interface BlogPreviewProps {
  posts: BlogPost[];
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#F1F5F9]/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="font-bold text-2xl sm:text-3xl text-[#1E293B]">Свежие статьи</h2>
          </div>
          <Link href="/blog" className="text-[#0891B2] text-sm font-medium flex items-center gap-1 hover:underline hidden sm:flex">
            Все статьи <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {posts.slice(0, 3).map((p, i) => (
            <BlogCard key={p.id} post={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post: p, index }: { post: BlogPost; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden"
    >
      <div className="overflow-hidden">
        <img src={p.image} alt={p.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-4 sm:p-5">
        <span className="text-[10px] text-[#0891B2] font-medium uppercase tracking-wider">{p.category}</span>
        <h3 className="font-bold text-dark mt-2 group-hover:text-[#0891B2] transition-colors leading-snug">{p.title}</h3>
        <p className="text-sm text-[#475569]/50 mt-2 line-clamp-2 leading-relaxed">{p.excerpt}</p>
        <div className="flex items-center gap-3 mt-3 text-xs text-[#475569]/40">
          <span>{p.date}</span>
          <span>•</span>
          <span>{p.readTime}</span>
        </div>
      </div>
    </motion.div>
  );
}
