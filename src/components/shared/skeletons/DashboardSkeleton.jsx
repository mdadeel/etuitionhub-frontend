import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { LineSkeleton } from "./LineSkeleton";
import { CardSkeleton } from "./CardSkeleton";

export function DashboardSkeleton({ className, ...props }) {
  return (
    <div className={cn("flex h-screen bg-background", className)} {...props}>
      {/* Sidebar skeleton */}
      <aside className="w-72 bg-card border-r border-border hidden lg:flex flex-col p-4 space-y-4">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <nav className="space-y-1 mt-8">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <header className="h-16 border-b border-border flex items-center px-6 gap-4">
          <Skeleton className="size-8 rounded-lg lg:hidden" />
          <Skeleton className="h-4 w-28 rounded-lg" />
          <div className="flex-1" />
          <Skeleton className="size-9 rounded-full" />
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="space-y-1.5 text-right">
              <Skeleton className="h-3 w-16 rounded-sm ml-auto" />
              <Skeleton className="h-2 w-12 rounded-sm ml-auto" />
            </div>
            <Skeleton className="size-9 rounded-none" />
          </div>
        </header>

        {/* Dashboard content skeleton */}
        <div className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <CardSkeleton key={i} className="p-6 space-y-3">
                  <Skeleton className="h-3 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-28 rounded-lg" />
                  <LineSkeleton width="1/3" className="h-2" />
                </CardSkeleton>
              ))}
            </div>
            <CardSkeleton className="p-6 space-y-4">
              <div className="flex gap-4 border-b border-border/50 pb-4">
                <Skeleton className="h-10 flex-1 rounded-lg" />
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="h-4 flex-1 rounded-lg" />
                  <Skeleton className="h-4 w-20 rounded-lg" />
                  <Skeleton className="h-4 w-16 rounded-lg" />
                  <Skeleton className="size-6 rounded-lg" />
                </div>
              ))}
            </CardSkeleton>
          </div>
        </div>
      </div>
    </div>
  );
}
