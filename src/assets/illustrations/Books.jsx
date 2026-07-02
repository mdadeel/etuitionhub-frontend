import { cn } from '@/lib/utils';

export default function Books({ className }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" className={cn("select-none pointer-events-none text-primary", className)}>
      <rect x="15" y="65" width="70" height="20" rx="2" fill="none" strokeWidth="1.5" />
      <line x1="25" y1="75" x2="75" y2="75" strokeDasharray="3 3" />
      <rect x="20" y="45" width="60" height="20" rx="2" fill="none" strokeWidth="1.5" />
      <line x1="30" y1="55" x2="70" y2="55" strokeDasharray="2 2" />
      <rect x="25" y="25" width="50" height="20" rx="2" fill="none" strokeWidth="1.5" />
    </svg>
  );
}
