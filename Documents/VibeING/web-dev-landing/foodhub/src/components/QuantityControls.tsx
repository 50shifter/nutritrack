"use client";

import { Plus, Minus, Trash2 } from "lucide-react";

interface Props {
  qty: number;
  onUpdate: (delta: number) => void;
  onRemove: () => void;
  price: number;
  showRemove?: boolean;
}

export default function QuantityControls({ qty, onUpdate, onRemove, price, showRemove = true }: Props) {
  return (
    <div className="flex items-center gap-2">
      {qty > 0 ? (
        <>
          <button
            onClick={() => onUpdate(-1)}
            className="w-7 h-7 rounded-full bg-dark-600 flex items-center justify-center hover:bg-dark-700 transition-colors active:scale-90"
            aria-label="Уменьшить количество"
          >
            <Minus size={12} />
          </button>
          <span className="text-sm w-6 text-center font-medium" aria-label={`Количество: ${qty}`}>{qty}</span>
          <button
            onClick={() => onUpdate(1)}
            className="w-7 h-7 rounded-full bg-peach/20 flex items-center justify-center hover:bg-peach/30 transition-colors active:scale-90"
            aria-label="Увеличить количество"
          >
            <Plus size={12} className="text-peach" />
          </button>
        </>
      ) : (
        <span className="text-sm text-white/20 font-medium">—</span>
      )}
      {qty > 0 && (
        <button
          onClick={onRemove}
          className="text-white/20 hover:text-red-400 transition-colors ml-1 active:scale-90"
          aria-label="Удалить из корзины"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}
