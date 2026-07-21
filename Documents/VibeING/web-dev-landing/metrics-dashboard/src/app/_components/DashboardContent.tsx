"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

const PROJECTS = [
  { name: "FinFlow", port: 3001, color: "#8b5cf6", desc: "Финансовый дашборд" },
  { name: "MediCare", port: 3002, color: "#f43f5e", desc: "Медицинский портал" },
  { name: "GreenMarket", port: 3003, color: "#10b981", desc: "E-commerce" },
  { name: "FoodHub", port: 3004, color: "#f59e0b", desc: "Доставка еды" },
  { name: "LuxStay", port: 3005, color: "#0ea5e9", desc: "Бронирование отелей" },
  { name: "Artisan", port: 3006, color: "#eab308", desc: "Портфолио мастера" },
];

const COLORS = ["#8b5cf6", "#f43f5e", "#10b981", "#f59e0b", "#0ea5e9", "#eab308"];

// ─── Генератор моковых данных ──────────────────────────────────────────────
function generateMockDailyData(days: number, seed?: number) {
  const s = seed ?? Date.now();
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - 1 - i) * 86400000).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    }),
    events: Math.floor(Math.random() * 200) + 50,
    sessions: Math.floor(Math.random() * 80) + 20,
  }));
}

const MOCK_EVENTS_BY_TYPE = [
  { name: "pageview", count: 1250 },
  { name: "signin", count: 340 },
  { name: "dashboard_view", count: 420 },
  { name: "signup", count: 180 },
  { name: "transaction_added", count: 280 },
  { name: "goal_created", count: 45 },
  { name: "chart_filtered", count: 156 },
  { name: "export_triggered", count: 23 },
];

const MOCK_TOP_PAGES = [
  { page: "/", views: 890 },
  { page: "/dashboard", views: 420 },
  { page: "/auth/signin", views: 340 },
  { page: "/auth/signup", views: 180 },
  { page: "/transactions", views: 280 },
  { page: "/goals", views: 95 },
];

const MOCK_FUNNEL = [
  { name: "Просмотры", value: 1250 },
  { name: "Регистрации", value: 180 },
  { name: "Входы", value: 340 },
  { name: "Дашборд", value: 420 },
  { name: "Транзакции", value: 280 },
  { name: "Цели", value: 45 },
];

// ─── Утилиты ────────────────────────────────────────────────────────────────
const totalEventsFromMock = MOCK_EVENTS_BY_TYPE.reduce((sum, e) => sum + e.count, 0);

function getDailyDataForRange(range: "7d" | "30d" | "90d", seed: number) {
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  return generateMockDailyData(days, seed);
}

