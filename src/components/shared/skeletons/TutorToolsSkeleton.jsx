import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton } from "./CardSkeleton";
import { LineSkeleton } from "./LineSkeleton";

export function LessonPlanSkeleton({ className, ...props }) {
  return (
    <CardSkeleton className={cn("p-5 space-y-5", className)} {...props}>
      {/* Header */}
      <div className="pb-3 border-b border-border/40 space-y-2">
        <Skeleton className="h-3 w-20 rounded-lg" />
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <Skeleton className="h-3 w-24 rounded-lg" />
      </div>

      {/* Section: Learning Objectives */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="h-3 w-32 rounded-lg" />
        </div>
        <div className="space-y-2 pl-8">
          <Skeleton className="h-3 w-full rounded-lg" />
          <Skeleton className="h-3 w-5/6 rounded-lg" />
          <Skeleton className="h-3 w-4/5 rounded-lg" />
        </div>
      </div>

      {/* Section: Class Outline */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="h-3 w-28 rounded-lg" />
        </div>
        <div className="space-y-2 pl-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5">
              <Skeleton className="size-5 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-4 w-1/2 rounded-lg" />
                  <Skeleton className="h-3 w-12 rounded-lg" />
                </div>
                <Skeleton className="h-3 w-3/4 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Activities */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="h-3 w-36 rounded-lg" />
        </div>
        <div className="space-y-2 pl-8">
          <Skeleton className="h-3 w-full rounded-lg" />
          <Skeleton className="h-3 w-4/5 rounded-lg" />
        </div>
      </div>

      {/* Section: Homework */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="h-3 w-24 rounded-lg" />
        </div>
        <Skeleton className="h-16 w-full rounded-lg ml-8" />
      </div>
    </CardSkeleton>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function AssignmentSkeleton({ className, ...props }) {
  return (
    <CardSkeleton className={cn("p-5 space-y-5", className)} {...props}>
      {/* Header */}
      <div className="pb-3 border-b border-border/40 space-y-2">
        <Skeleton className="h-3 w-24 rounded-lg" />
        <Skeleton className="h-6 w-2/3 rounded-lg" />
        <Skeleton className="h-3 w-32 rounded-lg" />
      </div>

      {/* Questions */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2 rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-5 rounded-full shrink-0" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
          </div>
          <div className="space-y-1.5 pl-7">
            <Skeleton className="h-3 w-full rounded-lg" />
            <Skeleton className="h-3 w-3/4 rounded-lg" />
            <Skeleton className="h-3 w-5/6 rounded-lg" />
          </div>
        </div>
      ))}
    </CardSkeleton>
  );
}
