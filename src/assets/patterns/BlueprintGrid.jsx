import { cn } from '@/lib/utils';

export default function BlueprintGrid({ className }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="0.5" className={cn("select-none pointer-events-none text-primary/10 dark:text-primary/5", className)}>
      <pattern id="blueprintGridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
        <line x1="0" y1="10" x2="10" y2="10" />
        <line x1="10" y1="0" x2="10" y2="10" />
      </pattern>
      <rect width="100" height="100" fill="url(#blueprintGridPattern)" stroke="none" />
    </svg>
  );
}
