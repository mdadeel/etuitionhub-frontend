import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0.3 },
  visible: { 
    pathLength: 1, 
    opacity: 1,
    transition: { duration: 2.2, ease: "easeInOut" }
  }
};

export default function SectionDivider({ variant, className }) {
  // Render storytelling transitions
  if (variant === 'paper-path') {
    return (
      <div className={cn("w-full overflow-hidden h-10 flex items-center bg-transparent pointer-events-none select-none my-2", className)}>
        <svg viewBox="0 0 1200 30" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-primary/20 dark:text-primary/10">
          <motion.path 
            d="M 0 15 Q 250 2, 500 25 T 900 8 T 1200 15" 
            strokeDasharray="3 4" 
            variants={pathVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          />
          {/* Small paper airplane */}
          <g transform="translate(680, 16) rotate(-5)">
            <path d="M-6 -3 L6 0 L-3 3 Z M-3 3 L-1.5 0 M6 0 L-3 1" fill="currentColor" stroke="none" className="text-primary/40 dark:text-primary/20" />
          </g>
        </svg>
      </div>
    );
  }

  if (variant === 'campus-skyline') {
    return (
      <div className={cn("w-full overflow-hidden h-14 flex items-center bg-transparent pointer-events-none select-none my-2", className)}>
        <svg viewBox="0 0 1200 40" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-full h-full text-primary/15 dark:text-primary/5">
          {/* Dotted skyline layout */}
          <motion.path 
            d="M 0 35 H 150 V 20 H 180 V 10 H 200 V 20 H 220 V 35 H 450 V 25 H 490 V 15 H 510 V 25 H 540 V 35 H 780 V 20 H 810 V 10 H 830 V 20 H 850 V 35 H 1020 V 25 H 1060 V 15 H 1080 V 25 H 1110 V 35 H 1200" 
            strokeDasharray="2 3"
            variants={pathVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          />
        </svg>
      </div>
    );
  }

  if (variant === 'book-edge') {
    return (
      <div className={cn("w-full h-6 flex items-center bg-transparent pointer-events-none select-none my-1", className)}>
        <svg viewBox="0 0 1200 20" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-full h-full text-primary/10 dark:text-primary/5">
          <line x1="0" y1="10" x2="1200" y2="10" />
          {/* Fold center page fold */}
          <path d="M 570 10 L 600 1.5 L 630 10" />
          <path d="M 570 10 L 600 18.5 L 630 10" opacity="0.4" />
        </svg>
      </div>
    );
  }

  if (variant === 'notebook-tear') {
    return (
      <div className={cn("w-full h-8 flex items-center bg-transparent pointer-events-none select-none my-1", className)}>
        <svg viewBox="0 0 1200 20" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-primary/15 dark:text-primary/5">
          {/* Jagged spiral notebook tear path */}
          <motion.path 
            d="M 0 10 C 20 12, 40 8, 60 10 C 80 12, 100 8, 120 10 C 140 12, 160 8, 180 10 C 200 12, 220 8, 240 10 C 260 12, 280 8, 300 10 C 320 12, 340 8, 360 10 C 380 12, 400 8, 420 10 C 440 12, 460 8, 480 10 C 500 12, 520 8, 540 10 C 560 12, 580 8, 600 10 C 620 12, 640 8, 660 10 C 680 12, 700 8, 720 10 C 740 12, 760 8, 780 10 C 800 12, 820 8, 840 10 C 860 12, 880 8, 900 10 C 920 12, 940 8, 960 10 C 980 12, 1000 8, 1020 10 C 1040 12, 1060 8, 1080 10 C 1100 12, 1120 8, 1140 10 C 1160 12, 1180 8, 1200 10" 
            variants={pathVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          />
        </svg>
      </div>
    );
  }

  if (variant === 'minimal-wave') {
    return (
      <div className={cn("w-full h-10 flex items-center bg-transparent pointer-events-none select-none my-1", className)}>
        <svg viewBox="0 0 1200 20" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-full h-full text-primary/10 dark:text-primary/5">
          <motion.path 
            d="M 0 10 Q 300 0, 600 10 T 1200 10" 
            variants={pathVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          />
        </svg>
      </div>
    );
  }

  if (variant === 'learning-route') {
    return (
      <div className={cn("w-full overflow-hidden h-12 flex items-center bg-transparent pointer-events-none select-none my-2", className)}>
        <svg viewBox="0 0 1200 30" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-primary/20 dark:text-primary/10">
          <motion.path 
            d="M 0 15 H 1200" 
            strokeDasharray="1 5" 
            variants={pathVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          />
          {/* Book outline marker node */}
          <g transform="translate(350, 15) scale(0.55)" strokeWidth="1.2">
            <rect x="-12" y="-12" width="24" height="24" rx="4" fill="hsl(var(--background))" stroke="currentColor" />
            <path d="M -7 -4 H 7 M -7 2 H 7" />
          </g>
          {/* Graduation cap marker node */}
          <g transform="translate(700, 15) scale(0.5)" strokeWidth="1.2">
            <rect x="-12" y="-12" width="24" height="24" rx="4" fill="hsl(var(--background))" stroke="currentColor" />
            <path d="M -8 -3 L 0 -8 L 8 -3 L 0 2 Z" />
            <path d="M -4 0 V 5 C -4 7, 4 7, 4 5 V 0" />
          </g>
          {/* Sparkle marker node */}
          <g transform="translate(1000, 15) scale(0.5)" strokeWidth="1.2">
            <rect x="-12" y="-12" width="24" height="24" rx="4" fill="hsl(var(--background))" stroke="currentColor" />
            <path d="M 0 -8 Q 0 0 8 0 Q 0 0 0 8 Q 0 0 -8 0 Q 0 0 0 -8 Z" fill="currentColor" stroke="none" />
          </g>
        </svg>
      </div>
    );
  }

  return null;
}
