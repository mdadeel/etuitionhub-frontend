import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleSkeleton } from "./CircleSkeleton";

export function TableRowSkeleton({ columns = 4, hasAvatar = false, className, ...props }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 border-b border-border/50",
        className
      )}
      {...props}
    >
      {hasAvatar && <CircleSkeleton size={40} />}
      {[...Array(columns)].map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4 rounded-lg",
            i === 0 ? "w-1/4" : i === columns - 1 ? "w-1/6" : "w-1/5"
          )}
        />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4, hasAvatar = false, className, ...props }) {
  return (
    <div className={cn("border border-border/50 rounded-2xl overflow-hidden", className)} {...props}>
      {[...Array(rows)].map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} hasAvatar={hasAvatar} />
      ))}
    </div>
  );
}
