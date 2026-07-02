import { cn } from '@/lib/utils';

export default function FAQ({ className }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" className={cn("select-none pointer-events-none text-primary", className)}>
      {/* Curved lines and folder shapes representing questions */}
      <rect x="15" y="15" width="70" height="70" rx="8" strokeWidth="1.5" />
      <path d="M 30 35 C 30 25, 50 25, 50 35 C 50 43, 40 45, 40 52" strokeWidth="1.5" />
      <circle cx="40" cy="62" r="2" fill="currentColor" stroke="none" />
      {/* Chat bubble outline */}
      <path d="M 60 55 H 82 V 75 L 72 70 H 60 Z" fill="#FFFFFF" />
    </svg>
  );
}
