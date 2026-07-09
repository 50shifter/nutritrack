"use client";

import { useState, useEffect } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

let listeners: ((toast: Toast) => void)[] = [];
let nextId = 0;

function notify(message: string, type: Toast["type"] = "success") {
  const toast: Toast = { id: ++nextId, message, type };
  listeners.forEach((fn) => fn(toast));
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    function handler(toast: Toast) {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 2500);
    }
    listeners.push(handler);
    return () => {
      listeners = listeners.filter((fn) => fn !== handler);
    };
  }, []);

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-[999] space-y-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg animate-slide-in-right ${
              t.type === "success"
                ? "bg-emerald-500 text-white"
                : t.type === "error"
                  ? "bg-red-500 text-white"
                  : "bg-peach text-white"
            }`}
          >
            {t.type === "success" && "✓ "}
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}

export const toast = {
  success: (message: string) => notify(message, "success"),
  error: (message: string) => notify(message, "error"),
  info: (message: string) => notify(message, "info"),
};
