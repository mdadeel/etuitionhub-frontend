import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare, Users, Wallet, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const formatTime = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
};

const TodayWidget = ({
  nextSession,
  pendingRequests = 0,
  unreadMessages = 0,
  availableEarnings = 0,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/20">
          <h3 className="text-sm font-semibold text-foreground">Today</h3>
          <Link to="/dashboard/sessions">
            <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
              View all
              <ArrowRight size={12} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
          <div className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
              <Clock size={13} />
              <p className="text-[11px] font-semibold uppercase tracking-wider">Next Session</p>
            </div>
            <p className="text-sm font-semibold text-foreground truncate">
              {nextSession?.subject || "No upcoming session"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {nextSession ? formatTime(nextSession.startsAt) : "—"}
            </p>
          </div>

          <Link
            to="/dashboard/hire-requests"
            className="p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
              <Users size={13} />
              <p className="text-[11px] font-semibold uppercase tracking-wider">Requests</p>
              {pendingRequests > 0 && (
                <Badge variant="warning" size="xs" className="ml-auto">
                  {pendingRequests}
                </Badge>
              )}
            </div>
            <p className="text-sm font-semibold text-foreground">
              {pendingRequests} pending
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Hire requests</p>
          </Link>

          <Link
            to="/dashboard/connections"
            className="p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
              <MessageSquare size={13} />
              <p className="text-[11px] font-semibold uppercase tracking-wider">Messages</p>
              {unreadMessages > 0 && (
                <Badge variant="destructive" size="xs" className="ml-auto">
                  {unreadMessages}
                </Badge>
              )}
            </div>
            <p className="text-sm font-semibold text-foreground">
              {unreadMessages} unread
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">From students &amp; tutors</p>
          </Link>

          <Link
            to="/dashboard/wallet"
            className="p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
              <Wallet size={13} />
              <p className="text-[11px] font-semibold uppercase tracking-wider">Earnings</p>
            </div>
            <p className="text-sm font-semibold text-foreground">
              ৳{Number(availableEarnings).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Available to withdraw</p>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayWidget;
