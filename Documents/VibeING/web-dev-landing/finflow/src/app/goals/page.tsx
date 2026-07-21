"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, Trash2, AlertCircle, X, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  color: string;
}

/* ─── Goal Card ─── */
function GoalCard({ goal, onUpdate, onDelete }: { goal: Goal; onUpdate: (g: Goal) => void; onDelete: (id: number) => void }) {
  const [editMode, setEditMode] = useState(false);
  const [editAmount, setEditAmount] = useState("");
  const pct = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
  const color = pct > 90 ? "bg-green-500" : pct > 60 ? "bg-blue-500" : pct > 30 ? "bg-yellow-500" : "bg-red-500";

  const handleAddFunds = async () => {
    const amt = Number(editAmount);
    if (!amt || amt <= 0) return;
    const updated = { ...goal, current_amount: Math.min(goal.current_amount + amt, goal.target_amount) };
    await onUpdate(updated);
    setEditAmount("");
    setEditMode(false);
  };

  return (
    <div className="glass rounded-2xl p-5 border border-white/[0.04] group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${goal.color}15` }}>
            <div className="w-4 h-4 rounded-full" style={{ background: goal.color }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{goal.name}</h3>
            <p className="text-[11px] text-white/25">{goal.deadline ? new Date(goal.deadline).toLocaleDateString("ru-RU") : "Без срока"}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setEditMode(true)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/20 hover:text-white/50 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(goal.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-white/40">{goal.current_amount.toLocaleString("ru-RU")} ₽</span>
          <span className="text-white/25">{goal.target_amount.toLocaleString("ru-RU")} ₽</span>
        </div>
        <div className="h-2.5 rounded-full bg-white/[0.05] overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px] text-white/20">{pct.toFixed(1)}%</span>
        {!editMode ? (
          <button onClick={() => setEditMode(true)} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
            + Пополнить
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="number" placeholder="Сумма" value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddFunds()}
              className="w-20 px-2 py-1 rounded-lg bg-white/5 border border-white/[0.06] text-xs text-white placeholder-white/20 focus:outline-none focus:border-purple-500/30"
              autoFocus
            />
            <button onClick={handleAddFunds} className="text-xs text-green-400 hover:text-green-300 transition-colors">OK</button>
            <button onClick={() => setEditMode(false)} className="text-xs text-white/30 hover:text-white/50 transition-colors">✕</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", target: "", deadline: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Fetch goals from API
  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/goals?userId=1');
      const result = await response.json();
      if (Array.isArray(result)) {
        const formatted = result.map((g: any) => ({
          id: g.id,
          name: g.name,
          target_amount: Number(g.target_amount),
          current_amount: Number(g.current_amount || 0),
          deadline: g.deadline,
          color: g.color || "#888888",
        }));
        setGoals(formatted);
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Handle add goal via API
  const handleAddGoal = async () => {
    if (!newGoal.name.trim() || !newGoal.target || !newGoal.deadline) return;
    const colors = ["#34d399", "#60a5fa", "#a78bfa", "#fbbf24", "#f472b6", "#38bdf8", "#fb923c"];
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          name: newGoal.name.trim(),
          targetAmount: Number(newGoal.target),
          deadline: newGoal.deadline,
        }),
      });
      const result = await response.json();
      if (result.id) {
        setNewGoal({ name: "", target: "", deadline: "" });
        setShowAdd(false);
        await fetchGoals();
      }
    } catch (error) {
      console.error('Failed to add goal:', error);
    }
  };

  // Handle update goal via API
  const updateGoal = async (updated: Goal): Promise<void> => {
    try {
      await fetch(`/api/goals?id=${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updated.name,
          targetAmount: updated.target_amount,
          currentAmount: updated.current_amount,
          deadline: updated.deadline,
        }),
      });
      await fetchGoals();
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  };

  // Handle delete goal via API
  const deleteGoal = async () => {
    if (!deleteConfirm) return;
    try {
      await fetch(`/api/goals?id=${deleteConfirm}`, { method: 'DELETE' });
      setDeleteConfirm(null);
      await fetchGoals();
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-white/40">Загрузка целей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Финансовые цели</h2>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-medium text-white hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20">
          <Plus className="w-4 h-4" /> Новая цель
        </button>
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setShowAdd(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="relative glass-strong rounded-2xl p-6 w-full max-w-md border border-white/[0.06]">
                <button onClick={() => setShowAdd(false)} className="absolute top-4 right-4 text-white/20 hover:text-white/50 transition-colors">
                  <X className="w-4 h-4" />
                </button>
                <h3 className="text-lg font-semibold mb-5">Новая цель</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block">Название</label>
                    <input
                      type="text" placeholder="Например: Отпуск в Bali"
                      value={newGoal.name}
                      onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm placeholder-white/20 text-white focus:outline-none focus:border-purple-500/30 transition-all"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block">Целевая сумма (₽)</label>
                    <input
                      type="number" placeholder="150000"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm placeholder-white/20 text-white focus:outline-none focus:border-purple-500/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block">Срок</label>
                    <input
                      type="date" value={newGoal.deadline}
                      onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white focus:outline-none focus:border-purple-500/30 transition-all"
                    />
                  </div>
                </div>
                <button onClick={handleAddGoal} className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20">
                  Создать
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Goals */}
      {goals.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-white/20" />
          </div>
          <p className="text-sm text-white/30 mb-2">У вас пока нет финансовых целей</p>
          <p className="text-xs text-white/20">Создайте первую цель для начала накоплений</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((g) => (
            <GoalCard key={g.id} goal={g} onUpdate={updateGoal} onDelete={(id) => setDeleteConfirm(id)} />
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm !== null && (
          <>
            <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="relative glass-strong rounded-2xl p-6 w-full max-w-sm border border-white/[0.06]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center"><AlertCircle className="w-5 h-5 text-red-400" /></div>
                  <h3 className="text-base font-semibold">Удалить цель?</h3>
                </div>
                <p className="text-sm text-white/40 mb-6">{goals.find((g) => g.id === deleteConfirm)?.name} — прогресс будет потерян.</p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-xl text-sm text-white/40 hover:text-white/60 hover:bg-white/5 transition-colors">Отмена</button>
                  <button onClick={deleteGoal} className="px-4 py-2 rounded-xl text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">Удалить</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}