import { usePlatformOverview } from "../../../hooks/queries/usePlatformOverview";
import {
  Banknote,
  TrendingUp,
  Users,
  UserCheck,
  BookOpen,
  FileText,
  CheckCircle2,
  CreditCard,
  Search,
  Shield,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  RefreshCw,
  Hash,
  Activity,
} from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { StatCardSkeleton } from "../../shared/skeletons/StatCardSkeleton";
import { LineSkeleton } from "../../shared/skeletons/LineSkeleton";
import { CardSkeleton } from "../../shared/skeletons/CardSkeleton";
import { Skeleton } from "../../ui/skeleton";
import EmptyState from "../../shared/EmptyState";
import { cn } from "../../../lib/utils";

const PlatformOverview = () => {
  const { data, isLoading, isError, error, refetch } = usePlatformOverview();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <header className="border-b border-border pb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-1 bg-primary rounded-full" />
            <span className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
              Super Admin
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-heading font-bold uppercase tracking-tight text-foreground">
            Platform Overview
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Aggregate snapshot of money, growth, funnel, queues, and activity.
          </p>
        </header>

        {/* Money + Growth skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Funnel skeleton */}
        <CardSkeleton className="p-5 space-y-4">
          <LineSkeleton width="1/4" className="h-4" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-16 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-2 w-12 rounded-lg" />
              </div>
            ))}
          </div>
        </CardSkeleton>

        {/* Queues skeleton */}
        <CardSkeleton className="p-5 space-y-4">
          <LineSkeleton width="1/4" className="h-4" />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-20 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        </CardSkeleton>

        {/* Activity skeleton */}
        <CardSkeleton className="p-5 space-y-4">
          <LineSkeleton width="1/4" className="h-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-3/4 rounded-lg" />
                    <Skeleton className="h-2 w-1/2 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-3/4 rounded-lg" />
                    <Skeleton className="h-2 w-1/2 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardSkeleton>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-8">
        <header className="border-b border-border pb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-1 bg-primary rounded-full" />
            <span className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
              Super Admin
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-heading font-bold uppercase tracking-tight text-foreground">
            Platform Overview
          </h2>
        </header>

        <Card className="p-8 md:p-12">
          <div className="text-center max-w-sm mx-auto space-y-4">
            <div className="size-12 mx-auto rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="size-6 text-destructive" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-heading font-bold uppercase tracking-wider text-foreground">
                Failed to load platform data
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">
                {error?.response?.data?.message || error?.message || "Could not reach the analytics server. Please try again."}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="size-3.5" strokeWidth={2} />
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-8">
        <header className="border-b border-border pb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-1 bg-primary rounded-full" />
            <span className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
              Super Admin
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-heading font-bold uppercase tracking-tight text-foreground">
            Platform Overview
          </h2>
        </header>
        <EmptyState
          icon={Activity}
          title="No data available"
          description="Platform analytics are not available at this time."
        />
      </div>
    );
  }

  const { money, growth, funnel, queues, activity } = data;

  return (
    <div className="space-y-8">
      <header className="border-b border-border pb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-1 bg-primary rounded-full" />
          <span className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground">
            Super Admin
          </span>
        </div>
        <h2 className="text-lg md:text-xl font-heading font-bold uppercase tracking-tight text-foreground">
          Platform Overview
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Aggregate snapshot of money, growth, funnel, queues, and activity.
        </p>
      </header>

      {/* Money Section */}
      <Section
        label="Money"
        description="Commission revenue and pending tutor payouts"
        icon={Banknote}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            title="Commission Revenue"
            value={`৳${money.commissionRevenue.toLocaleString()}`}
            subtitle="Total platform commission earned"
            icon={TrendingUp}
            accent="border-l-primary"
          />
          <StatCard
            title="Pending Payouts"
            value={`৳${money.pendingPayouts.toLocaleString()}`}
            subtitle="Amount awaiting tutor withdrawal"
            icon={Clock}
            accent="border-l-warning"
          />
        </div>
      </Section>

      {/* Growth Section */}
      <Section
        label="Growth"
        description="User and content growth metrics"
        icon={TrendingUp}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Total Users" value={growth.totalUsers} subtitle="Registered accounts" icon={Users} />
          <StatCard title="Tutors" value={growth.totalTutors} subtitle="Verified tutors" icon={UserCheck} />
          <StatCard title="Students" value={growth.totalStudents} subtitle="Active students" icon={Users} />
          <StatCard title="Tuitions" value={growth.totalTuitions} subtitle="Active listings" icon={BookOpen} />
          <StatCard title="Applications" value={growth.totalApplications} subtitle="Tutor applications" icon={FileText} />
        </div>
      </Section>

      {/* Funnel Section */}
      <Section
        label="Funnel"
        description="Booking pipeline: tuitions → applications → confirmed → paid"
        icon={Hash}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <FunnelStep
            label="Tuitions"
            value={funnel.tuitions}
            subtitle="Listings posted"
            icon={BookOpen}
            step={1}
          />
          <FunnelStep
            label="Applications"
            value={funnel.applications}
            subtitle="Tutors applied"
            icon={FileText}
            step={2}
          />
          <FunnelStep
            label="Confirmed"
            value={funnel.confirmed}
            subtitle="Sessions booked"
            icon={CheckCircle2}
            step={3}
          />
          <FunnelStep
            label="Paid"
            value={funnel.paid}
            subtitle="Payments settled"
            icon={CreditCard}
            step={4}
            isLast
          />
        </div>
      </Section>

      {/* Queues Section */}
      <Section
        label="Queues"
        description="Pending items requiring admin action"
        icon={Shield}
      >
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <QueueCard
            label="Payment Verification"
            count={queues.paymentVerification}
            icon={CreditCard}
            variant={queues.paymentVerification > 0 ? "warning" : "default"}
          />
          <QueueCard
            label="Tutor Verification"
            count={queues.tutorVerification}
            icon={UserCheck}
            variant={queues.tutorVerification > 0 ? "warning" : "default"}
          />
          <QueueCard
            label="Moderation"
            count={queues.moderation}
            icon={Search}
            variant={queues.moderation > 0 ? "warning" : "default"}
          />
          <QueueCard
            label="Disputes"
            count={queues.disputes}
            icon={AlertTriangle}
            variant={queues.disputes > 0 ? "destructive" : "default"}
          />
          <QueueCard
            label="Withdrawals"
            count={queues.withdrawals}
            icon={ArrowUpRight}
            variant={queues.withdrawals > 0 ? "warning" : "default"}
          />
        </div>
      </Section>

      {/* Activity Section */}
      <Section
        label="Activity"
        description="Recent signups and audit log entries"
        icon={Activity}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Signups */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Recent Signups
            </h3>
            {activity.recentSignups.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No recent signups"
                description="New users will appear here."
              />
            ) : (
              <ul className="space-y-3">
                {activity.recentSignups.map((user) => (
                  <li key={user._id} className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="size-3.5 text-primary" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {user.displayName || user.email}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {user.role} &middot; {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Audit Logs */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Recent Audit Logs
            </h3>
            {activity.recentAuditLogs.length === 0 ? (
              <EmptyState
                icon={Activity}
                title="No audit logs"
                description="Recent admin actions will appear here."
              />
            ) : (
              <ul className="space-y-3">
                {activity.recentAuditLogs.map((log) => (
                  <li key={log._id} className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                      <Shield className="size-3.5 text-muted-foreground" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground capitalize truncate">
                        {log.action.replace(/_/g, " ")}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {log.userEmail || log.userId} &middot;{" "}
                        {log.entityType} &middot;{" "}
                        {new Date(log.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};

/* ─── Sub-components ─── */

const Section = ({ label, description, icon, children }) => {
  const Icon = icon;
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="size-3 text-primary" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-foreground">
            {label}
          </h3>
          {description && (
            <p className="text-[10px] text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
};

const StatCard = ({ title, value, subtitle, icon, accent = "border-l-card" }) => {
  const Icon = icon;
  return (
    <div
      className={cn(
        "p-4 md:p-5 bg-card border border-border rounded-xl border-l-[3px] relative overflow-hidden",
        accent
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="size-8 flex items-center justify-center rounded-lg bg-background text-muted-foreground border border-border">
          <Icon size={14} strokeWidth={2.5} />
        </div>
      </div>
      <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        {title}
      </p>
      <p className="text-xl md:text-2xl font-heading font-black tracking-tight text-foreground tabular-nums">
        {value}
      </p>
      {subtitle && (
        <p className="text-[10px] text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
};

const FunnelStep = ({ label, value, subtitle, icon, step, isLast = false }) => {
  const Icon = icon;
  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-5 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="size-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
          <Icon size={14} strokeWidth={2.5} />
        </div>
        <span className="text-[10px] font-mono font-bold text-muted-foreground/40">
          {String(step).padStart(2, "0")}
        </span>
      </div>
      <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </p>
      <p className="text-lg md:text-xl font-heading font-black tracking-tight text-foreground tabular-nums">
        {value}
      </p>
      {subtitle && (
        <p className="text-[10px] text-muted-foreground mt-1">{subtitle}</p>
      )}
      {!isLast && (
        <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 text-muted-foreground/20">
          <ArrowUpRight className="size-4" strokeWidth={2} />
        </div>
      )}
    </div>
  );
};

const QueueCard = ({ label, count, icon, variant = "default" }) => {
  const Icon = icon;
  const colorMap = {
    warning: "bg-warning/10 text-warning border-warning/20",
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
    default: "bg-muted text-muted-foreground border-border",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-5 text-center">
      <div
        className={cn(
          "size-10 mx-auto rounded-xl border flex items-center justify-center mb-3",
          colorMap[variant]
        )}
      >
        <Icon size={16} strokeWidth={2.5} />
      </div>
      <p className="text-[10px] font-label font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </p>
      <p
        className={cn(
          "text-lg md:text-2xl font-heading font-black tracking-tight tabular-nums",
          count > 0 ? "text-foreground" : "text-muted-foreground/50"
        )}
      >
        {count}
      </p>
    </div>
  );
};

export default PlatformOverview;