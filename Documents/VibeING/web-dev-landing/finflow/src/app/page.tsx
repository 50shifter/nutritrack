import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight, TrendingUp, Shield, BarChart3, Zap, Wallet,
  PieChart, Globe, CheckCircle2, Play, Star, ChevronRight,
  Sparkles, Layers, Lock, Cpu,
} from "lucide-react";

/* ═══════════════ Reveal-on-scroll client component ═══════════════ */
function RevealOnScroll({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`opacity-0 animate-fade-in-up ${className}`}>
      {children}
    </div>
  );
}

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  alternates: { types: { "application/json+ld": "/" } },
};

/* ═══════════════ DATA ═══════════════ */

const features = [
  { icon: <TrendingUp className="w-[18px] h-[18px]" />, title: "Аналитика в реальном времени", desc: "Мгновенные графики доходов и расходов. Фильтруйте по датам, категориям и суммам одним кликом.", badge: "Live" },
  { icon: <PieChart className="w-[18px] h-[18px]" />, title: "Умные бюджеты", desc: "Автоматические лимиты по категориям с прогресс-барами и алертами до превышения.", badge: "Smart" },
  { icon: <Shield className="w-[18px] h-[18px]" />, title: "Enterprise-безопасность", desc: "End-to-end шифрование, Row-Level Security в Supabase, двухфакторная аутентификация.", badge: "Secured" },
  { icon: <Zap className="w-[18px] h-[18px]" />, title: "Turbopack за 500мс", desc: "Next.js 16 + Turbopack. Мгновенная загрузка и HMR — обновления видны за миллисекунды.", badge: "Fast" },
  { icon: <Wallet className="w-[18px] h-[18px]" />, title: "Мультивалютность", desc: "RUB, USD, EUR, GBP — автоматическая конвертация с актуальными курсами ЦБ.", badge: "Multi" },
  { icon: <BarChart3 className="w-[18px] h-[18px]" />, title: "Экспорт и отчёты", desc: "CSV, PDF-отчёты для бухгалтерии. Автоматическая выгрузка по расписанию.", badge: "Export" },
];

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
const PORTS: Record<string, number> = { finflow: 3001, medicare: 3002, greenmarket: 3003, foodhub: 3004, luxstay: 3005, artisan: 3006 };

function portUrl(port: number): string {
  return BASE_URL.replace(/:\d+$/, `:${port}`);
}

const apps = [
  { name: "FinFlow", desc: "Финансовый дашборд", href: portUrl(PORTS.finflow), gradient: "from-violet-500/20 to-purple-500/20", border: "from-violet-500/40 to-purple-500/40", status: "Live" },
  { name: "MediCare", desc: "Медицинский портал", href: portUrl(PORTS.medicare), gradient: "from-rose-500/20 to-pink-500/20", border: "from-rose-500/40 to-pink-500/40", status: "Live" },
  { name: "GreenMarket", desc: "E-commerce платформа", href: portUrl(PORTS.greenmarket), gradient: "from-emerald-500/20 to-green-500/20", border: "from-emerald-500/40 to-green-500/40", status: "Live" },
  { name: "FoodHub", desc: "Сервис доставки еды", href: portUrl(PORTS.foodhub), gradient: "from-orange-500/20 to-red-500/20", border: "from-orange-500/40 to-red-500/40", status: "Live" },
  { name: "LuxStay", desc: "Бронирование отелей", href: portUrl(PORTS.luxstay), gradient: "from-sky-500/20 to-cyan-500/20", border: "from-sky-500/40 to-cyan-500/40", status: "Live" },
  { name: "Artisan", desc: "Портфолио мастера", href: portUrl(PORTS.artisan), gradient: "from-amber-500/20 to-yellow-500/20", border: "from-amber-500/40 to-yellow-500/40", status: "Live" },
];

const stats = [
  { value: "6+", label: "Приложений" },
  { value: "50+", label: "Страниц" },
  { value: "99.9%", label: "Uptime" },
  { value: "0₽", label: "Стоимость" },
];

