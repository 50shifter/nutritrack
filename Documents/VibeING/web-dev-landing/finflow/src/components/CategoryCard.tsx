import { motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import type { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
  onEdit?: (cat: Category) => void;
  onDelete?: (id: string) => void;
  delay?: number;
  spending?: number;
  limit?: number;
}

export default function CategoryCard({ category, onEdit, onDelete, delay = 0, spending = 0 }: CategoryCardProps) {
  const isOverBudget = category.limit ? spending > category.limit : false;
  const budgetPercent = category.limit ? Math.min((spending / category.limit) * 100, 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-2xl p-4 card-hover relative group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{category.icon}</span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button onClick={() => onEdit(category)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <Edit2 className="w-3.5 h-3.5 text-white/40" />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(category.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors">
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
            </button>
          )}
        </div>
      </div>
      <p className="text-sm font-medium mb-1">{category.name}</p>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: category.color }} />
        <span className="text-[11px] text-white/30 capitalize">
          {category.type === "income" ? "Доход" : "Расход"}
        </span>
      </div>
      {/* Budget indicator for expenses */}
      {category.type === "expense" && category.limit && (
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-white/30 mb-1">
            <span>Расходовано</span>
            <span className={isOverBudget ? "text-red-400" : ""}>
              {Math.round(budgetPercent)}%
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isOverBudget ? "bg-red-400" : ""
              }`}
              style={{ width: `${budgetPercent}%`, background: isOverBudget ? undefined : category.color }}
            />
          </div>
          <p className="text-[10px] text-white/20 mt-1">
            {spending.toLocaleString("ru-RU")} / {category.limit.toLocaleString("ru-RU")} ₽
          </p>
        </div>
      )}
    </motion.div>
  );
}
