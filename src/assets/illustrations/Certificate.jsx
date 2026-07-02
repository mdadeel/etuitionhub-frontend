import { cn } from '@/lib/utils';

export default function Certificate({ className }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" className={cn("select-none pointer-events-none text-primary", className)}>
      <rect x="15" y="15" width="70" height="50" rx="4" strokeWidth="1.5" />
      <rect x="22" y="22" width="56" height="36" rx="2" opacity="0.5" />
      {/* Tied Ribbon lines */}
      <rect x="45" y="55" width="10" height="30" fill="#EF4444" stroke="none" />
      <path d="M 45 85 L 50 80 L 55 85" stroke="#EF4444" strokeWidth="1" />
      <circle cx="50" cy="55" r="8" fill="#F59E0B" stroke="#D97706" strokeWidth="1.2" />
    </svg>
  );
}
