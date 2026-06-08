import { cn } from "@/lib/utils";
import { CardSkeleton } from "./CardSkeleton";
import { LineSkeleton } from "./LineSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCardSkeleton({ className, ...props }) {
  return (
    <CardSkeleton className={cn("p-6 space-y-3", className)} {...props}>
      <LineSkeleton width="1/3" className="h-3" />
      <Skeleton className="h-8 w-24 rounded-lg" />
      <LineSkeleton width="1/2" className="h-2" />
    </CardSkeleton>
  );
}
