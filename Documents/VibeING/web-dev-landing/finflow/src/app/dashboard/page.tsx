"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { TrendingUp, TrendingDown, Wallet, Filter, Download, Activity, AlertTriangle, CreditCard } from "lucide-react";
import KpiCard from "@/components/KpiCard";
import TransactionRow from "@/components/TransactionRow";
import { PageSkeleton } from "@/components/Skeleton";
import { MOCK_CATEGORIES, MONTHLY_DATA, WEEKLY_DATA } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { useApp } from "@/lib/context";
import type { MonthlyData, PieItem, Transaction, WeeklyData } from "@/lib/types";

interface DashboardStats {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  monthlyData: MonthlyData[];
  pieData: PieItem[];
  weeklyData: WeeklyData[];
  topCategories: { name: string; amount: number; color: string }[];
  budgetProgress: { name: string; current: number; limit: number; color: string }[];
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem("finflow_transactions");
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function saveTransactions(data: Transaction[]) {
  localStorage.setItem("finflow_transactions", JSON.stringify(data));
}

function addTransaction(tx: Transaction) {
  const all = getTransactions();
  saveTransactions([...all, { ...tx, id: generateId() }]);
}

function updateTransaction(updated: Transaction) {
  const all = getTransactions().map((tx) => tx.id === updated.id ? updated : tx);
  saveTransactions(all);
}

function deleteTransaction(id: string) {
  saveTransactions(getTransactions().filter((tx) => tx.id !== id));
}


function LoadingChart() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="space-y-4">
        <div className="h-4 w-24 bg-white/5 rounded-full animate-pulse" />
        <div className="h-48 md:h-64 bg-white/3 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { currency, userName, currentPage, setCurrentPage } = useApp();
  const [redirecting, setRedirecting] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [viewMode, setViewMode] = useState<"overview" | "analytics">("overview");

