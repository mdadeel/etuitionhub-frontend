import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton } from "./CardSkeleton";
import { CircleSkeleton } from "./CircleSkeleton";
import { LineSkeleton } from "./LineSkeleton";

export function TutorCardSkeleton({ className, ...props }) {
  return (
    <CardSkeleton className={cn("p-5 space-y-4", className)} {...props}>
      <div className="flex items-center gap-3">
        <CircleSkeleton size={48} />
        <div className="space-y-2 flex-1">
          <LineSkeleton width="2/3" className="h-4" />
          <LineSkeleton width="1/2" className="h-3" />
        </div>
      </div>
      <div className="space-y-2">
        <LineSkeleton width="full" className="h-3" />
        <LineSkeleton width="4/5" className="h-3" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
    </CardSkeleton>
  );
}

export function TutorCardGridSkeleton({ count = 4, columns = 4, className, ...props }) {
  const gridCols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns] || "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={cn("grid grid-cols-1", gridCols, "gap-6", className)} {...props}>
      {[...Array(count)].map((_, i) => (
        <TutorCardSkeleton key={i} />
      ))}
    </div>
  );
}
