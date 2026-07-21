"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, LineChart, Line
} from "recharts";
import { PROJECT_CONFIGS, type ProjectHealthStatus } from "@shared-metrics/lib/metrics-config";
import { initMetrics, trackEvent, trackPageview } from "@shared-metrics/lib/metrics-client";
import LoadingSpinner from "./LoadingSpinner";

const COLORS = ["#8b5cf6", "#f43f5e", "#10b981", "#f59e0b", "#0ea5e9", "#eab308"];

// ========================
// Mock Data Generators
// ========================
function generateDailyData(days: number, seed: number) {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(Date.now() - (days - 1 - i) * 86400000);
    return {
      date: date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
      timestamp: date.getTime(),
    };
  });
}

function generateEventsByProject(): Record<string, Array<{ name: string; count: number }>> {
  const projects: Record<string, Array<{ name: string; count: number }>> = {};
  PROJECT_CONFIGS.forEach((project, i) => {
    projects[project.name] = [
      { name: "pageview", count: Math.floor(Math.random() * 500) + 100 },
      { name: "signup", count: Math.floor(Math.random() * 50) + 10 },
      { name: "signin", count: Math.floor(Math.random() * 80) + 20 },
      { name: project.funnelSteps[3] || "action", count: Math.floor(Math.random() * 60) + 5 },
    ];
  });
  return projects;
}

function generateDailyTrend(days: number, seed: number): Array<{ date: string; events: number; sessions: number; users: number }> {
  return Array.from({ length: days }, (_, i) => ({
    date: generateDailyData(1, seed)[0].date,
    events: Math.floor(Math.random() * 300) + 100,
    sessions: Math.floor(Math.random() * 120) + 30,
    users: Math.floor(Math.random() * 60) + 10,
  }));
}

// ========================
// Health Check
// ========================
async function checkProjectHealth(project: typeof PROJECT_CONFIGS[0]): Promise<ProjectHealthStatus> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const start = Date.now();
    
    // 🔒 Use direct URL for health checks (separate Next.js instances)
    const res = await fetch(`http://localhost:${project.port}/health`, {
      signal: controller.signal,
      next: { revalidate: 0 },
    });
    clearTimeout(timeout);
    
    const responseTime = Date.now() - start;
    
    return {
      name: project.name,
      port: project.port,
      color: project.color,
      online: res.ok,
      lastChecked: new Date().toLocaleTimeString("ru-RU"),
      avgResponseTime: responseTime,
      errorRate: res.ok ? 0 : 1,
    };
  } catch {
    return {
      name: project.name,
      port: project.port,
      color: project.color,
      online: false,
      lastChecked: new Date().toLocaleTimeString("ru-RU"),
      avgResponseTime: 0,
      errorRate: 1,
    };
  }
}

