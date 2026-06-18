import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleSkeleton } from "./CircleSkeleton";

export function TableRowSkeleton({ columns = 4, hasAvatar = false, className, ...props }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-6 py-4 border-b border-border/40",
        className
      )}
      {...props}
    >
      {hasAvatar && <CircleSkeleton size={36} />}
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
    <div className={cn("bg-card border border-border rounded-xl overflow-hidden", className)} {...props}>
      {/* Header skeleton */}
      <div className="flex items-center gap-4 px-6 py-3 bg-muted/30 border-b border-border">
        {[...Array(columns)].map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-3 rounded-lg",
              i === 0 ? "w-1/4" : i === columns - 1 ? "w-1/6" : "w-1/5"
            )}
          />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} hasAvatar={hasAvatar} />
      ))}
    </div>
  );
}
