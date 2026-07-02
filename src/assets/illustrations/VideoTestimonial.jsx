import { cn } from '@/lib/utils';

export default function VideoTestimonial({ className }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" className={cn("select-none pointer-events-none text-primary", className)}>
      <rect x="10" y="15" width="80" height="60" rx="6" strokeWidth="1.5" />
      <polygon points="42,35 65,45 42,55" fill="currentColor" strokeLinejoin="round" />
      <circle cx="15" cy="85" r="3" opacity="0.5" />
      <circle cx="85" cy="85" r="3" opacity="0.5" />
      <line x1="25" y1="85" x2="75" y2="85" strokeDasharray="3 3" opacity="0.3" />
    </svg>
  );
}
