import { cn } from "@/lib/utils";

const TONES = {
  warning: "bg-warning/10 text-warning border-warning/20",
  info: "bg-primary/10 text-primary border-primary/20",
  success: "bg-success/10 text-success border-success/20",
  neutral: "bg-muted text-muted-foreground border-border",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
};

const STATUS_CONFIG = {
  requested: { label: "Pending", tone: TONES.warning },
  pending: { label: "Pending", tone: TONES.warning },
  pending_verification: { label: "Verify", tone: TONES.warning },
  pending_review: { label: "Review", tone: TONES.warning },
  processing: { label: "Processing", tone: TONES.info },
  commission_applied: { label: "Commission", tone: TONES.info },
  approved: { label: "Approved", tone: TONES.success },
  confirmed: { label: "Confirmed", tone: TONES.success },
  paid: { label: "Paid", tone: TONES.success },
  available_for_withdrawal: { label: "Available", tone: TONES.success },
  verified_premium: { label: "Premium", tone: TONES.success },
  withdrawn: { label: "Withdrawn", tone: TONES.neutral },
  unverified: { label: "None", tone: TONES.neutral },
  rejected: { label: "Rejected", tone: TONES.destructive },
  verified_basic: { label: "Basic", tone: TONES.info },
};

const StatusBadge = ({ status, label, className }) => {
  const config = STATUS_CONFIG[status] || { label: status || "—", tone: TONES.neutral };
  const displayLabel = label || config.label;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border whitespace-nowrap",
      config.tone,
      className,
    )}>
      <span className="size-1.5 rounded-full bg-current opacity-80" />
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
