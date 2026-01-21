// components/ui/card-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Image */}
      <Skeleton className="aspect-video rounded-xl" />

      {/* Title */}
      <Skeleton className="h-5 w-3/4" />

      {/* Description */}
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}
