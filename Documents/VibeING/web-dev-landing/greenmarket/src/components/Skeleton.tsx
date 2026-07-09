export function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-[#1A241A]/50 border border-white/[0.03] overflow-hidden">
      <div className="aspect-square bg-white/[0.02] shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-white/[0.05] rounded w-3/4 shimmer" />
        <div className="h-2 bg-white/[0.03] rounded w-1/2 shimmer" />
        <div className="h-4 bg-white/[0.05] rounded w-1/3 shimmer" />
        <div className="h-8 bg-white/[0.03] rounded shimmer mt-2" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl bg-[#1A241A]/50 border border-white/[0.03] p-5">
      <div className="h-4 bg-white/[0.05] rounded w-1/3 mb-4 shimmer" />
      <div className="h-[250px] bg-white/[0.02] rounded-xl shimmer" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#1A241A]/50 border border-white/[0.03]">
          <div className="w-12 h-12 rounded-lg bg-white/[0.03] shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-white/[0.05] rounded w-2/3 shimmer" />
            <div className="h-2 bg-white/[0.03] rounded w-1/3 shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-7 bg-white/[0.05] rounded w-48 shimmer" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
