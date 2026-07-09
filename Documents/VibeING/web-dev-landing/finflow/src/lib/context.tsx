"use client";

import { createContext, useContext, useState } from "react";
import { Page } from "@/lib/types";

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  currency: string;
  setCurrency: (c: string) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currency, setCurrency] = useState("RUB");

  // Load user name from localStorage or use default
  const getUserName = () => {
    try { return localStorage.getItem("finflow_user_name") || ""; } catch { return ""; }
  };
  const [userName, setUserName] = useState(getUserName);

  const handleSetUserName = (name: string) => {
    setUserName(name);
    try { localStorage.setItem("finflow_user_name", name); } catch {}
  };

  return (
    <AppContext.Provider value={{ currentPage, setCurrentPage, mobileOpen, setMobileOpen, currency, setCurrency, userName, setUserName: handleSetUserName }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
