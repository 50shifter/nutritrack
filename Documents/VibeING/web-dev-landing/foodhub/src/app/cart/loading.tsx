import { ListSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <div className="skeleton h-6 w-32" />
      <ListSkeleton />
    </div>
  );
}
