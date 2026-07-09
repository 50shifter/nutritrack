"use client";

import { motion } from "framer-motion";
import type { BlogPost } from "@/data/medical";

interface BlogCardProps { post: BlogPost; index: number }

export function BlogCard({ post: p, index }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden"
    >
      <div className="overflow-hidden">
        <img src={p.image} alt={p.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-5">
        <span className="text-[10px] text-[#0891B2] font-medium uppercase tracking-wider">{p.category}</span>
        <h3 className="font-bold text-dark mt-2 group-hover:text-[#0891B2] transition-colors leading-snug">{p.title}</h3>
        <p className="text-sm text-text/50 mt-2 line-clamp-2 leading-relaxed">{p.excerpt}</p>
        <div className="flex items-center gap-3 mt-3 text-xs text-text/40">
          <span>{p.date}</span>
          <span>•</span>
          <span>{p.readTime}</span>
        </div>
      </div>
    </motion.div>
  );
}

interface BlogListProps { posts: BlogPost[] }

export function BlogList({ posts }: BlogListProps) {
  return (
    <section className="py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-bold text-3xl text-dark mb-8">Медицинский блог</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {posts.map((p, i) => (
            <BlogCard key={p.id} post={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
