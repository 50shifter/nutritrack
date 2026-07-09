interface Props {
  className?: string;
}

export function CardSkeleton({ className }: Props) {
  return (
    <div className={`food-card p-4 ${className || ""}`}>
      <div className="skeleton h-32 w-full mb-3" />
      <div className="skeleton h-4 w-3/4 mb-2" />
      <div className="skeleton h-3 w-1/2" />
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="food-card p-4 flex items-center gap-3">
          <div className="skeleton w-14 h-14 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="skeleton h-64 w-full rounded-2xl" />
  );
}
