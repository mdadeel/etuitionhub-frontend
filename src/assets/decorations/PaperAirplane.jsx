import { cn } from '@/lib/utils';

export default function PaperAirplane({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={cn("select-none pointer-events-none text-primary", className)}>
      <path d="M22 2L2 9.5L11 13L15 22L22 2Z" />
      <line x1="11" y1="13" x2="22" y2="2" />
    </svg>
  );
}
