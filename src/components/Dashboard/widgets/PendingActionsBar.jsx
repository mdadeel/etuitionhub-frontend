import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const PendingActionsBar = ({ counts = {}, className }) => {
  const items = [
    {
      key: "verifications",
      label: "Verifications",
      count: counts.verifications || 0,
      to: "/super-admin/verifications",
      variant: "warning",
    },
    {
      key: "withdrawals",
      label: "Withdrawals",
      count: counts.withdrawals || 0,
      to: "/super-admin/withdrawals",
      variant: "primary",
    },
    {
      key: "orgRequests",
      label: "Org Requests",
      count: counts.orgRequests || 0,
      to: "/super-admin/organizations",
      variant: "secondary",
    },
    {
      key: "disputes",
      label: "Disputes",
      count: counts.disputes || 0,
      to: "/super-admin/disputes",
      variant: "destructive",
    },
  ];

  const total = items.reduce((sum, i) => sum + i.count, 0);
  if (total === 0) return null;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-3 sm:p-4 flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 mr-1">
          <Badge variant="warning" size="sm">{total} pending</Badge>
          <span className="text-xs text-muted-foreground hidden sm:inline">action items</span>
        </div>
        <div className="flex flex-wrap gap-1.5 flex-1">
          {items
            .filter((i) => i.count > 0)
            .map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-background border border-border rounded-md hover:border-primary/40 transition-colors"
              >
                <Badge variant={item.variant} size="xs">
                  {item.count}
                </Badge>
                {item.label}
                <ArrowRight size={11} className="text-muted-foreground" />
              </Link>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingActionsBar;
