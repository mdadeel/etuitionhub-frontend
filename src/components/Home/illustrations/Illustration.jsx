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
import { Building2, Users, Bot, Brain, GraduationCap, Image } from 'lucide-react';

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
// Uses lucide icons (no emoji as interface icons — design-system mandate).
const META = {
  'hero':             { gradient: 'bg-muted/30', icon: Building2, label: 'Hero Illustration' },
  'family-learning':  { gradient: 'bg-muted/30', icon: Users, label: 'Family Learning' },
  'robot':            { gradient: 'bg-muted/30', icon: Bot, label: 'AI Study Assistant' },
  'student-thinking': { gradient: 'bg-muted/30', icon: Brain, label: 'Student Thinking' },
  'graduation':       { gradient: 'bg-muted/30', icon: GraduationCap, label: 'Graduation / Success' },
};

function IllustrationPlaceholder({ name, className }) {
  const meta = META[name] ?? {
    gradient: 'bg-muted/30',
    icon: Image,
    label: name ?? 'Illustration',
  };

  const Icon = meta.icon;

  return (
    <div
      className={cn(
        'w-full h-full min-h-[240px] rounded-lg',
        'border border-dashed border-border/40',
        'flex flex-col items-center justify-center gap-3 select-none',
        meta.gradient,
        className
      )}
    >
      <Icon className="size-12 text-muted-foreground/40" strokeWidth={1.5} />
      <div className="text-center space-y-0.5">
        <p className="text-xs font-semibold text-muted-foreground/70 tracking-wide uppercase">
          {meta.label}
        </p>
        <p className="text-[11px] text-muted-foreground/40 font-mono">
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
