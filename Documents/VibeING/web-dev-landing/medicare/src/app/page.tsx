"use client";

import { doctors, blogPosts } from "@/data/medical";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/ui/PageTransition";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { DoctorsPreview } from "@/components/home/DoctorsPreview";
import { WhyUsSection } from "@/components/home/WhyUsSection";
import { BlogPreview } from "@/components/home/BlogPreview";

export default function HomePage() {
  return (
    <main>
      <Header />
      <PageTransition>
        <HeroSection />
        <ServicesSection />
        <DoctorsPreview doctors={doctors} />
        <WhyUsSection />
        <BlogPreview posts={blogPosts} />
      </PageTransition>
      <Footer />
    </main>
  );
}
