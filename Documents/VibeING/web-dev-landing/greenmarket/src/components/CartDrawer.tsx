import { X, Plus, Minus, BaggageClaim } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/context";
import Image from "next/image";

export default function CartDrawer() {
  const { items, total, openCart, closeCart, isOpen, updateQty, removeItem } = useCart();
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={closeCart}
            role="dialog"
            aria-label="Корзина"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 z-50 w-full sm:w-[420px] h-full bg-[#1A241A] border-l border-white/[0.03] flex flex-col"
            role="dialog"
            aria-label="Корзина"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.03]">
              <h3 className="text-base font-bold">Корзина ({itemCount})</h3>
              <button
                onClick={closeCart}
                className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50"
                aria-label="Закрыть корзину"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/30">
                  <BaggageClaim size={48} className="mb-3 opacity-30" />
                  <p className="text-sm">Корзина пуста</p>
                  <p className="text-xs text-white/20 mt-1">Добавьте товары из каталога</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]"
                    >
                      <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="56px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-green-light font-bold mt-1">{(item.product.price * item.qty).toLocaleString()} ₽</p>
                        <div className="flex items-center gap-2 mt-2">
                          <QtyButton onClick={() => updateQty(item.product.id, -1)} disabled={item.qty <= 1}>
                            <Minus size={12} />
                          </QtyButton>
                          <span className="text-sm w-6 text-center">{item.qty}</span>
                          <QtyButton onClick={() => updateQty(item.product.id, 1)}>
                            <Plus size={12} />
                          </QtyButton>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-white/20 hover:text-red-400 self-start p-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded"
                        aria-label={`Удалить ${item.product.name} из корзины`}
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-white/[0.03] space-y-4">
                <div className="flex justify-between">
                  <span className="text-white/50">Итого</span>
                  <span className="text-lg font-bold text-green-light">{total.toLocaleString()} ₽</span>
                </div>
                {total < 2000 && (
                  <p className="text-xs text-white/30 text-center">До бесплатной доставки {(2000 - total).toLocaleString()} ₽</p>
                )}
                <a
                  href="/checkout"
                  className="block w-full py-3 rounded-xl bg-green text-white font-medium text-sm text-center hover:bg-green/80 transition-colors active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50"
                >
                  Оформить заказ →
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function QtyButton({ children, onClick, disabled = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-6 h-6 rounded bg-white/[0.05] flex items-center justify-center hover:bg-white/[0.1] transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50"
    >
      {children}
    </button>
  );
}
