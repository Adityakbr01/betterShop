import { Skeleton } from "@/components/ui/skeleton";

export default function SearchSkeleton() {
  return (
    <div className="p-2 space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-2">
          {/* Product Image Skeleton */}
          <Skeleton className="h-14 w-14 rounded-lg shrink-0" />
          
          {/* Product Info Skeleton */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32 md:w-40" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex gap-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
