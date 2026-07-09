"use client";

import { blogPosts } from "@/data/medical";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/ui/PageTransition";
import { BlogList } from "@/components/blog/BlogList";

export default function BlogPage() {
  return (
    <main>
      <Header />
      <PageTransition>
        <BlogList posts={blogPosts} />
      </PageTransition>
      <Footer />
    </main>
  );
}
