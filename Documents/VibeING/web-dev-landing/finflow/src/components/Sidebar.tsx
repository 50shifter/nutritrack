import { Home, TrendingUp, PieChart as PieIcon, Target, Settings, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import { Page } from "@/lib/types";
import type { LucideProps } from "lucide-react";

const pageRoutes: Record<Page, string> = {
  dashboard: "/dashboard",
  transactions: "/transactions",
  categories: "/categories",
  goals: "/goals",
  settings: "/settings",
};

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (p: Page) => void;
  mobileOpen: boolean;
  setMobileOpen: (o: boolean) => void;
}

interface NavIconProps extends LucideProps {
  [key: string]: any;
}

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Дашборд", icon: <Home className="w-5 h-5" /> },
  { id: "transactions", label: "Транзакции", icon: <TrendingUp className="w-5 h-5" /> },
  { id: "categories", label: "Категории", icon: <PieIcon className="w-5 h-5" /> },
  { id: "goals", label: "Цели", icon: <Target className="w-5 h-5" /> },
  { id: "settings", label: "Настройки", icon: <Settings className="w-5 h-5" /> },
];

export default function Sidebar({ currentPage, setCurrentPage, mobileOpen, setMobileOpen }: SidebarProps) {
  const { userName } = useApp();
  const router = useRouter();

  const navigate = (page: Page) => {
    setCurrentPage(page);
    setMobileOpen(false);
    router.push(pageRoutes[page]);
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-strong border-r border-white/5 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-gradient">Fin</span>
                <span className="text-white/30">Flow</span>
              </h1>
              <p className="text-[10px] text-white/20 mt-0.5">Dashboard</p>
            </div>
            <button type="button" className="md:hidden text-white/30" onClick={() => setMobileOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentPage === item.id
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/5">
          <button onClick={() => {
            try {
              localStorage.removeItem("finflow_user");
            } catch {}
            router.push("/auth");
          }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all group">
            <LogOut className="w-4 h-4" />
            <span className="flex-1 text-left">Выйти</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
