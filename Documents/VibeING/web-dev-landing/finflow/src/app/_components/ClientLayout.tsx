"use client";

import { usePathname } from "next/navigation";
import DashboardShell from "./DashboardShell";

const PUBLIC_PATHS = ["/"];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (isPublic) {
    return children;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
