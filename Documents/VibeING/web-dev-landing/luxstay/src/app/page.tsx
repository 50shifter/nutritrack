"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BookingWidget from "@/components/BookingWidget";
import HotelsSection from "@/components/HotelsSection";
import StatsSection from "@/components/StatsSection";
import ExperiencesSection from "@/components/ExperiencesSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { initMetrics, trackEvent } from "@shared-metrics/lib/metrics-client";

export default function Home() {
  // Track pageview and hotel browsing on mount
  useEffect(() => {
    initMetrics({
      projectId: "luxstay",
      endpoint: "/api/metrics",
      debug: process.env.NODE_ENV === "development",
    });
    trackEvent("pageview", { page: "/" });
    trackEvent("hotel_viewed", { source: "homepage" });
  }, []);

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
