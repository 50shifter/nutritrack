"use client";

import { AppProvider } from "@/lib/context";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { useApp } from "@/lib/context";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <LayoutShell>{children}</LayoutShell>
    </AppProvider>
  );
}

function LayoutShell({ children }: { children: React.ReactNode }) {
  const { currentPage, setCurrentPage, mobileOpen, setMobileOpen } = useApp();

  return (
    <>
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="md:ml-64 flex-1">
        <MobileHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="pt-16 md:pt-8 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </>
  );
}
