"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { Search, Download, SortAsc, SortDesc, Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import TransactionRow from "@/components/TransactionRow";
import Pagination from "@/components/Pagination";
import { MOCK_TRANSACTIONS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { useApp } from "@/lib/context";
import type { Transaction } from "@/lib/types";

type SortField = "date" | "description" | "amount" | "category";
type SortDirection = "asc" | "desc";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem("finflow_transactions");
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  // Seed with mock data on first load
  return MOCK_TRANSACTIONS;
}

function saveTransactions(data: Transaction[]) {
  localStorage.setItem("finflow_transactions", JSON.stringify(data));
}

/* ─── Transaction Form Modal ─── */
function TransactionModal({
  transaction,
  onClose,
  onSave,
}: {
  transaction?: Transaction;
  onClose: () => void;
  onSave: (t: Transaction) => void;
}) {
  const [form, setForm] = useState({
    date: transaction?.date ?? new Date().toISOString().split("T")[0],
    description: transaction?.description ?? "",
    amount: transaction?.amount?.toString() ?? "",
    type: transaction?.type ?? ("expense" as "income" | "expense"),
    category: transaction?.category ?? "",
  });
  const incomeCats = MOCK_CATEGORIES.filter((c) => c.type === "income");
  const expenseCats = MOCK_CATEGORIES.filter((c) => c.type === "expense");
  const cats = form.type === "income" ? incomeCats : expenseCats;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(form.amount);
    if (!form.description.trim() || !amt || amt <= 0 || !form.category) return;
    onSave({
      id: transaction?.id ?? generateId(),
      date: form.date,
      description: form.description.trim(),
      amount: amt,
      type: form.type,
      category: form.category,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-6 w-full max-w-md border border-white/[0.06]">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/20 hover:text-white/50 transition-colors">
          <X className="w-4 h-4" />
        </button>
        <h3 className="text-lg font-semibold mb-5">{transaction ? "Редактировать" : "Новая транзакция"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="flex gap-2">
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, type: t, category: "" })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  form.type === t
                    ? t === "income" ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-red-500/15 text-red-400 border border-red-500/20"
                    : "bg-white/[0.03] text-white/30 border border-white/[0.04]"
                }`}
              >
                {t === "income" ? "↑ Доход" : "↓ Расход"}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Сумма</label>
            <input
              type="number" placeholder="0" min="0" step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/30 transition-all"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Описание</label>
            <input
              type="text" placeholder="Например: Продукты в Ашане"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/30 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Категория</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white focus:outline-none focus:border-purple-500/30 transition-all appearance-none"
              >
                <option value="">Выберите</option>
                {cats.map((c) => (
                  <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Дата</label>
              <input
                type="date" value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white focus:outline-none focus:border-purple-500/30 transition-all"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20"
          >
            {transaction ? "Сохранить" : "Добавить"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── CSV Import Modal ─── */
function CsvImportModal({ onClose, onImport }: { onClose: () => void; onImport: (txs: Transaction[]) => void }) {
  const [text, setText] = useState("");
  const [imported, setImported] = useState<Transaction[]>([]);
  const [error, setError] = useState("");

  const parseCSV = () => {
    if (!text.trim()) { setError("Загрузите файл или вставьте данные"); return; }
    const lines = text.trim().split("\n");
    const results: Transaction[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      // Skip headers
      if (i === 0 && (line.toLowerCase().includes("дата") || line.toLowerCase().includes("date") || line.toLowerCase().includes("сумма"))) continue;

      // Support: "дата;описание;категория;сумма" or "дата,description,category,amount"
      const parts = line.split(/[;,\t]/).map((p) => p.trim());
      if (parts.length < 3) continue;

      // Try to detect format: date, description, category, amount
      let date = "", desc = "", cat = "", amt = 0;

      // Pattern 1: "2025-01-15;Зарплата;Зарплата;85000"
      // Pattern 2: "15.01.2025;Продукты;Еда;-4500"
      if (parts.length >= 4) {
        date = parts[0];
        desc = parts[1];
        cat = parts[2];
        amt = Number(parts[3].replace(/[^\d.]/g, ""));
      } else if (parts.length === 3) {
        // Try: date;description;amount
        date = parts[0];
        desc = parts[1];
        amt = Number(parts[2].replace(/[^\d.]/g, ""));
        cat = "Прочее";
      } else {
        continue;
      }

      if (!amt || isNaN(amt)) continue;
      if (amt < 0) { amt = Math.abs(amt); }

      // Normalize date to YYYY-MM-DD
      let normalizedDate = date;
      if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(date)) {
        const [d, m, y] = date.split(".");
        normalizedDate = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      }

      results.push({
        id: generateId(),
        date: normalizedDate,
        description: desc,
        amount: Math.round(amt),
        type: Math.round(amt) <= 0 ? "expense" : "income",
        category: cat || "Прочее",
      });
    }

    if (results.length === 0) {
      setError("Не удалось распознать данные. Формат: дата; описание; категория; сумма");
      return;
    }

    setImported(results);
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-6 w-full max-w-lg border border-white/[0.06]">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/20 hover:text-white/50 transition-colors">
          <X className="w-4 h-4" />
        </button>
        <h3 className="text-lg font-semibold mb-1">Импорт из CSV</h3>
        <p className="text-xs text-white/30 mb-5">Поддерживает выгрузки Сбербанка, Тинькофф, Альфа в формате CSV/Excel</p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
            <span className="text-xs text-white/30 font-mono">1</span>
            <span className="text-xs text-white/40">Дата; Описание; Категория; Сумма</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
            <span className="text-xs text-white/30 font-mono">2</span>
            <span className="text-xs text-white/40">15.01.2025; Продукты; Еда; 4500</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
            <span className="text-xs text-white/30 font-mono">3</span>
            <span className="text-xs text-white/40">Также работает с запятыми и табуляцией</span>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Вставьте данные из выгрузки банка или drag & drop CSV файл..."
          rows={5}
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-white placeholder-white/20 focus:outline-none focus:border-purple-500/30 font-mono resize-none"
        />

        <input
          ref={(el) => { if (el) { el.onchange = (e: any) => { const file = e.target.files?.[0]; if (file) { const r = new FileReader(); r.onload = () => setText(r.result as string); r.readAsText(file); } }; } }}
          type="file" accept=".csv,.txt,.tsv" className="hidden" id="csv-file"
        />

        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

        {imported.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/10">
            <p className="text-xs text-green-400">✅ Найдено {imported.length} транзакций</p>
            <button
              onClick={() => { onImport(imported); onClose(); }}
              className="mt-2 w-full py-2.5 rounded-xl bg-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/30 transition-colors"
            >
              Импортировать
            </button>
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <label htmlFor="csv-file" className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/[0.06] text-xs text-white/40 hover:text-white/60 text-center cursor-pointer transition-colors hover:bg-white/[0.08]">
            <Upload className="w-3.5 h-3.5 inline-block mr-1" /> Файл CSV
          </label>
          <button onClick={parseCSV} className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-sm text-white transition-colors">
            Парсить
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Confirm Modal ─── */
function DeleteConfirmModal({
  description,
  onClose,
  onConfirm,
}: {
  description: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative glass-strong rounded-2xl p-6 w-full max-w-sm border border-white/[0.06]">
        <h3 className="text-base font-semibold mb-2">Удалить транзакцию?</h3>
        <p className="text-sm text-white/40 mb-5 break-words">"{description}"</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-white/40 hover:text-white/60 hover:bg-white/5 transition-colors">Отмена</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">Удалить</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function TransactionsPage() {
  const { currency } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [showAdd, setShowAdd] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  // Save to localStorage on every change
  const updateTransactions = (updater: (prev: Transaction[]) => Transaction[]) => {
    const next = updater(transactions);
    setTransactions(next);
    saveTransactions(next);
  };

  const handleAdd = (t: Transaction) => {
    updateTransactions((prev) => [...prev, t]);
    setShowAdd(false);
  };

  const handleEdit = (t: Transaction) => {
    updateTransactions((prev) => prev.map((tx) => (tx.id === t.id ? t : tx)));
    setEditTx(undefined);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    updateTransactions((prev) => prev.filter((tx) => tx.id !== deleteId));
    setDeleteId(null);
  };

  const handleImport = (txs: Transaction[]) => {
    updateTransactions((prev) => [...prev, ...txs]);
    setImporting(false);
  };

  const exportCSV = () => {
    const header = "Дата;Описание;Категория;Тип;Сумма";
    const rows = filtered.map((t) => `${t.date};${t.description};${t.category};${t.type === "income" ? "Доход" : "Расход"};${t.amount}`);
    const blob = new Blob(["\uFEFF" + [header, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `finflow_export_${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  }, [sortField]);

  const filtered = useMemo(() => {
    let result = [...transactions];
    if (filterType !== "all") result = result.filter((t) => t.type === filterType);
    if (filterCategory !== "all") result = result.filter((t) => t.category === filterCategory);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter((t) => t.description.toLowerCase().includes(s) || t.category.toLowerCase().includes(s));
    }
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "date") cmp = a.date.localeCompare(b.date);
      else if (sortField === "amount") cmp = a.amount - b.amount;
      else if (sortField === "description") cmp = a.description.localeCompare(b.description);
      else if (sortField === "category") cmp = a.category.localeCompare(b.category);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [transactions, search, filterType, filterCategory, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / 10);
  const paged = filtered.slice((page - 1) * 10, page * 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold tracking-tight">Транзакции</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setImporting(true)} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white/50 hover:text-white transition-colors">
            <Upload className="w-3.5 h-3.5" /> Импорт
          </button>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white/50 hover:text-white transition-colors">
            <Download className="w-3.5 h-3.5" /> Экспорт
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-medium text-white hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20">
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text" placeholder="Поиск..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm placeholder-white/20 focus:outline-none focus:border-purple-500/30 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "income", "expense"] as const).map((type) => (
            <button key={type} onClick={() => { setFilterType(type); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${filterType === type ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}>
              {type === "all" ? "Все" : type === "income" ? "Доходы" : "Расходы"}
            </button>
          ))}
        </div>
        <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white/40 focus:outline-none focus:border-purple-500/30 transition-all">
          <option value="all">Все категории</option>
          {MOCK_CATEGORIES.map((c) => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {[{ key: "date" as SortField, label: "Дата" }, { key: "description" as SortField, label: "Описание" }, { key: "category" as SortField, label: "Категория" }, { key: "amount" as SortField, label: "Сумма" }].map(({ key, label }) => (
                  <th key={key} onClick={() => handleSort(key)} className="text-left text-xs text-white/30 font-medium uppercase tracking-wider p-4 cursor-pointer hover:text-white/50 transition-colors select-none">
                    <span className="inline-flex items-center gap-1">
                      {label}
                      {sortField === key && (sortDir === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
                    </span>
                  </th>
                ))}
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((t) => (
                <tr key={t.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 text-sm text-white/40">{t.date}</td>
                  <td className="p-4 text-sm font-medium">{t.description}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 text-xs text-white/40">
                      {MOCK_CATEGORIES.find((c) => c.name === t.category)?.icon}
                      {t.category}
                    </span>
                  </td>
                  <td className={`p-4 text-right text-sm font-semibold ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                    {t.type === "income" ? "+" : "-"}{t.amount.toLocaleString("ru-RU")} ₽
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditTx(t)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/20 hover:text-white/50 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(t.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={5} className="p-12 text-center text-sm text-white/20">Ничего не найдено</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} perPage={10} onPageChange={setPage} />
      </div>

      {/* Modals */}
      {showAdd && <TransactionModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
      {editTx && <TransactionModal transaction={editTx} onClose={() => setEditTx(undefined)} onSave={handleEdit} />}
      {deleteId && (
        <DeleteConfirmModal
          description={transactions.find((t) => t.id === deleteId)?.description ?? ""}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
      {importing && <CsvImportModal onClose={() => setImporting(false)} onImport={handleImport} />}
    </div>
  );
}
