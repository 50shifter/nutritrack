"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, Check, AlertCircle, Trash2, X } from "lucide-react";
import { useApp } from "@/lib/context";
import { z } from "zod";
import { useRouter } from "next/navigation";

const settingsSchema = z.object({
  name: z.string().min(1, "Имя обязательно").max(50, "Максимум 50 символов"),
  email: z.string().email("Некорректный email"),
  currency: z.enum(["RUB", "USD", "EUR"]),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    spendingReminders: z.boolean(),
  }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { userName, setUserName } = useApp();
  const router = useRouter();

  const [form, setForm] = useState<SettingsFormData>({
    name: userName || "Алексей", email: "alex@finflow.com", currency: "RUB",
    notifications: { email: true, push: true, spendingReminders: false },
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("finflow_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm({ ...form, ...parsed } as SettingsFormData);
      }
    } catch (err) {
      console.error("[Settings Page] Failed to load settings:", err);
    }
  }, []);

  const [errors, setErrors] = useState<Partial<Record<keyof SettingsFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteType, setDeleteType] = useState<"account" | "data" | "clear">("account");

  const validate = useCallback((): boolean => {
    try {
      settingsSchema.parse(form);
      setErrors({});
      return true;
    } catch (e: unknown) {
      const newErrors: Partial<Record<keyof SettingsFormData, string>> = {};
      if (typeof e === "object" && e !== null && "issues" in e) {
        const issues = (e as { issues?: Array<{ path: (string | number)[]; message: string }> }).issues || [];
        for (const issue of issues) {
          const path = issue.path?.[0];
          if (typeof path === "string" && path in newErrors) {
            newErrors[path as keyof typeof newErrors] = issue.message;
          }
        }
      }
      setErrors(newErrors);
      return false;
    }
  }, [form]);

  const handleSave = useCallback(async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      localStorage.setItem("finflow_settings", JSON.stringify(form));
      setUserName(form.name);
    } catch (err) {
      console.error("[Settings Page] Save error:", err);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [form, validate, setUserName]);

  const confirmAccountDelete = () => { setDeleteType("account"); setShowDelete(true); };
  const confirmDataDelete = () => { setDeleteType("data"); setShowDelete(true); };
  const confirmClearCache = () => { setDeleteType("clear"); setShowDelete(true); };

  const executeDelete = () => {
    if (deleteType === "account") {
      localStorage.removeItem("finflow_user");
      localStorage.removeItem("finflow_settings");
      localStorage.removeItem("finflow_transactions");
      localStorage.removeItem("finflow_categories");
      localStorage.removeItem("finflow_goals");
      router.push("/auth");
    } else if (deleteType === "data") {
      localStorage.removeItem("finflow_transactions");
      localStorage.removeItem("finflow_goals");
    } else if (deleteType === "clear") {
      try {
        localStorage.clear();
      } catch (err) {
        console.error("[Settings Page] Failed to clear storage:", err);
      }
    }
    setShowDelete(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Настройки</h2>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-50 text-sm font-medium transition-colors">
          {saving ? (
            <>
              <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Сохранение...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4" /> Сохранено
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Сохранить
            </>
          )}
        </button>
      </div>

      {/* Profile */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-sm font-semibold mb-5">Профиль</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center text-2xl font-bold text-purple-300">
            {form.name?.[0]?.toUpperCase() || "А"}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{form.name || "Гость"}</p>
            <p className="text-xs text-white/25">{form.email || "Не указан"}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Имя</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-sm placeholder-white/20 focus:outline-none focus:ring-1 transition-colors ${errors.name ? "border-red-500/30 focus:ring-red-500/30" : "border-white/5 focus:ring-purple-500/30 focus:border-purple-500/30"}`} />
            {errors.name && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-sm placeholder-white/20 focus:outline-none focus:ring-1 transition-colors ${errors.email ? "border-red-500/30 focus:ring-red-500/30" : "border-white/5 focus:ring-purple-500/30 focus:border-purple-500/30"}`} />
            {errors.email && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Валюта</label>
            <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as SettingsFormData["currency"] })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-white/40 focus:outline-none focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500/30 transition-colors">
              <option value="RUB">🇷🇺 RUB — Российский рубль</option>
              <option value="USD">🇺🇸 USD — Доллар США</option>
              <option value="EUR">🇪🇺 EUR — Евро</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-sm font-semibold mb-5">Уведомления</h3>
        <div className="space-y-4">
          {([
            { key: "email" as const, label: "Email-уведомления", desc: "Получать сводки на email" },
            { key: "push" as const, label: "Push-уведомления", desc: "Уведомления в браузере" },
            { key: "spendingReminders" as const, label: "Напоминания о расходах", desc: "Еженедельный обзор расходов" },
          ]).map(({ key, label, desc }) => (
            <label key={key} className="flex items-center justify-between cursor-pointer group">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-white/30">{desc}</p>
              </div>
              <div className="relative">
                <input type="checkbox" checked={form.notifications[key]}
                  onChange={(e) => setForm({ ...form, notifications: { ...form.notifications, [key]: e.target.checked } })} className="sr-only" />
                <div className={`w-10 h-6 rounded-full transition-colors ${form.notifications[key] ? "bg-purple-500/30" : "bg-white/10"}`} />
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${form.notifications[key] ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass rounded-2xl p-6 border-red-500/10">
        <h3 className="text-sm font-semibold text-red-400 mb-4">Опасная зона</h3>
        <div className="space-y-3">
          {/* Clear cache */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div>
              <p className="text-sm font-medium">Очистить кэш</p>
              <p className="text-xs text-white/25">Удалить все сохранённые данные из браузера</p>
            </div>
            <button onClick={confirmClearCache} className="px-4 py-2 rounded-lg bg-white/[0.04] text-xs text-white/40 hover:text-white/60 hover:bg-white/[0.08] transition-colors">
              Очистить
            </button>
          </div>

          {/* Delete transaction data */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div>
              <p className="text-sm font-medium">Удалить все данные</p>
              <p className="text-xs text-white/25">Транзакции, цели — всё будет удалено</p>
            </div>
            <button onClick={confirmDataDelete} className="px-4 py-2 rounded-lg bg-red-500/10 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/20 transition-colors">
              Удалить данные
            </button>
          </div>

          {/* Delete account */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/[0.03] border border-red-500/10">
            <div>
              <p className="text-sm font-medium text-red-400">Удалить аккаунт</p>
              <p className="text-xs text-white/25">Полностью удалить аккаунт, выйти из системы</p>
            </div>
            <button onClick={confirmAccountDelete} className="px-4 py-2 rounded-lg bg-red-500/20 text-xs text-red-400 hover:bg-red-500/30 transition-colors">
              Удалить аккаунт
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowDelete(false)} />
          <div className="relative glass-strong rounded-2xl p-6 w-full max-w-sm border border-white/[0.06]">
            <button onClick={() => setShowDelete(false)} className="absolute top-4 right-4 text-white/20 hover:text-white/50 transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-base font-semibold">
                {deleteType === "account" ? "Удалить аккаунт?" :
                 deleteType === "data" ? "Удалить данные?" : "Очистить кэш?"}
              </h3>
            </div>
            <p className="text-sm text-white/40 mb-6">
              {deleteType === "account" ? "Вы будете полностью разлогинены. Все данные удалены." :
               deleteType === "data" ? "Все транзакции и финансовые цели будут удалены безвозвратно." :
               "Все сохранённые настройки и данные будут удалены."}
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDelete(false)} className="px-4 py-2 rounded-xl text-sm text-white/40 hover:text-white/60 hover:bg-white/5 transition-colors">Отмена</button>
              <button onClick={executeDelete} className="px-4 py-2 rounded-xl text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">Подтвердить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
