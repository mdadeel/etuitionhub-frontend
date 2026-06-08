import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function LineSkeleton({ className, width = "full", ...props }) {
  const widthClass = {
    full: "w-full",
    "3/4": "w-3/4",
    "2/3": "w-2/3",
    "1/2": "w-1/2",
    "1/3": "w-1/3",
    "1/4": "w-1/4",
  }[width] || width;

  return (
    <Skeleton
      className={cn("h-3 rounded-lg", widthClass, className)}
      {...props}
    />
  );
}
