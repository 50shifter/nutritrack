"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeToggle";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Gallery from "@/components/Gallery";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import CalculatorSection from "@/components/CalculatorSection";
import ProcessSection from "@/components/ProcessSection";
import FAQSection from "@/components/FAQSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

function HomeContent() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <Navbar activeSection={activeSection} />
      <HeroSection />
      <Gallery />
      <AboutSection />
      <ServicesSection />
      <CalculatorSection />
      <ProcessSection />
      <FAQSection />
      <ReviewsSection />
      <ContactSection />
      <NewsletterSection />
      <Footer />
      <ScrollToTop />
    </main>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}
