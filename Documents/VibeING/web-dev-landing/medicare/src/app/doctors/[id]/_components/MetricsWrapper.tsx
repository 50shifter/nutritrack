"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { initMetrics, trackEvent } from "@shared-metrics/lib/metrics-client";

// Wrapper for booking action page
export default function MediCareBookingMetrics({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    initMetrics({
      projectId: "medicare",
      endpoint: "/api/metrics",
      debug: process.env.NODE_ENV === "development",
    });
  }, []);

  return <>{children}</>;
}