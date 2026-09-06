import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "./card";
import { Badge } from "./badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const MetricCard = ({
  label,
  value,
  description,
  change,
  trend = "neutral",
  icon: Icon,
  className,
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
  const trendLabel =
    trend === "up"
      ? "Increased"
      : trend === "down"
        ? "Decreased"
        : "No change";

  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground">
              {label}
            </p>
            <p className="text-3xl font-heading font-bold text-foreground mt-1">
              {value}
            </p>
          </div>
          {Icon && (
            <div className="shrink-0 size-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="size-5 text-primary" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {(description || change != null) && (
          <div className="flex items-center gap-2 mt-1">
            {change != null && (
              <Badge
                variant={trendVariant}
                size="sm"
                className="gap-1"
                title={trendLabel}
              >
                <TrendIcon className="size-3.5" />
                {trend === "up" ? "+" : trend === "down" ? "-" : ""}
                {Math.abs(change)}%
              </Badge>
            )}
            {description && (
              <p className="text-xs text-muted-foreground truncate">
                {description}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
