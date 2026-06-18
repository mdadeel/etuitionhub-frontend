import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  requested: { label: "Pending", className: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/15 dark:border-amber-500/25" },
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/15 dark:border-amber-500/25" },
  pending_verification: { label: "Verify", className: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/15 dark:border-amber-500/25" },
  processing: { label: "Processing", className: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400 dark:bg-blue-500/15 dark:border-blue-500/25" },
  approved: { label: "Approved", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/15 dark:border-emerald-500/25" },
  confirmed: { label: "Confirmed", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/15 dark:border-emerald-500/25" },
  paid: { label: "Paid", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/15 dark:border-emerald-500/25" },
  available_for_withdrawal: { label: "Available", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/15 dark:border-emerald-500/25" },
  withdrawn: { label: "Withdrawn", className: "bg-zinc-500/10 text-zinc-700 border-zinc-500/20 dark:text-zinc-400 dark:bg-zinc-500/15 dark:border-zinc-500/25" },
  commission_applied: { label: "Commission", className: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400 dark:bg-blue-500/15 dark:border-blue-500/25" },
  rejected: { label: "Rejected", className: "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400 dark:bg-red-500/15 dark:border-red-500/25" },
  verified_basic: { label: "Basic", className: "bg-primary/10 text-primary border-primary/20" },
  verified_premium: { label: "Premium", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/15 dark:border-emerald-500/25" },
  pending_review: { label: "Review", className: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/15 dark:border-amber-500/25" },
  unverified: { label: "None", className: "bg-muted text-muted-foreground/40 border-transparent" },
};

const StatusBadge = ({ status, label, className }) => {
  const config = STATUS_CONFIG[status] || { label: status || "—", className: "bg-muted text-muted-foreground/40 border-transparent" };
  const displayLabel = label || config.label;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-lg border whitespace-nowrap",
      config.className,
      className,
    )}>
      <span className="size-1.5 rounded-full bg-current opacity-80" />
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
