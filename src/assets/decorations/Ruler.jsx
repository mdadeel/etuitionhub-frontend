import { cn } from '@/lib/utils';

export default function Ruler({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={cn("select-none pointer-events-none text-primary", className)}>
      <path d="M5 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H5z" />
      <path d="M11 6h2M11 10h4M11 14h2M11 18h4" />
    </svg>
  );
}
