/**
 * <Illustration name="family-learning" />
 *
 * Renders a real SVG illustration if one exists.
 * For any name NOT in the registry, renders a styled placeholder:
 *   - Correct reserved dimensions (from parent container)
 *   - Subtle gradient background
 *   - Asset name label (so designers know what to add)
 *
 * To add a real illustration:
 *   1. Create /src/assets/illustrations/YourFile.jsx
 *   2. Add an entry to REGISTRY below
 *   3. The placeholder is replaced automatically
 */
import React, { lazy, Suspense } from 'react';
import { cn } from '@/lib/utils';

// ─── Registry ───────────────────────────────────────────────────────────────
// Only list files that ACTUALLY EXIST in /src/assets/illustrations/
// Add entries as you drop in new SVG files.
const REGISTRY = {
  'family-learning':  lazy(() => import('../../../assets/illustrations/FamilyLearning')),
  'robot':            lazy(() => import('../../../assets/illustrations/Robot')),
  'student-thinking': lazy(() => import('../../../assets/illustrations/StudentThinking')),
  'graduation':       lazy(() => import('../../../assets/illustrations/Graduation')),
  'books':            lazy(() => import('../../../assets/illustrations/Books')),
  'campus':           lazy(() => import('../../../assets/illustrations/Campus')),
  'campus-night':     lazy(() => import('../../../assets/illustrations/CampusNight')),
  'certificate':      lazy(() => import('../../../assets/illustrations/Certificate')),
  'faq':              lazy(() => import('../../../assets/illustrations/FAQ')),
  'subjects':         lazy(() => import('../../../assets/illustrations/Subjects')),
  'video-testimonial': lazy(() => import('../../../assets/illustrations/VideoTestimonial')),
};

// ─── Placeholder ─────────────────────────────────────────────────────────────
// Shown when no real illustration exists yet for a given name.
const META = {
  'hero':             { gradient: 'from-blue-50 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-950/40', icon: '🏙️',  label: 'Hero Illustration' },
  'family-learning':  { gradient: 'from-amber-50 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40', icon: '👨‍👩‍👧', label: 'Family Learning' },
  'robot':            { gradient: 'from-sky-50 to-blue-100 dark:from-sky-950/40 dark:to-blue-950/40', icon: '🤖',  label: 'AI Study Assistant' },
  'student-thinking': { gradient: 'from-violet-50 to-purple-100 dark:from-violet-950/40 dark:to-purple-950/40', icon: '🤔', label: 'Student Thinking' },
  'graduation':       { gradient: 'from-emerald-50 to-teal-100 dark:from-emerald-950/40 dark:to-teal-950/40', icon: '🎓', label: 'Graduation / Success' },
};

function IllustrationPlaceholder({ name, className }) {
  const meta = META[name] ?? {
    gradient: 'from-slate-50 to-slate-100 dark:from-slate-900/40 dark:to-slate-800/40',
    icon: '🖼️',
    label: name ?? 'Illustration',
  };

  return (
    <div
      className={cn(
        'w-full h-full min-h-[240px] rounded-2xl',
        'bg-gradient-to-br border border-dashed border-border/40',
        'flex flex-col items-center justify-center gap-3 select-none',
        meta.gradient,
        className
      )}
    >
      <span className="text-5xl">{meta.icon}</span>
      <div className="text-center space-y-0.5">
        <p className="text-xs font-semibold text-muted-foreground/70 tracking-wide uppercase">
          {meta.label}
        </p>
        <p className="text-[10px] text-muted-foreground/40 font-mono">
          Drop SVG → assets/illustrations/
        </p>
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Illustration({ name, className, ...props }) {
  const Comp = REGISTRY[name];

  // Unknown name → show placeholder immediately (no lazy import attempted)
  if (!Comp) {
    return <IllustrationPlaceholder name={name} className={className} />;
  }

  return (
    <Suspense fallback={<IllustrationPlaceholder name={name} className={className} />}>
      <Comp className={cn('w-full h-full', className)} {...props} />
    </Suspense>
  );
}
