import { cn } from '@/lib/utils';

export default function Subjects({ className }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" className={cn("select-none pointer-events-none text-primary", className)}>
      <rect x="15" y="15" width="70" height="70" rx="6" strokeWidth="1.5" />
      {/* Lined notebook details */}
      <line x1="30" y1="15" x2="30" y2="85" stroke="#EF4444" strokeWidth="1" />
      <line x1="40" y1="30" x2="75" y2="30" strokeWidth="0.8" strokeDasharray="1 3" />
      <line x1="40" y1="45" x2="75" y2="45" strokeWidth="0.8" strokeDasharray="1 3" />
      <line x1="40" y1="60" x2="75" y2="60" strokeWidth="0.8" strokeDasharray="1 3" />
      {/* Mathematical symbol overlay */}
      <path d="M 62 48 L 74 62 M 74 48 L 62 62" strokeWidth="1.5" />
    </svg>
  );
}