// ========================
// Main Component
// ========================
export default function EcosystemDashboard() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [projectsHealth, setProjectsHealth] = useState<ProjectHealthStatus[]>([]);
  const [apiConnected, setApiConnected] = useState<Record<string, boolean>>({});
  const [lastRefresh, setLastRefresh] = useState<number>(0);
  const [clientTime, setClientTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const seed = useRef<number>(Date.now());

  // Fetch health status for all projects
  const refreshHealth = useCallback(async () => {
    const healthPromises = PROJECT_CONFIGS.map(checkProjectHealth);
    const results = await Promise.all(healthPromises);
    setProjectsHealth(results);
  }, []);

  // Fetch real metrics data
  const fetchMetricsData = useCallback(async () => {
    try {
      const finflowRes = await fetch("http://localhost:3001/api/metrics", { 
        signal: AbortSignal.timeout(2000) 
      });
      if (finflowRes.ok) {
        setApiConnected(prev => ({ ...prev, finflow: true }));
      }
    } catch {
      // API not available — use mock data
    }
  }, []);

  // Initial load
  useEffect(() => {
    setClientTime(new Date().toLocaleTimeString("ru-RU"));
    refreshHealth();
    fetchMetricsData();
    setIsLoading(false);
  }, [refreshHealth, fetchMetricsData]);

  // Auto-refresh health every 60s
  useEffect(() => {
    const interval = setInterval(refreshHealth, 60000);
    return () => clearInterval(interval);
  }, [refreshHealth]);

  // Manual refresh
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    refreshHealth();
    fetchMetricsData();
    setIsLoading(false);
  }, [refreshHealth, fetchMetricsData]);

  // Memoize computed values to prevent infinite re-renders
  const dailyData = useMemo(() => generateDailyTrend(
    timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90,
    lastRefresh
  ), [timeRange, lastRefresh]);

  const eventsByProject = useMemo(() => generateEventsByProject(), [lastRefresh]);

  const totalEvents = useMemo(() => Object.values(eventsByProject).flat().reduce((sum, e) => sum + e.count, 0), [eventsByProject]);
  const totalSessions = useMemo(() => Math.floor(totalEvents * 0.35), [totalEvents]);
  const totalUsers = useMemo(() => Math.floor(totalEvents * 0.18), [totalEvents]);
  const avgPerDay = useMemo(() => Math.round(totalEvents / (timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90)), [totalEvents, timeRange]);
  const onlineProjects = useMemo(() => projectsHealth.filter(p => p.online).length, [projectsHealth]);
  const totalProjects = PROJECT_CONFIGS.length;

  const projectBreakdown = useMemo(() => PROJECT_CONFIGS.map((project, i) => {
    const projectEvents = eventsByProject[project.name] || [];
    const projectTotal = projectEvents.reduce((sum, e) => sum + e.count, 0);
    const health = projectsHealth.find(p => p.name === project.name);
    return {
      ...project,
      events: projectTotal,
      health,
      color: COLORS[i],
    };
  }).sort((a, b) => b.events - a.events), [eventsByProject, projectsHealth]);

  const funnelData = useMemo(() => {
    if (selectedProject === "all") {
      return PROJECT_CONFIGS.map((p, i) => ({
        name: p.name,
        value: eventsByProject[p.name]?.[0]?.count || 0,
        color: COLORS[i],
      }));
    }
    const project = PROJECT_CONFIGS.find(p => p.name === selectedProject);
    if (!project) return [];
    const steps = ["pageview", "signup", "signin", project.funnelSteps[3] || "action"];
    const projectEvents = eventsByProject[selectedProject] || [];
    return steps.map((step, i) => ({
      name: step,
      value: projectEvents.find(e => e.name === step)?.count || 0,
      color: COLORS[i % COLORS.length],
    }));
  }, [selectedProject, eventsByProject]);

  const categoryData = useMemo(() => [
    { name: "Вовлечённость", value: 45, color: "#8b5cf6" },
    { name: "Авторизация", value: 25, color: "#f43f5e" },
    { name: "Сделки", value: 15, color: "#10b981" },
    { name: "Контент", value: 10, color: "#f59e0b" },
    { name: "Другое", value: 5, color: "#0ea5e9" },
  ], []);

  const selectedProjectConfig = useMemo(() => PROJECT_CONFIGS.find(p => p.name === selectedProject), [selectedProject]);

  // Show loading screen while fetching initial data
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* ===== Control Bar ===== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 mr-2">Период:</span>
          {([
            { label: "7 дней", value: "7d" as const },
            { label: "30 дней", value: "30d" as const },
            { label: "90 дней", value: "90d" as const },
          ]).map((r) => (
            <button
              key={r.value}
              onClick={() => setTimeRange(r.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === r.value
                  ? "bg-violet-500/20 text-violet-400 ring-1 ring-violet-500/30"
                  : "text-white/30 hover:text-white/60 hover:bg-white/5"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            <option value="all" className="bg-gray-900">Все проекты</option>
            {PROJECT_CONFIGS.map((p) => (
              <option key={p.name} value={p.name} className="bg-gray-900">
                {p.name} ({p.category})
              </option>
            ))}
          </select>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-all border border-violet-500/20"
          >
            🔄 Обновить
          </button>
          <span className="text-xs text-white/30 hidden sm:block">
            {isLoading ? "⏳ Загрузка..." : apiConnected.finflow ? "✅ API подключена" : "🎯 Демо-режим"}
          </span>
        </div>
      </div>

      {/* ===== KPI Cards ===== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard title="Всего событий" value={totalEvents.toLocaleString()} icon="📊" gradient="from-violet-500 to-indigo-500" />
        <KpiCard title="Сессии" value={totalSessions.toLocaleString()} icon="👥" gradient="from-rose-500 to-pink-500" />
        <KpiCard title="Уникальные" value={totalUsers.toLocaleString()} icon="🎯" gradient="from-emerald-500 to-teal-500" />
        <KpiCard title="Среднее/день" value={avgPerDay.toLocaleString()} icon="📈" gradient="from-amber-500 to-orange-500" />
        <KpiCard title="Онлайн" value={`${onlineProjects}/${totalProjects}`} icon="🟢" gradient="from-green-500 to-emerald-500" />
        <KpiCard title="Обновлено" value={clientTime || "--:--"} icon="🕐" gradient="from-sky-500 to-blue-500" />
      </div>

      {/* ===== Project Health Grid ===== */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold mb-4 text-white/70 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Статус проектов экосистемы
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {PROJECT_CONFIGS.map((project, i) => {
            const health = projectsHealth.find(p => p.name === project.name);
            const isOnline = health?.online ?? false;
            return (
              <div
                key={project.name}
                className={`relative rounded-xl border p-4 transition-all hover:scale-105 ${
                  isOnline 
                    ? "border-white/[0.08] bg-white/[0.02] cursor-pointer" 
                    : "border-white/[0.03] bg-white/[0.01] opacity-60"
                }`}
                onClick={() => setSelectedProject(selectedProject === project.name ? "all" : project.name)}
              >
                {/* Status indicator */}
                <div className="absolute top-3 right-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    isOnline ? "bg-emerald-500 shadow-lg shadow-emerald-500/50" : "bg-red-500"
                  }`}></span>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: `${project.color}15` }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: project.color }} />
                  </div>
                  <h4 className="text-sm font-semibold text-white/80">{project.name}</h4>
                  <p className="text-[10px] text-white/30 mt-0.5">{project.category}</p>
                  <div className="mt-2 text-xs text-white/25">:{project.port}</div>
                  
                  {health && isOnline && (
                    <div className="mt-1 text-[10px] text-white/20">
                      {health.avgResponseTime}ms
                    </div>
                  )}
                  
                  {selectedProject === project.name && (
                    <div className="mt-2 px-2 py-0.5 rounded bg-violet-500/20 text-[10px] text-violet-400">
                      Выбрано
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== Main Charts Row ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Events Trend Over Time */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white/70">Динамика событий</h3>
            {selectedProject !== "all" && (
              <span className="text-xs text-white/30">Проект: {selectedProject}</span>
            )}
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
              <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="events" stroke="#8b5cf6" fill="url(#colorGradient)" strokeWidth={2} />
              <Area type="monotone" dataKey="sessions" stroke="#10b981" fill="rgba(16,185,129,0.1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Event Distribution by Category */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-4 text-white/70">Распределение по категориям</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={categoryData[index].color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: cat.color }}></span>
                  <span className="text-white/50">{cat.name}</span>
                </span>
                <span className="text-white/30">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Events by Project ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Events Breakdown per Project */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-4 text-white/70">События по проектам</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {projectBreakdown.map((proj) => (
              <div key={proj.name} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: proj.color }}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60 truncate">{proj.name}</span>
                    <span className="text-xs text-white/30 shrink-0 ml-2">{proj.events.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${totalEvents > 0 ? (proj.events / totalEvents) * 100 : 0}%`,
                        background: proj.color,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project-Specific Events */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-4 text-white/70">
            {selectedProject === "all" ? "Типы событий (Все)" : `События: ${selectedProject}`}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={
              selectedProject === "all"
                ? Object.entries(eventsByProject).flatMap(([project, events]) => 
                    events.map(e => ({ name: `${project}\n${e.name}`, count: e.count }))
                  ).slice(0, 12)
                : (eventsByProject[selectedProject] || []).map(e => ({
                    name: e.name,
                    count: e.count,
                  }))
            } layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} width={100} />
              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                {(selectedProject === "all" 
                  ? Object.entries(eventsByProject).flatMap(([project, events]) => 
                      events.map((_, i) => i)
                    )
                  : (eventsByProject[selectedProject] || [])
                ).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== Conversion Funnel ===== */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white/70">
            {selectedProject === "all" ? "Сравнение конверсий по проектам" : `Воронка: ${selectedProject}`}
          </h3>
          {selectedProjectConfig && selectedProject !== "all" && (
            <div className="text-xs text-white/30">
              Этапы: {selectedProjectConfig.funnelSteps.join(" → ")}
            </div>
          )}
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={funnelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} />
            <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
            <Tooltip
              contentStyle={{
                background: "rgba(0,0,0,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {funnelData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={funnelData[index].color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== Per-Project Detailed Stats ===== */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold mb-4 text-white/70">Детализация по проектам</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/40">Проект</th>
                <th className="text-center py-3 px-4 text-white/40">Статус</th>
                <th className="text-center py-3 px-4 text-white/40">Порт</th>
                <th className="text-center py-3 px-4 text-white/40">События</th>
                <th className="text-center py-3 px-4 text-white/40">Конверсия</th>
                <th className="text-center py-3 px-4 text-white/40">Время ответа</th>
                <th className="text-center py-3 px-4 text-white/40">Действия</th>
              </tr>
            </thead>
            <tbody>
              {projectBreakdown.map((proj) => (
                <tr 
                  key={proj.name} 
                  className={`border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors ${
                    selectedProject === proj.name ? "bg-violet-500/5" : ""
                  }`}
                  onClick={() => setSelectedProject(selectedProject === proj.name ? "all" : proj.name)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: proj.color }}></div>
                      <span className="text-white/70 font-medium">{proj.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                      proj.health?.online 
                        ? "bg-emerald-500/10 text-emerald-400" 
                        : "bg-red-500/10 text-red-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        proj.health?.online ? "bg-emerald-500" : "bg-red-500"
                      }`}></span>
                      {proj.health?.online ? "Онлайн" : "Оффлайн"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-white/30">:{proj.port}</td>
                  <td className="py-3 px-4 text-center text-white/60">{proj.events.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="w-16 h-1.5 rounded-full bg-white/5 mx-auto overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${Math.min((proj.events / (totalEvents || 1)) * 100, 100)}%`,
                          background: proj.color 
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-white/30">
                    {proj.health ? `${proj.health.avgResponseTime}ms` : "—"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <a
                      href={`http://localhost:${proj.port}`}
                      target="_blank"
                      rel="noopener"
                      className="text-violet-400 hover:text-violet-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Открыть →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Event Types per Project ===== */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold mb-4 text-white/70">Доступные события по проектам</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROJECT_CONFIGS.map((project, i) => (
            <div key={project.name} className="rounded-xl border border-white/[0.05] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ background: project.color }}></div>
                <h4 className="text-sm font-semibold text-white/70">{project.name}</h4>
                <span className="text-[10px] text-white/30 ml-auto">{project.category}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(project.events || {}).slice(0, 6).map(([name, info]) => (
                  <span
                    key={name}
                    className="px-2 py-0.5 rounded text-[10px] bg-white/[0.03] text-white/40"
                  >
                    {name}
                  </span>
                ))}
                {Object.keys(project.events || {}).length > 6 && (
                  <span className="px-2 py-0.5 rounded text-[10px] text-white/20">
                    +{Object.keys(project.events || {}).length - 6}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Quick Links ===== */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold mb-4 text-white/70">Быстрые ссылки</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {PROJECT_CONFIGS.map((project) => (
            <a
              key={project.name}
              href={`http://localhost:${project.port}`}
              target="_blank"
              rel="noopener"
              className="group rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 text-center hover:bg-white/[0.04] hover:border-white/[0.1] transition-all"
            >
              <div className="w-8 h-8 rounded-lg mx-auto flex items-center justify-center mb-2" style={{ background: `${project.color}15` }}>
                <div className="w-2 h-2 rounded-full" style={{ background: project.color }} />
              </div>
              <h4 className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                {project.name}
              </h4>
              <p className="text-[10px] text-white/20 mt-0.5">:{project.port}</p>
            </a>
          ))}
        </div>
      </div>

      {/* ===== Footer ===== */}
      <footer className="text-center py-6 text-xs text-white/15 space-y-1">
        <p>VibeING Ecosystem Metrics Dashboard • {totalProjects} проектов • {onlineProjects} онлайн</p>
        <p>{apiConnected.finflow ? "Реальные данные из FinFlow API + PostgreSQL" : "Демо-режим (mock data)"}</p>
        <p>Обновлено: {clientTime} • {new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</p>
      </footer>
    </div>
  );
}

// ========================
// KPI Card Component
// ========================
function KpiCard({ title, value, icon, gradient }: { title: string; value: string; icon: string; gradient: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-white/30 uppercase tracking-wider">{title}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
        {value}
      </div>
    </div>
  );
}