import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const StatWidget = ({
  label,
  value,
  change,
  trend = "neutral",
  icon: Icon,
  className,
  compact = false,
  ...props
}) => {
  const TrendIcon =
    trend === "up"
      ? TrendingUp
      : trend === "down"
        ? TrendingDown
        : Minus;
  const trendVariant =
    trend === "up"
      ? "success"
      : trend === "down"
        ? "error"
        : "secondary";
  const trendColor =
    trend === "up"
      ? "text-success"
      : trend === "down"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <Card
      className={cn(
        compact ? "p-4" : "p-5",
        "hover:border-primary/20 transition-colors duration-200",
        className
      )}
      {...props}
    >
      <CardContent className={cn(compact ? "p-0" : "p-0")}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground truncate">{label}</p>
            <p
              className={cn(
                "font-heading font-semibold text-foreground mt-1",
                compact ? "text-xl" : "text-2xl"
              )}
            >
              {value}
            </p>
            {change != null && (
              <div className="flex items-center gap-1 mt-1.5">
                <Badge variant={trendVariant} size="xs" className="gap-0.5">
                  <TrendIcon className="size-3" />
                  {Math.abs(change)}%
                </Badge>
              </div>
            )}
          </div>
          {Icon && (
            <div className="shrink-0 size-10 rounded-lg bg-muted flex items-center justify-center border border-border">
              <Icon className="size-5 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatWidget;
