"use client";

import { usePathname } from "next/navigation";
import DashboardShell from "./DashboardShell";
import { useMetrics } from "@/lib/metrics/hooks";

const PUBLIC_PATHS = ["/"];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  // Track pageviews for all routes
  useMetrics();

  if (isPublic) {
    return children;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
