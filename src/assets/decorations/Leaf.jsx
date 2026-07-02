import { cn } from '@/lib/utils';

export default function Leaf({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={cn("select-none pointer-events-none text-primary", className)}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 8.5 22 4c-4.5 5-1.1 6.5-2.1 12.2A7 7 0 0 1 11 20z" />
      <path d="M19 5c-3 3-5.5 8-7 14" />
    </svg>
  );
}
