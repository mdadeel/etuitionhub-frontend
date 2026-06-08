import { cn } from "@/lib/utils";

function Skeleton({ className, variant = "pulse", ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-2xl bg-muted",
        variant === "pulse" && "animate-pulse",
        variant === "shimmer" &&
          "bg-[length:200%_100%] bg-gradient-to-r from-muted via-border/50 to-muted animate-[shimmer_1.6s_infinite_linear]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
