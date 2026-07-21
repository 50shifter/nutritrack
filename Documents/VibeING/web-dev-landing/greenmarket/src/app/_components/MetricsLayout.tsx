"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { initMetrics, trackEvent } from "@shared-metrics/lib/metrics-client";

// Shared layout wrapper for GreenMarket with automatic metrics
export function MetadataLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    initMetrics({
      projectId: "greenmarket",
      endpoint: "/api/metrics",
      debug: process.env.NODE_ENV === "development",
    });
  }, []);

  useEffect(() => {
    trackEvent("pageview", { page: pathname });
  }, [pathname]);

  return <>{children}</>;
}

// Legacy export
export const GreenMarketMetricsLayout = MetadataLayout;