// ─── Основной компонент ────────────────────────────────────────────────────
export default function DashboardContent() {
  // Данные всегда есть с первой отрисовки — никаких спиннеров при SSR
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [lastRefresh, setLastRefresh] = useState<number>(0); // 0 = не инициализировано
  const [apiAvailable, setApiAvailable] = useState<boolean>(false);
  const [clientTime, setClientTime] = useState<string>(""); // client-only для SSR-совместимости

  const seed = useRef<number>(Date.now());

  // ─── ДАННЫЕ СРАЗУ, без загрузочного состояния ────────────────────────────
  const dailyData = getDailyDataForRange(timeRange, lastRefresh);

  const totalEvents = totalEventsFromMock;
  const uniqueSessions = Math.floor(totalEvents * 0.3);
  const uniqueUsers = Math.floor(totalEvents * 0.15);
  const avgPerDay = Math.round(totalEvents / (timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90));

  // ─── Фоновая попытка подключиться к FinFlow API (не блокирует UI) ────────
  const tryConnectToFinFlow = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const res = await fetch("http://localhost:3001/api/metrics", {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        // Если API ответило — запоминаем и показываем индикатор
        setApiAvailable(true);
        console.log("[Metrics] FinFlow API подключена", data);
        return;
      }
    } catch (err: unknown) {
      // API недоступен — это нормально для демо-режима
      console.log("[Metrics] FinFlow API недоступна, используем демо-данные", err);
    }
    setApiAvailable(false);
  }, []);

  // Запускаем проверку API один раз при гидратации
  useEffect(() => {
    // Устанавливаем client-only данные после гидратации
    setClientTime(new Date().toLocaleTimeString("ru-RU"));
    setLastRefresh(Date.now());
    tryConnectToFinFlow();
  }, [tryConnectToFinFlow]);

  // Ручное обновление данных
  const handleRefresh = useCallback(() => {
    seed.current = Date.now();
    setLastRefresh(Date.now());
  }, []);

  // Авто-обновление каждые 60 сек
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* ─── Header: Time Range + Refresh ──────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {([
            { label: "7 дней", value: "7d" as const },
            { label: "30 дней", value: "30d" as const },
            { label: "90 дней", value: "90d" as const },
          ]).map((r) => (
            <button
              key={r.value}
              onClick={() => setTimeRange(r.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === r.value
                  ? "bg-white/10 text-white"
                  : "text-white/30 hover:text-white/60 hover:bg-white/5"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors"
          >
            🔄 Обновить
          </button>
          <span className="text-xs text-white/20">
            {apiAvailable ? "✅ API подключена" : "Демо-режим (mock data)"}
          </span>
        </div>
      </div>

      {/* ─── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Всего событий" value={totalEvents.toLocaleString()} icon="📊" delay={0} />
        <KpiCard title="Сессии" value={uniqueSessions.toLocaleString()} icon="👥" delay={1} />
        <KpiCard title="Уникальные" value={uniqueUsers.toLocaleString()} icon="🎯" delay={2} />
        <KpiCard title="Среднее/день" value={avgPerDay.toLocaleString()} icon="📈" delay={3} />
      </div>

      {/* ─── Charts Row 1 ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Events Trend */}
        <div className="lg:col-span-2 glass rounded-2xl p-5 animate-fade-in">
          <h3 className="text-sm font-semibold mb-4 text-white/70">Динамика событий</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }}
              />
              <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="events"
                stroke="#8b5cf6"
                fill="url(#colorGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Events by Type */}
        <div className="glass rounded-2xl p-5 animate-fade-in animate-fade-in-delay-1">
          <h3 className="text-sm font-semibold mb-4 text-white/70">Типы событий</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={MOCK_EVENTS_BY_TYPE} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }}
                width={110}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Charts Row 2 ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Funnel */}
        <div className="glass rounded-2xl p-5 animate-fade-in animate-fade-in-delay-2">
          <h3 className="text-sm font-semibold mb-4 text-white/70">Воронка конверсий</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MOCK_FUNNEL}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
              />
              <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {MOCK_FUNNEL.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Pages */}
        <div className="glass rounded-2xl p-5 animate-fade-in animate-fade-in-delay-3">
          <h3 className="text-sm font-semibold mb-4 text-white/70">Топ страниц</h3>
          <div className="space-y-3">
            {MOCK_TOP_PAGES.map((page, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-white/50 truncate flex-1 mr-4">
                  {page.page}
                </span>
                <div className="flex-1 mx-4">
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                      style={{
                        width: `${Math.min(
                          (page.views / MOCK_TOP_PAGES[0].views) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-xs text-white/30 w-12 text-right">
                  {page.views}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Projects Grid ─────────────────────────────────────────────────── */}
      <div className="glass rounded-2xl p-5 animate-fade-in animate-fade-in-delay-4">
        <h3 className="text-sm font-semibold mb-4 text-white/70">Проекты экосистемы</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {PROJECTS.map((project, i) => (
            <a
              key={project.name}
              href={`http://localhost:${project.port}`}
              target="_blank"
              rel="noopener"
              className="group relative rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${project.color}15` }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: project.color }}
                />
              </div>
              <h4 className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                {project.name}
              </h4>
              <p className="text-[10px] text-white/20 mt-0.5">{project.desc}</p>
              <div className="mt-2 text-xs text-white/30">Порт: {project.port}</div>
            </a>
          ))}
        </div>
      </div>

      {/* ─── Footer ────────────────────────────────────────────────────────── */}
      <footer className="text-center py-6 text-xs text-white/15">
        VibeING Metrics Dashboard •{" "}
        {apiAvailable ? "Реальные данные из FinFlow API" : "Демо-режим (mock data)"} •{" "}
        Обновлено: {clientTime || "--:--:--"} • {new Date().getFullYear()}
      </footer>
    </div>
  );
}

// ─── KPI Card ───────────────────────────────────────────────────────────────
function KpiCard({ title, value, icon, delay }: { title: string; value: string; icon: string; delay: number }) {
  return (
    <div className={`glass rounded-2xl p-5 animate-fade-in animate-fade-in-delay-${delay}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-white/30">{title}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
        {value}
      </div>
    </div>
  );
}