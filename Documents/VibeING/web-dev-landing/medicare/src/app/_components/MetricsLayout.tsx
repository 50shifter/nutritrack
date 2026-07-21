"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initMetrics, trackEvent } from "@shared-metrics/lib/metrics-client";

// Shared layout wrapper for MediCare with automatic metrics
export function MediCareMetricsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Initialize metrics once
  useEffect(() => {
    initMetrics({
      projectId: "medicare",
      endpoint: "/api/metrics",
      debug: process.env.NODE_ENV === "development",
    });
  }, []);

  // Track pageviews on route change
  useEffect(() => {
    trackEvent("pageview", { page: pathname });
  }, [pathname]);

  return <>{children}</>;
}

// Aliased export for layout.tsx
export const MetadataLayout = MediCareMetricsLayout;