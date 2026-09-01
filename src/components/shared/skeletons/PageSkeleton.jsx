import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { LineSkeleton } from "./LineSkeleton";

export function PageSkeleton({ className, ...props }) {
  return (
    <div className={cn("min-h-screen bg-background", className)} {...props}>
      {/* Navbar skeleton */}
      <div className="h-14 border-b border-border flex items-center px-4 sm:px-8 gap-4">
        <Skeleton className="h-8 w-28 rounded-lg" />
        <div className="hidden sm:flex gap-2 ml-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-lg" />
          ))}
        </div>
        <div className="flex-1" />
        <Skeleton className="size-8 rounded-full" />
      </div>

      {/* Hero / page content skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-20 space-y-8">
        <div className="space-y-4 max-w-2xl">
          <Skeleton className="h-12 w-3/4 rounded-lg" />
          <LineSkeleton width="full" className="h-5" />
          <LineSkeleton width="2/3" className="h-5" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 w-36 rounded-xl" />
          <Skeleton className="h-12 w-36 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3 border border-border/50 rounded-lg p-6">
              <Skeleton className="size-12 rounded-xl" />
              <Skeleton className="h-5 w-2/3 rounded-lg" />
              <LineSkeleton width="full" className="h-3" />
              <LineSkeleton width="5/6" className="h-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
