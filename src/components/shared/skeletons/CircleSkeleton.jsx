import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function CircleSkeleton({ size = 10, className, ...props }) {
  return (
    <Skeleton
      className={cn("rounded-full shrink-0", className)}
      style={{ width: size, height: size }}
      {...props}
    />
  );
}
