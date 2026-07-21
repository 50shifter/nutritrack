"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initMetrics, trackEvent } from "@shared-metrics/lib/metrics-client";

// Shared layout wrapper for FoodHub with automatic metrics
export function MetadataLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    initMetrics({
      projectId: "foodhub",
      endpoint: "/api/metrics",
      debug: process.env.NODE_ENV === "development",
    });
  }, []);

  useEffect(() => {
    trackEvent("pageview", { page: pathname });
  }, [pathname]);

  return <>{children}</>;
}