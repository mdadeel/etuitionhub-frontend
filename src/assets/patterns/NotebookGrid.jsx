import { cn } from '@/lib/utils';

export default function NotebookGrid({ className }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="0.5" className={cn("select-none pointer-events-none text-primary/10 dark:text-primary/5", className)}>
      <pattern id="notebookGridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
        <line x1="0" y1="20" x2="20" y2="20" />
        <line x1="20" y1="0" x2="20" y2="20" opacity="0.3" />
      </pattern>
      <rect width="100" height="100" fill="url(#notebookGridPattern)" stroke="none" />
    </svg>
  );
}
