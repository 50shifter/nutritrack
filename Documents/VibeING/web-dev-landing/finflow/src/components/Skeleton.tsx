/* Card skeleton */
export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="w-8 h-8 rounded-lg bg-white/5 shimmer" />
        <div className="w-12 h-4 rounded bg-white/5 shimmer" />
      </div>
      <div className="w-20 h-3 mb-2 bg-white/5 shimmer rounded" />
      <div className="w-28 h-7 bg-white/5 shimmer rounded" />
    </div>
  );
}

/* Chart skeleton */
export function ChartSkeleton() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="w-32 h-4 mb-4 bg-white/5 shimmer rounded" />
      <div className="w-full h-[250px] rounded-xl bg-white/5 shimmer" />
    </div>
  );
}

/* Table skeleton */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/5 shimmer" />
            <div className="space-y-2">
              <div className="w-32 h-3 bg-white/5 shimmer rounded" />
              <div className="w-16 h-2 bg-white/5 shimmer rounded" />
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="w-20 h-3 bg-white/5 shimmer rounded ml-auto" />
            <div className="w-12 h-2 bg-white/5 shimmer rounded ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* Full page skeleton */
export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="w-48 h-7 bg-white/5 shimmer rounded" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <TableSkeleton />
    </div>
  );
}

/* Stat skeleton for mini-cards */
export function StatSkeleton() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 shimmer" />
        <div className="w-10 h-4 bg-white/5 shimmer rounded" />
      </div>
      <div className="w-16 h-2.5 bg-white/5 shimmer rounded mb-2" />
      <div className="w-24 h-6 bg-white/5 shimmer rounded" />
    </div>
  );
}
