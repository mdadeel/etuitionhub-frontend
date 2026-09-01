import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton } from "./CardSkeleton";
import { LineSkeleton } from "./LineSkeleton";

export function TuitionCardSkeleton({ className, ...props }) {
  return (
    <CardSkeleton className={cn("flex flex-col h-full", className)} {...props}>
      <div className="p-6 flex-grow space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="size-4 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <div className="space-y-2">
          <LineSkeleton width="full" className="h-3" />
          <LineSkeleton width="5/6" className="h-3" />
        </div>
        <div className="pt-4 border-t border-border/50 space-y-3">
          <div className="flex justify-between">
            <LineSkeleton width="1/3" className="h-3" />
            <LineSkeleton width="1/4" className="h-3" />
          </div>
          <LineSkeleton width="2/5" className="h-3" />
        </div>
      </div>
      <div className="px-6 pb-6">
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </CardSkeleton>
  );
}

export function TuitionCardGridSkeleton({ count = 6, columns = 3, className, ...props }) {
  const gridCols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns] || "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={cn("grid grid-cols-1", gridCols, "gap-8", className)} {...props}>
      {[...Array(count)].map((_, i) => (
        <TuitionCardSkeleton key={i} />
      ))}
    </div>
  );
}
