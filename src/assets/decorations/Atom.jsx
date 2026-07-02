import { cn } from '@/lib/utils';

export default function Atom({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={cn("select-none pointer-events-none text-primary", className)}>
      <ellipse cx="12" cy="12" rx="3" ry="9" />
      <ellipse cx="12" cy="12" rx="3" ry="9" transform="rotate(45 12 12)" />
      <ellipse cx="12" cy="12" rx="3" ry="9" transform="rotate(-45 12 12)" />
      <ellipse cx="12" cy="12" rx="3" ry="9" transform="rotate(90 12 12)" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
