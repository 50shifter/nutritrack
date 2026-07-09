import { CardSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="skeleton h-6 w-32" />
      <div className="skeleton h-64 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
