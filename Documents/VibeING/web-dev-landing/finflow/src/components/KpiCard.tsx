import { motion } from "framer-motion";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  change?: { value: number; percent: string; direction: "up" | "down" };
  delay?: number;
  className?: string;
}

export default function KpiCard({ title, value, subtitle, icon, iconBg, change, delay = 0, className = "" }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`glass rounded-2xl p-5 card-hover ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${iconBg}`}>
          {icon}
        </div>
        {change && (
          <span className={`text-xs flex items-center gap-0.5 ${change.direction === "up" ? "text-green-400" : "text-red-400"}`}>
            {change.direction === "up" ? "↑" : "↓"} {change.percent}
          </span>
        )}
      </div>
      <p className="text-xs text-white/40 mb-1">{title}</p>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      {subtitle && <p className="text-[11px] text-white/30 mt-1">{subtitle}</p>}
    </motion.div>
  );
}
