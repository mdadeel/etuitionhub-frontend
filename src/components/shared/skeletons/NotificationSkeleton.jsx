import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleSkeleton } from "./CircleSkeleton";
import { LineSkeleton } from "./LineSkeleton";

export function NotificationSkeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 border-b border-border/50",
        className
      )}
      {...props}
    >
      <Skeleton className="size-5 rounded shrink-0 mt-0.5" />
      <CircleSkeleton size={40} />
      <div className="flex-1 space-y-2">
        <LineSkeleton width="3/4" className="h-4" />
        <LineSkeleton width="full" className="h-3" />
        <LineSkeleton width="1/3" className="h-2" />
      </div>
    </div>
  );
}

export function NotificationListSkeleton({ count = 5, className, ...props }) {
  return (
    <div className={cn("divide-y divide-border/50", className)} {...props}>
      {[...Array(count)].map((_, i) => (
        <NotificationSkeleton key={i} />
      ))}
    </div>
  );
}
