import { cn } from '@/lib/utils';

export default function CircularNotebook({ className }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="0.8" className={cn("select-none pointer-events-none text-primary/10 dark:text-primary/5", className)}>
      <circle cx="50" cy="50" r="10" strokeDasharray="1 3" />
      <circle cx="50" cy="50" r="25" strokeDasharray="2 4" />
      <circle cx="50" cy="50" r="40" strokeDasharray="3 5" />
    </svg>
  );
}
