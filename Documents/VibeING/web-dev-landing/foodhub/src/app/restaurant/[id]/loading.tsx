import { CardSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="skeleton h-56 md:h-80 w-full rounded-2xl" />
      <div className="skeleton h-4 w-32" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
