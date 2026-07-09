import { formatCurrency } from "@/lib/utils";
import type { Transaction, Category } from "@/lib/types";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface TransactionRowProps {
  transaction: Transaction;
  category?: Category;
  currency?: string;
  onClick?: () => void;
}

export default function TransactionRow({ transaction, category, currency = "RUB", onClick }: TransactionRowProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-base group-hover:bg-white/10 transition-colors">
          {category?.icon || "💰"}
        </div>
        <div>
          <p className="text-sm font-medium">{transaction.description}</p>
          <p className="text-[11px] text-white/30">{category?.name || transaction.category}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${transaction.type === "income" ? "text-green-400" : "text-red-400"}`}>
          {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount, currency)}
        </p>
        <p className="text-[11px] text-white/30">{transaction.date}</p>
      </div>
    </div>
  );
}