  const computeStats = useCallback((txs: Transaction[]) => {
    const filtered = timeRange === 0 ? txs : txs.filter((t) => {
      const cutoff = new Date(Date.now() - timeRange * 86400000);
      return new Date(t.date) >= cutoff;
    });

    const income = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

    // Pie data
    const pieData = MOCK_CATEGORIES
      .filter((c) => c.type === "expense")
      .map((c) => {
        const total = filtered.filter((t) => t.type === "expense" && t.category === c.name).reduce((s, t) => s + t.amount, 0);
        return { name: c.name, value: total, color: c.color };
      })
      .filter((d) => d.value > 0);

    // Top categories
    const topCategories = MOCK_CATEGORIES
      .filter((c) => c.type === "expense")
      .map((c) => ({
        name: c.name,
        amount: filtered.filter((t) => t.category === c.name && t.type === "expense").reduce((s, t) => s + t.amount, 0),
        color: c.color,
      }))
      .filter((c) => c.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);

    // Budget progress
    const budgetProgress = MOCK_CATEGORIES
      .filter((c) => c.type === "expense" && c.limit != null && c.limit! > 0)
      .map((c) => {
        const spent = filtered.filter((t) => t.category === c.name && t.type === "expense").reduce((s, t) => s + t.amount, 0);
        return { name: c.name, current: spent, limit: c.limit!, color: c.color };
      });

    // Monthly data — aggregate by month from transactions or use mock
    const monthlyMap = new Map<string, { income: number; expense: number }>();
    txs.forEach((t) => {
      const month = t.date.slice(0, 7); // YYYY-MM
      if (!monthlyMap.has(month)) monthlyMap.set(month, { income: 0, expense: 0 });
      const m = monthlyMap.get(month)!;
      if (t.type === "income") m.income += t.amount;
      else m.expense += t.amount;
    });

    // Fill gaps and sort
    const months = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, data]) => {
        const m = new Date(month + "-01");
        const names = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
        return { month: names[m.getMonth()], income: data.income, expense: data.expense, profit: data.income - data.expense };
      });

    if (months.length === 0) {
      // Fallback to mock data
      return {
        balance: 0, totalIncome: 0, totalExpense: 0,
        monthlyData: MONTHLY_DATA,
        pieData: MOCK_CATEGORIES.filter((c) => c.type === "expense").map((c) => ({ name: c.name, value: 0, color: c.color })).filter((d) => d.value > 0) || [],
        weeklyData: WEEKLY_DATA,
        topCategories: [],
        budgetProgress: [],
      };
    }

    return {
      balance: income - expense,
      totalIncome: income,
      totalExpense: expense,
      monthlyData: months.length > 0 ? months : MONTHLY_DATA,
      pieData,
      weeklyData: WEEKLY_DATA,
      topCategories,
      budgetProgress,
    };
  }, [timeRange]);

  const fetchData = useCallback(() => {
    setLoading(true);
    const txs = getTransactions();
    setTransactions(txs);
    setStats(computeStats(txs));
    setLoading(false);
  }, [computeStats, timeRange]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => { setLoading(true); const txs = getTransactions(); setTransactions(txs); setStats(computeStats(txs)); setLoading(false); }, [computeStats]);

  // ── All hooks must be called BEFORE any early return ──
  const rangeFilteredTx = useMemo(() => {
    if (timeRange === 0 || !transactions.length) return [...transactions];
    const cutoff = new Date(Date.now() - timeRange * 86400000);
    return transactions.filter((t) => new Date(t.date) >= cutoff).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions, timeRange]);

  const periodIncome = useMemo(() => rangeFilteredTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0), [rangeFilteredTx]);
  const periodExpense = useMemo(() => rangeFilteredTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0), [rangeFilteredTx]);
  const savings = useMemo(() => periodIncome - periodExpense, [periodIncome, periodExpense]);
  const savingsRate = useMemo(() => periodIncome > 0 ? ((savings / periodIncome) * 100).toFixed(0) : "0", [periodIncome, savings]);
  const filteredMonthly = useMemo(() => (timeRange === 0 || !stats) ? stats?.monthlyData || [] : stats.monthlyData.slice(-Math.ceil(timeRange / 30)), [timeRange, stats]);

  // Guard: show login prompt if not logged in
  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("finflow_user");
  const showLoginPrompt = !isLoggedIn && !loading && stats;
  if (showLoginPrompt) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Wallet className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Войдите в аккаунт</h2>
          <p className="text-sm text-white/30 mb-6">Для доступа к дашборду необходимо авторизоваться</p>
          <a href="/auth" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20">
            Войти или зарегистрироваться
          </a>
        </div>
      </div>
    );
  }
  if (loading || !stats) return <PageSkeleton />;

  const exportCSV = useCallback(() => {
    const csvLines = rangeFilteredTx.map((t) => `${t.date},${t.description},${t.category},${t.type === "income" ? "Доход" : "Расход"},${t.amount}`);
    const blob = new Blob(["\uFEFF" + ["Дата,Описание,Категория,Тип,Сумма", ...csvLines].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finflow_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [rangeFilteredTx]);

  const alerts = useMemo(() => [
    ...(periodExpense > periodIncome ? [{ type: "danger" as const, message: "Расходы превышают доходы за период" }] : []),
    ...(stats?.topCategories.slice(0, 3) || []).map((c) => ({ type: "warning" as const, message: `${c.name}: ${formatCurrency(c.amount, currency)} потрачено` })),
  ], [periodIncome, periodExpense, stats?.topCategories, currency]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-medium border border-violet-500/20">🐾 Демо-режим</span>
          <h2 className="text-2xl font-bold tracking-tight mt-2">Добро пожаловать, {userName || "гость"} 👋</h2>
          <p className="text-sm text-white/40 mt-1">Данные хранятся локально (localStorage), серверная часть не используется</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode(viewMode === "overview" ? "analytics" : "overview")} className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-medium text-white hover:bg-white/15 transition-colors">
            {viewMode === "overview" ? "📊 Аналитика" : "🏠 Обзор"}
          </button>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white/40 hover:text-white/60 hover:bg-white/10 transition-colors">
            <Download size={12} /> Экспорт CSV
          </button>
        </div>
      </div>

      {/* Time Range */}
      <div className="flex items-center gap-2 flex-wrap">
        {[{ label: "7 дней", days: 7 }, { label: "30 дней", days: 30 }, { label: "90 дней", days: 90 }, { label: "Всё время", days: 0 }].map((r) => (
          <button key={r.days} onClick={() => setTimeRange(r.days)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${timeRange === r.days ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}>
            {r.label}
          </button>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className={`flex items-center gap-2 p-3 rounded-xl text-xs ${a.type === "danger" ? "bg-red-500/10 text-red-300" : "bg-yellow-500/10 text-yellow-300"}`}>
              {a.type === "danger" ? <AlertTriangle size={14} /> : <Activity size={14} />}
              {a.message}
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard key={`balance-${stats.balance}-${currency}`} title="Баланс" value={formatCurrency(stats.balance, currency)} icon={<Wallet className="w-5 h-5 text-purple-300" />} iconBg="bg-purple-500/10" />
        <KpiCard key={`income-${periodIncome}-${currency}`} title="Доходы" value={`+${formatCurrency(periodIncome, currency)}`} icon={<TrendingUp className="w-5 h-5 text-green-400" />} iconBg="bg-green-500/10" change={{ value: 8, percent: "8%", direction: "up" as const }} />
        <KpiCard key={`expense-${periodExpense}-${currency}`} title="Расходы" value={`-${formatCurrency(periodExpense, currency)}`} icon={<TrendingDown className="w-5 h-5 text-red-400" />} iconBg="bg-red-500/10" change={{ value: 5, percent: "5%", direction: "down" as const }} />
        <KpiCard key={`savings-${savingsRate}-${currency}`} title="Накопления" value={`${savingsRate}%`} icon={<CreditCard className="w-5 h-5 text-blue-400" />} iconBg="bg-blue-500/10" />
      </div>

      {viewMode === "overview" ? (
        <>
          {/* Charts */}
          <Suspense fallback={<LoadingChart />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Monthly Area Chart */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Доходы и расходы</h3>
                <button className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  Фильтр
                </button>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={filteredMonthly}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(15,15,24,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }} formatter={(value: any) => [`${value.toLocaleString("ru-RU")} ₽`, ""]} />
                  <Area type="monotone" dataKey="income" stroke="#34d399" fill="url(#colorIncome)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expense" stroke="#f87171" fill="url(#colorExpense)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-3">
                <div className="flex items-center gap-2 text-xs text-white/40"><div className="w-2.5 h-2.5 rounded-full bg-green-400" />Доходы</div>
                <div className="flex items-center gap-2 text-xs text-white/40"><div className="w-2.5 h-2.5 rounded-full bg-red-400" />Расходы</div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-4">По категориям</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={stats.pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" strokeWidth={0}>
                    {stats.pieData.map((_, i) => (<Cell key={`cell-${i}`} fill={stats.pieData[i].color} />))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "rgba(15,15,24,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }} formatter={(value: any) => [`${value.toLocaleString("ru-RU")} ₽`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {stats.pieData.map((d, i) => (<div key={i} className="flex items-center gap-2 text-xs text-white/30 px-1"><div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} /><span className="truncate">{d.name}</span></div>))}
              </div>
            </div>
          </div>
          </Suspense>

          <Suspense fallback={<LoadingChart />}>
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-4">Недельная активность</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(15,15,24,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }} formatter={(value: any) => [`${value.toLocaleString("ru-RU")} ₽`, ""]} />
                <Legend />
                <Bar dataKey="income" fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </Suspense>

          {/* Budget Progress */}
          {stats.budgetProgress.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-4">Прогресс бюджета</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.budgetProgress.map((b) => {
                  const pct = Math.min((b.current / b.limit) * 100, 100);
                  const color = pct > 90 ? "bg-red-500" : pct > 70 ? "bg-yellow-500" : "bg-green-500";
                  return (
                    <div key={b.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/40">{b.name}</span>
                        <span>{formatCurrency(b.current, currency)} / {formatCurrency(b.limit, currency)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                        <div className={`h-full rounded-full ${color} transition-all duration-1000`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Analytics View */}
          <Suspense fallback={<LoadingChart />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Categories Bar */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-4">Топ категории расходов</h3>
              <div className="space-y-3">
                {stats.topCategories.map((c) => {
                  const max = Math.max(...stats.topCategories.map(x => x.amount));
                  const pct = max > 0 ? (c.amount / max) * 100 : 0;
                  return (
                    <div key={c.name} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                      <span className="text-xs text-white/40 w-24 truncate">{c.name}</span>
                      <div className="flex-1 h-3 rounded-full bg-white/[0.03] overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: c.color }} />
                      </div>
                      <span className="text-xs font-medium w-20 text-right">{formatCurrency(c.amount, currency)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Comparison */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-4">Месячная динамика</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={filteredMonthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(15,15,24,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }} formatter={(value: any) => [`${value.toLocaleString("ru-RU")} ₽`, ""]} />
                  <Bar dataKey="income" fill="#34d399" radius={[4, 4, 0, 0]} name="Доход" />
                  <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} name="Расход" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          </Suspense>

          <Suspense fallback={<LoadingChart />}>
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-4">Накопления по месяцам</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={filteredMonthly}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(15,15,24,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }} formatter={(value: any) => [`${value.toLocaleString("ru-RU")} ₽`, ""]} />
                <Area type="monotone" dataKey={(d: MonthlyData) => d.income - d.expense} stroke="#818cf8" fill="url(#colorSavings)" strokeWidth={2} name="Накопления" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          </Suspense>
        </>
      )}

      {/* Recent Transactions */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Последние транзакции</h3>
          <a href="/transactions" className="text-xs text-purple-300 hover:text-purple-200 transition-colors">Все →</a>
        </div>
        <div className="space-y-1">
          {rangeFilteredTx.slice(0, 5).map((t) => (
            <TransactionRow key={t.id} transaction={t} category={MOCK_CATEGORIES.find((c) => c.name === t.category)} currency={currency} />
          ))}
          {rangeFilteredTx.length === 0 && (
            <div className="text-center py-8 text-sm text-white/20">
              Нет транзакций. Добавьте первую!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
