import { cn } from '@/lib/utils';

export default function Calculator({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={cn("select-none pointer-events-none text-primary", className)}>
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <rect x="8" y="5" width="8" height="4" />
      <line x1="9" y1="13" x2="9" y2="13.01" />
      <line x1="12" y1="13" x2="12" y2="13.01" />
      <line x1="15" y1="13" x2="15" y2="13.01" />
      <line x1="9" y1="17" x2="9" y2="17.01" />
      <line x1="12" y1="17" x2="12" y2="17.01" />
      <line x1="15" y1="17" x2="15" y2="17.01" />
    </svg>
  );
}
