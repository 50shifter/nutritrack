"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, AlertCircle, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryCard from "@/components/CategoryCard";
import { MOCK_CATEGORIES } from "@/lib/mock-data";
import type { Category } from "@/lib/types";

interface DbCategory {
  id: number;
  name: string;
  type: "income" | "expense";
  color: string;
  icon?: string;
  limit_amount?: number | null;
}

/* ─── Add Category Modal ─── */
function AddCategoryModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: DbCategory) => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [limit, setLimit] = useState("");
  const [tempIcon, setTempIcon] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Введите название"); return; }

    const icons: Record<string, string> = {
      "Еда": "🍽️", "Жилье": "🏠", "Транспорт": "🚗", "Развлечения": "🎮",
      "Здоровье": "💊", "Путешествия": "✈️", "Покупки": "🛍️", "Подарки": "🎁",
      "Образование": "📚", "Зарплата": "💰", "Фриланс": "💻", "Инвестиции": "📈",
      "Кэшбэк": "🎁", "Бонус": "🏆", "Прочее": "📌",
    };

    const colors = {
      expense: ["#f87171", "#fb923c", "#60a5fa", "#a78bfa", "#34d399", "#38bdf8", "#f472b6", "#fb923c"],
      income: ["#34d399", "#60a5fa", "#a78bfa", "#fbbf24", "#f472b6"],
    };

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          type,
          color: colors[type][Math.floor(Math.random() * colors[type].length)],
          limitAmount: type === "expense" && limit ? Number(limit) : null,
        }),
      });
      const result = await response.json();
      if (result.id) {
        onAdd(result);
        onClose();
      }
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const availableIcons = ["📌", "💰", "💻", "📈", "🎁", "🏆", "🍽️", "🏠", "🚗", "🎮", "💊", "✈️", "🛍️", "📚", "🏥", "📦"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-6 w-full max-w-md border border-white/[0.06]">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/20 hover:text-white/50 transition-colors">
          <X className="w-4 h-4" />
        </button>
        <h3 className="text-lg font-semibold mb-5">Новая категория</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div className="flex gap-2">
            {(["expense", "income"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setType(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  type === t
                    ? t === "income" ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-red-500/15 text-red-400 border border-red-500/20"
                    : "bg-white/[0.03] text-white/30 border border-white/[0.04]"
                }`}>
                {t === "income" ? "↑ Доход" : "↓ Расход"}
              </button>
            ))}
          </div>

          {/* Name */}
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Название</label>
            <input
              type="text" placeholder="Например: Хобби"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/30 transition-all"
              autoFocus
            />
          </div>

          {/* Icon picker */}
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Иконка</label>
            <div className="flex gap-2 flex-wrap">
              {availableIcons.map((ic) => (
                <button key={ic} type="button" onClick={() => setTempIcon(ic)}
                  className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] text-lg flex items-center justify-center hover:bg-white/[0.08] hover:border-white/[0.12] transition-colors">
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Limit */}
          {type === "expense" && (
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Лимит бюджета (₽, опционально)</label>
              <input
                type="number" placeholder="50000"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/30 transition-all"
              />
            </div>
          )}

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20">
            Создать категорию
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Delete Confirm ─── */
function DeleteConfirmModal({ name, onClose, onConfirm }: { name: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-6 w-full max-w-sm border border-white/[0.06]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center"><AlertCircle className="w-5 h-5 text-red-400" /></div>
          <h3 className="text-base font-semibold">Удалить категорию?</h3>
        </div>
        <p className="text-sm text-white/40 mb-6">"{name}" — все привязанные транзакции останутся.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-white/40 hover:text-white/60 hover:bg-white/5 transition-colors">Отмена</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">Удалить</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function CategoriesPage() {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIncome, setShowIncome] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories');
      const result = await response.json();
      if (Array.isArray(result)) {
        setCategories(result);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = async (c: DbCategory) => {
    await fetchCategories();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/categories?id=${deleteId}`, { method: 'DELETE' });
      setDeleteId(null);
      await fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-white/40">Загрузка категорий...</p>
        </div>
      </div>
    );
  }

  // Combine mock (default) categories with user-created ones
  const allCategories = useMemo(() => {
    const userCategories = categories.filter((c) => !MOCK_CATEGORIES.find((m) => m.name === c.name));
    return [...MOCK_CATEGORIES, ...userCategories];
  }, [categories]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Категории</h2>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-medium text-white hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setShowIncome(true)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${showIncome ? "bg-green-500/10 text-green-400 border border-green-500/20" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}>
          Доходы
        </button>
        <button onClick={() => setShowIncome(false)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${!showIncome ? "bg-red-500/10 text-red-400 border border-red-500/20" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}>
          Расходы
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allCategories
          .filter((c) => (showIncome ? c.type === "income" : c.type === "expense"))
          .map((c, i) => (
            <div key={c.id || c.name} className="relative group">
              <CategoryCard category={c as Category} delay={i * 0.05} spending={undefined} />
              {/* Delete button - only for user-added */}
              {!MOCK_CATEGORIES.find((m) => m.name === c.name) && (
                <button
                  onClick={() => setDeleteId(c.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
      </div>

      {/* Modals */}
      {showAdd && <AddCategoryModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
      {deleteId !== null && (
        <DeleteConfirmModal
          name={categories.find((c) => c.id === deleteId)?.name ?? ""}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}