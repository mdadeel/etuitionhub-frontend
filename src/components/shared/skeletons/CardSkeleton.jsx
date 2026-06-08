import { cn } from "@/lib/utils";

export function CardSkeleton({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "bg-card border border-border/50 rounded-2xl overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
