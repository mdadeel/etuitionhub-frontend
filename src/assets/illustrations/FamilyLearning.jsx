import { cn } from '@/lib/utils';

export default function FamilyLearning({ className }) {
  return (
    <svg viewBox="0 0 500 400" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={cn("select-none pointer-events-none text-primary", className)}>
      <defs>
        <linearGradient id="warmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="softFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Warm background gradient circle */}
      <circle cx="250" cy="180" r="130" fill="url(#warmGrad)" stroke="none" />

      {/* Ground shelf/desk base */}
      <line x1="80" y1="330" x2="420" y2="330" strokeWidth="1.5" opacity="0.4" />

      {/* Father (Left, sitting & pointing) */}
      <g transform="translate(110, 140)" className="text-foreground/80">
        <circle cx="40" cy="40" r="18" fill="none" strokeWidth="1.5" />
        {/* Hair and details */}
        <path d="M 22 40 C 22 20, 58 20, 58 40" strokeWidth="1.2" />
        {/* Face details */}
        <circle cx="34" cy="38" r="1" fill="currentColor" stroke="none" />
        <circle cx="46" cy="38" r="1" fill="currentColor" stroke="none" />
        <path d="M 36 48 Q 40 52 44 48" />
        {/* Body and arm pointing */}
        <path d="M 15 120 C 15 90, 65 90, 65 120 V 180" strokeWidth="1.5" />
        <path d="M 58 100 L 95 95 L 115 105" fill="none" strokeWidth="1.5" /> {/* Arm pointing to book */}
      </g>

      {/* Mother (Right, sitting & wrapping arm around child) */}
      <g transform="translate(290, 145)" className="text-foreground/80">
        <circle cx="40" cy="35" r="18" fill="none" strokeWidth="1.5" />
        <path d="M 22 35 C 22 15, 58 15, 58 35" strokeWidth="1.2" />
        <circle cx="25" cy="33" r="1" fill="#EF4444" stroke="none" /> {/* Mother bindi */}
        {/* Face details */}
        <circle cx="34" cy="33" r="1" fill="currentColor" stroke="none" />
        <circle cx="46" cy="33" r="1" fill="currentColor" stroke="none" />
        <path d="M 36 43 Q 40 47 44 43" />
        {/* Body */}
        <path d="M 15 115 C 15 85, 65 85, 65 115 V 175" strokeWidth="1.5" />
        {/* Left arm wrapping child */}
        <path d="M 22 95 C -10 95, -15 110, -25 120" fill="none" strokeWidth="1.5" />
      </g>

      {/* Child (Center, looking at book) */}
      <g transform="translate(210, 185)" className="text-primary">
        <circle cx="40" cy="30" r="15" fill="none" strokeWidth="1.5" />
        {/* Smile closed eyes */}
        <path d="M 35 28 A 1.5 1.5 0 0 1 38 28" />
        <path d="M 42 28 A 1.5 1.5 0 0 1 45 28" />
        <path d="M 36 38 Q 40 42 44 38" />
        {/* Body and desk arms */}
        <path d="M 20 90 C 20 68, 60 68, 60 90 V 145" strokeWidth="1.5" />
        <path d="M 25 90 L 10 115 H 70 L 55 90" fill="none" strokeWidth="1.2" />
      </g>

      {/* Laptop & Books on Desk (Center-left) */}
      <g transform="translate(180, 290)">
        {/* Open book */}
        <path d="M 0 25 C 20 15, 50 15, 70 25 C 90 15, 120 15, 140 25 L 140 38 C 120 28, 90 28, 70 38 C 50 28, 20 28, 0 38 Z" fill="#FFFFFF" strokeWidth="1.5" />
        {/* Laptop */}
        <path d="M -80 32 H -20 L -15 38 H -85 Z" fill="#D1D5DB" />
        <path d="M -75 32 L -70 5 H -30 L -25 32" fill="#E5E7EB" strokeWidth="1.2" />
      </g>

      {/* Soft plant leaves (Right side) */}
      <g transform="translate(380, 240)" className="text-emerald-600/40 dark:text-emerald-600/20">
        <path d="M 10 80 Q 20 40, 5 10 C 25 35, 30 65, 30 80" fill="currentColor" />
        <path d="M 25 80 Q 35 50, 45 30 C 50 50, 45 70, 35 80" fill="currentColor" opacity="0.8" />
      </g>

      {/* Fading bottom overlay mask (Blends illustration into white/dark sections) */}
      <rect x="0" y="320" width="500" height="80" fill="url(#softFade)" stroke="none" />
    </svg>
  );
}