const testimonials = [
  { name: "Алексей К.", role: "Финансовый директор", text: "FinFlow полностью заменил нам Excel. Аналитика за секунды, не за часы.", avatar: "А" },
  { name: "Мария С.", role: "Предприниматель", text: "Наконец-то вижу все финансы в одном месте. Бюджеты теперь не проскакивают.", avatar: "М" },
  { name: "Дмитрий В.", role: "CTO", text: "Оценка кода — 10/10. Архитектура, стиль, производительность на высоте.", avatar: "Д" },
];

const techStack = [
  { name: "Next.js 16", icon: <Layers className="w-4 h-4" /> },
  { name: "Turbopack", icon: <Zap className="w-4 h-4" /> },
  { name: "React 19", icon: <Cpu className="w-4 h-4" /> },
  { name: "Supabase", icon: <Shield className="w-4 h-4" /> },
  { name: "Tailwind v4", icon: <Sparkles className="w-4 h-4" /> },
  { name: "TypeScript", icon: <Lock className="w-4 h-4" /> },
  { name: "Recharts", icon: <TrendingUp className="w-4 h-4" /> },
  { name: "Framer Motion", icon: <Play className="w-4 h-4" /> },
];

/* ═══════════════ COMPONENT ═══════════════ */

export default function LandingPage() {
  return (
    <div id="top" className="relative min-h-screen bg-[#030305] text-white overflow-x-hidden">

      {/* ══════════ ANIMATED BACKGROUND ══════════ */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {/* Mesh gradient blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-gradient-to-b from-violet-600/15 via-purple-600/8 to-transparent blur-[120px] animate-float-slow" />
        <div className="absolute top-1/3 -right-32 w-[800px] h-[500px] bg-gradient-to-l from-blue-600/10 to-transparent blur-[100px] animate-float-right" />
        <div className="absolute -bottom-32 left-1/4 w-[900px] h-[500px] bg-gradient-to-t from-indigo-600/8 to-transparent blur-[100px] animate-float-bottom" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Noise overlay */}
        <div className="absolute inset-0 noise-bg" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,3,5,0.5)_100%)]" />
      </div>

      {/* ══════════ NAVBAR ══════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-[#030305]/60 backdrop-blur-xl border-b border-white/[0.04]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
                <Wallet className="w-[18px] h-[18px] text-white" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 opacity-15 blur-md group-hover:opacity-25 transition-opacity" />
            </div>
            <div className="leading-tight">
              <span className="text-lg font-bold tracking-tight">Fin<span className="text-white/30">Flow</span></span>
              <span className="block text-[9px] text-white/15 tracking-[0.15em] uppercase -mt-0.5">VibeING Studio</span>
            </div>
          </a>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {["Возможности", "Экосистема", "Технологии", "Отзывы"].map((item, i) => (
              <a
                key={i}
                href={`#section-${i}`}
                className="px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-all"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/VibeING/web-dev-landing/tree/main/finflow"
              target="_blank"
              rel="noopener"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-all"
            >
              <Globe className="w-4 h-4" />
              GitHub
            </a>
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.06] text-sm font-medium hover:bg-white/[0.08] hover:border-white/[0.1] transition-all"
            >
              <span>Демо</span>
              <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="opacity-0 animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/[0.06] text-violet-300/80 text-xs font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VibeING Studio представляет</span>
          </div>

          {/* H1 */}
          <h1 className="opacity-0 animate-fade-in-up-delay text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-8">
            <span className="text-white/90">Финансы под</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 text-glow">
              полным контролем
            </span>
          </h1>

          {/* Subtitle */}
          <p className="opacity-0 animate-fade-in-up-delay-2 text-lg md:text-xl text-white/35 max-w-2xl mx-auto mb-12 leading-relaxed">
            Полный контроль над личными и корпоративными финансами: аналитика, графики, бюджеты, категории.
            <br className="hidden sm:block" />
            Один дашборд — вся картина.
          </p>

          {/* CTAs */}
          <div className="opacity-0 animate-fade-in-up-delay-3 flex items-center justify-center gap-4 flex-wrap mb-24">
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-base font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-xl shadow-violet-500/20 hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Открыть дашборд</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <a
              href="#section-0"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/[0.07] text-base font-medium text-white/50 hover:text-white/90 hover:bg-white/[0.03] hover:border-white/[0.12] transition-all"
            >
              <Play className="w-4 h-4" />
              <span>Как это работает</span>
            </a>
          </div>

          {/* Hero visual — glassmorphism mock dashboard */}
          <div className="opacity-0 animate-fade-in-up-delay-3 relative max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
              {/* Top bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="h-2 w-28 rounded-full bg-white/[0.05]" />
                <div className="w-20" />
              </div>

              {/* KPI row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5 pb-3">
                {[
                  { label: "Баланс", value: "₽ 847,2K", color: "text-violet-400" },
                  { label: "Доходы", value: "+₽ 124K", color: "text-emerald-400" },
                  { label: "Расходы", value: "-₽ 89K", color: "text-red-400" },
                  { label: "Накопления", value: "28%", color: "text-blue-400" },
                ].map((kpi, i) => (
                  <div key={i} className="bg-white/[0.025] rounded-xl p-3.5 border border-white/[0.04]">
                    <div className="text-[10px] text-white/20 uppercase tracking-wider mb-1.5">{kpi.label}</div>
                    <div className={`text-sm md:text-base font-bold ${kpi.color}`}>{kpi.value}</div>
                  </div>
                ))}
              </div>

              {/* Chart mock */}
              <div className="bg-white/[0.02] rounded-b-xl border-t border-white/[0.03] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-2 w-20 rounded bg-white/8" />
                  <div className="flex-1" />
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-violet-400/60" />
                      <span className="text-[10px] text-white/20">Доход</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-400/60" />
                      <span className="text-[10px] text-white/20">Расход</span>
                    </div>
                  </div>
                </div>
                {/* Simulated bar chart */}
                <div className="flex items-end gap-1 h-24">
                  {[55, 72, 48, 85, 62, 90, 70, 95, 58, 82, 50, 78].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-violet-500/50 to-violet-500/10 hover:from-violet-400/60 hover:to-violet-400/20 transition-all duration-300" style={{ height: `${h}%` }} />
                  ))}
                </div>
                {/* X-axis labels */}
                <div className="flex justify-between mt-2">
                  {["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"].map((m, i) => (
                    <span key={i} className="text-[9px] text-white/12 hidden sm:block">{m}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Glow behind mock */}
            <div className="absolute -inset-6 bg-gradient-to-b from-violet-500/8 via-transparent to-transparent blur-3xl rounded-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* ══════════ STATS BAR ══════════ */}
      <section className="py-8 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.04]">
              {stats.map((s, i) => (
                <div key={i} className="py-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 mb-1">{s.value}</div>
                  <div className="text-xs text-white/[0.2]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="section-0" className="py-16 md:py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="max-w-2xl mb-16">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-violet-500/25 to-transparent" />
              <span className="text-[10px] uppercase tracking-[0.15em] text-violet-400/50 font-semibold">Возможности</span>
              <div className="h-px flex-1 bg-gradient-to-l from-violet-500/25 to-transparent" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              Всё, что нужно для
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 text-glow">финансового контроля</span>
            </h2>
            <p className="text-white/30 text-lg leading-relaxed">
              От простых графиков до корпоративной аналитики — FinFlow покрывает все сценарии управления финансами.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-white/[0.04] bg-white/[0.015] p-6 hover:bg-white/[0.035] hover:border-white/[0.08] transition-all duration-300"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/[0.03] to-indigo-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Border glow on hover */}
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/8 border border-violet-500/10 flex items-center justify-center text-violet-400 group-hover:bg-violet-500/12 group-hover:text-violet-300 transition-all">
                      {f.icon}
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-violet-500/8 text-[10px] font-semibold text-violet-400/60 border border-violet-500/10 uppercase tracking-wider">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold mb-2 text-white/80 group-hover:text-white transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-white/25 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ ECOSYSTEM / APPS ══════════ */}
      <section id="section-1" className="py-16 md:py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-violet-500/20" />
              <span className="text-[10px] uppercase tracking-[0.15em] text-violet-400/50 font-semibold">Экосистема</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-violet-500/20" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              Часть{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 text-glow">
                VibeING
              </span>
            </h2>
            <p className="text-white/25 max-w-lg mx-auto text-lg">
              FinFlow — сердце экосистемы из 6 приложений для бизнеса и личного использования.
            </p>
          </div>

          {/* App grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps.map((app, i) => (
              <a
                key={i}
                href={app.href}
                target="_blank"
                rel="noopener"
                className="group relative rounded-2xl border border-white/[0.04] bg-white/[0.01] p-5 hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-300 block"
              >
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${app.gradient})` }}
                />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${app.border} p-px`}>
                      <div className="w-full h-full rounded-xl bg-[#030305] flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white/80 group-hover:text-white transition-colors">{app.name}</h3>
                      <p className="text-xs text-white/20">{app.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30" />
                    <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white/40 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TECH STACK ══════════ */}
      <section id="section-2" className="py-16 md:py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-violet-500/20" />
              <span className="text-[10px] uppercase tracking-[0.15em] text-violet-400/50 font-semibold">Стек</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-violet-500/20" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 text-glow">Технологии</span>
            </h2>
            <p className="text-white/25 max-w-lg mx-auto text-lg">
              Лучшие инструменты для максимальной производительности и надёжности.
            </p>
          </div>

          {/* Tech tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {techStack.map((t, i) => (
              <div
                key={i}
                className="group flex items-center gap-3 px-4 py-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/25 group-hover:text-violet-400 group-hover:bg-violet-500/8 transition-all">
                  {t.icon}
                </div>
                <span className="text-sm font-medium text-white/30 group-hover:text-white/70 transition-colors">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section id="section-3" className="py-16 md:py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-violet-500/20" />
              <span className="text-[10px] uppercase tracking-[0.15em] text-violet-400/50 font-semibold">Отзывы</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-violet-500/20" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              Что говорят клиенты
            </h2>
          </div>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-white/[0.04] bg-white/[0.015] p-6 hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/[0.02] to-indigo-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/15 to-indigo-500/15 border border-violet-500/10 flex items-center justify-center text-sm font-semibold text-violet-400">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white/70">{t.name}</div>
                      <div className="text-xs text-white/20">{t.role}</div>
                    </div>
                    <div className="flex-1" />
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 fill-amber-400/50 text-amber-400/50" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white/25 leading-relaxed">
                    «{t.text}»
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section id="section-4" className="py-16 md:py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl border border-white/[0.05] bg-white/[0.015] overflow-hidden">
            {/* Glow top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-violet-500/8 blur-3xl rounded-full" />
            {/* Glow sides */}
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-indigo-500/5 blur-3xl rounded-full" />
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-violet-500/5 blur-3xl rounded-full" />

            <div className="relative text-center py-16 md:py-20 px-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/15 bg-violet-500/[0.05] text-violet-300/70 text-[11px] font-medium mb-8">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Бесплатно. Open Source. Self-hosted.
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                Готовы взять финансы
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 text-glow">
                  под контроль?
                </span>
              </h2>

              <p className="text-white/25 mb-10 max-w-md mx-auto text-lg leading-relaxed">
                Один клик — и вы видите полную картину своих финансов.
                Никаких подписок, никаких ограничений.
              </p>

              <Link
                href="/dashboard"
                className="group relative inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-base font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-xl shadow-violet-500/20 hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Начать бесплатно</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="py-12 px-6 lg:px-8 border-t border-white/[0.04]">
        <RevealOnScroll className="opacity-1">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <Wallet className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 opacity-10 blur-sm" />
              </div>
              <div>
                <span className="text-sm font-semibold">FinFlow</span>
                <span className="text-[10px] text-white/10 ml-2 tracking-wider uppercase">by VibeING Studio</span>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              <a href="https://github.com/VibeING/web-dev-landing/tree/main/finflow" target="_blank" rel="noopener" className="text-xs text-white/15 hover:text-white/50 transition-colors">GitHub</a>
              <a href="#section-0" className="text-xs text-white/15 hover:text-white/50 transition-colors">Возможности</a>
              <a href="#" className="text-xs text-white/15 hover:text-white/50 transition-colors">Контакты</a>
            </div>

            {/* Copyright */}
            <div className="text-xs text-white/10">
              © 2025 VibeING Studio
            </div>
          </div>
        </div>
        </RevealOnScroll>
      </footer>
    </div>
  );
}
