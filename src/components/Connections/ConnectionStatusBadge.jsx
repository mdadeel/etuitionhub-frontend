import { cn } from '@/lib/utils';

const VARIANTS = {
  pending:             { label: 'Pending request',  color: 'bg-amber-50 text-amber-700 border-amber-200' },
  accepted:            { label: 'Accepted',         color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected:            { label: 'Rejected',         color: 'bg-red-50 text-red-700 border-red-200' },
  blocked:             { label: 'Blocked',          color: 'bg-gray-100 text-gray-700 border-gray-300' },
  cancelled:           { label: 'Cancelled',        color: 'bg-gray-100 text-gray-700 border-gray-300' },
  expired:             { label: 'Expired',          color: 'bg-gray-100 text-gray-500 border-gray-200' },
  waiting_for_payment: { label: 'Awaiting payment', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  scheduled:           { label: 'Scheduled',        color: 'bg-blue-50 text-blue-700 border-blue-200' },
  active:              { label: 'Active',           color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  paused:              { label: 'Paused',           color: 'bg-violet-50 text-violet-700 border-violet-200' },
  completed:           { label: 'Completed',        color: 'bg-gray-100 text-gray-700 border-gray-300' }
};

const ConnectionStatusBadge = ({ status, relationshipStatus, className }) => {
  const key = relationshipStatus || status || 'pending';
  const v = VARIANTS[key] || VARIANTS.pending;
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full border',
      v.color,
      className
    )}>
      {v.label}
    </span>
  );
};

export default ConnectionStatusBadge;
