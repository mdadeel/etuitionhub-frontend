import { cn } from '@/lib/utils';

const VARIANTS = {
  pending:             { label: 'Pending request',  color: 'bg-warning/10 text-warning border-warning/20' },
  waiting_for_payment: { label: 'Awaiting payment', color: 'bg-warning/10 text-warning border-warning/20' },
  awaiting_payment:    { label: 'Awaiting payment', color: 'bg-warning/10 text-warning border-warning/20' },
  accepted:            { label: 'Accepted',         color: 'bg-success/10 text-success border-success/20' },
  active:              { label: 'Active',           color: 'bg-success/10 text-success border-success/20' },
  rejected:            { label: 'Rejected',         color: 'bg-destructive/10 text-destructive border-destructive/20' },
  blocked:             { label: 'Blocked',          color: 'bg-muted text-muted-foreground border-border' },
  cancelled:           { label: 'Cancelled',        color: 'bg-muted text-muted-foreground border-border' },
  expired:             { label: 'Expired',          color: 'bg-muted text-muted-foreground border-border' },
  completed:           { label: 'Completed',        color: 'bg-muted text-muted-foreground border-border' },
  scheduled:           { label: 'Scheduled',        color: 'bg-primary/10 text-primary border-primary/20' },
  paused:              { label: 'Paused',           color: 'bg-primary/10 text-primary border-primary/20' }
};

const ConnectionStatusBadge = ({ status, relationshipStatus, className }) => {
  const key = relationshipStatus || status || 'pending';
  const v = VARIANTS[key] || VARIANTS.pending;
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full border',
      v.color,
      className
    )}>
      {v.label}
    </span>
  );
};

export default ConnectionStatusBadge;
