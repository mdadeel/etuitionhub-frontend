import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton } from "./CardSkeleton";
import { LineSkeleton } from "./LineSkeleton";

export function FormSkeleton({ fields = 4, className, ...props }) {
  return (
    <CardSkeleton className={cn("p-6 space-y-5", className)} {...props}>
      {[...Array(fields)].map((_, i) => (
        <div key={i} className="space-y-2">
          <LineSkeleton width="1/4" className="h-3" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
    </CardSkeleton>
  );
}
