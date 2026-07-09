import { motion } from "framer-motion";
import { calculatePercentage } from "@/lib/utils";
import { Target, CheckCircle2, Clock } from "lucide-react";

interface GoalCardProps {
  goal: {
    id: string;
    name: string;
    target: number;
    current: number;
    deadline: string;
    color: string;
  };
  onUpdate?: (id: string, amount: number) => void;
  onDelete?: (id: string) => void;
  delay?: number;
}

export default function GoalCard({ goal, onUpdate, onDelete, delay = 0 }: GoalCardProps) {
  const progress = calculatePercentage(goal.current, goal.target);
  const remaining = goal.target - goal.current;
  const isComplete = progress >= 100;
  const daysLeft = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-2xl p-5 card-hover"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/5">
            {isComplete ? (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            ) : (
              <Target className="w-4 h-4" style={{ color: goal.color }} />
            )}
          </div>
          <h3 className="text-sm font-semibold">{goal.name}</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/30">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {daysLeft}д
          </span>
          {onDelete && (
            <button onClick={() => onDelete(goal.id)} className="p-1 hover:text-red-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/40">
          {goal.current.toLocaleString("ru-RU")} / {goal.target.toLocaleString("ru-RU")} ₽
        </span>
        <span className="text-sm font-bold" style={{ color: goal.color }}>
          {isComplete ? "100%" : `${Math.round(progress)}%`}
        </span>
      </div>

      <div className="h-2.5 bg-white/5 rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full rounded-full"
          style={{ background: goal.color }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 + delay }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-white/25">
          {isComplete ? "🎉 Цель достигнута!" : `Осталось: ${remaining.toLocaleString("ru-RU")} ₽`}
        </span>
        <span className="text-white/25">{goal.deadline}</span>
      </div>
    </motion.div>
  );
}
