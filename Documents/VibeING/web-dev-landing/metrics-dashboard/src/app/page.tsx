"use client";

import EcosystemDashboard from "./_components/EcosystemDashboard";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#030305]">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/[0.05]">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002 2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002 2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold">VibeING Ecosystem Metrics</h1>
              <p className="text-[10px] text-white/30">Централизованный дашборд экосистемы • 6 проектов</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/30">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
              Экосистема
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        <EcosystemDashboard />
      </main>
    </div>
  );
}