import { cn } from '@/lib/utils';

export default function Graduation({ className }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" className={cn("select-none pointer-events-none text-primary", className)}>
      <path d="M 10 35 L 50 15 L 90 35 L 50 55 Z" strokeWidth="1.8" fill="none" />
      <path d="M 25 45 V 65 C 25 75, 75 75, 75 65 V 45" strokeWidth="1.5" />
      <path d="M 50 55 Q 82 65 85 85" strokeWidth="1" />
      <rect x="83" y="85" width="4" height="8" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
