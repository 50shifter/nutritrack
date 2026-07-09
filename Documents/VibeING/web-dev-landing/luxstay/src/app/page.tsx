"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BookingWidget from "@/components/BookingWidget";
import HotelsSection from "@/components/HotelsSection";
import StatsSection from "@/components/StatsSection";
import ExperiencesSection from "@/components/ExperiencesSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <BookingWidget />
      <HotelsSection />
      <StatsSection />
      <ExperiencesSection />
      <ReviewsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
