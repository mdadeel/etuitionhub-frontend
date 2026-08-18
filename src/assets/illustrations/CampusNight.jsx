import { cn } from '@/lib/utils';

export default function CampusNight({ className }) {
  return (
    <svg viewBox="0 0 1200 240" fill="none" stroke="currentColor" className={cn("select-none pointer-events-none", className)} preserveAspectRatio="none">
      <defs>
        <linearGradient id="footerSkyGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" stopOpacity="0" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      
      {/* Background sky gradient blend */}
      <rect x="0" y="0" width="1200" height="240" fill="url(#footerSkyGlow)" stroke="none" />

      {/* Crescent Moon */}
      <path d="M 1060 40 A 18 18 0 1 0 1078 58 A 15 15 0 1 1 1060 40 Z" fill="currentColor" className="text-white/20 dark:text-white/10" stroke="none" />

      {/* Twinkling night stars */}
      <g className="text-white/20 dark:text-white/10">
        <circle cx="100" cy="30" r="1" />
        <circle cx="240" cy="50" r="1.2" />
        <circle cx="450" cy="20" r="1" />
        <circle cx="620" cy="45" r="1" />
        <circle cx="780" cy="35" r="1.5" />
        <circle cx="920" cy="60" r="1" />
        <circle cx="1000" cy="25" r="1.2" />
        {/* Small sparkly star */}
        <path d="M 330 35 L 331 38 L 334 39 L 331 40 L 330 43 L 329 40 L 326 39 L 329 38 Z" fill="currentColor" stroke="none" />
        <path d="M 850 50 L 851 53 L 854 54 L 851 55 L 850 58 L 849 55 L 846 54 L 849 53 Z" fill="currentColor" stroke="none" />
      </g>

      {/* Night Skyline Silhouette of Dhaka Landmarks */}
      <g className="text-slate-950/40 dark:text-slate-950/60" fill="currentColor" stroke="none">
        {/* Trees & basic background shapes */}
        <path d="M 0 240 V 170 Q 25 155, 50 165 T 100 180 T 200 170 T 300 190 V 240 Z" opacity="0.3" />
        <path d="M 850 240 V 180 Q 920 160, 990 185 T 1120 190 T 1200 175 V 240 Z" opacity="0.2" />

        {/* DU Curzon Hall dome & structures */}
        <path d="M 280 240 V 180 H 300 V 165 H 315 V 135 H 325 V 120 H 335 V 135 H 345 V 165 H 360 V 180 H 380 V 155 H 400 V 125 H 415 V 120 H 430 V 125 H 450 V 155 H 480 V 180 H 500 V 165 H 515 V 135 H 525 V 120 H 535 V 135 H 545 V 165 H 560 V 180 H 580 V 240 Z" opacity="0.5" />
        {/* Jatiyo Sangsad Bhaban / Assembly shape */}
        <path d="M 620 240 V 185 L 650 155 H 710 L 740 185 V 240 Z" opacity="0.4" />
        <rect x="674" y="120" width="6" height="35" opacity="0.4" />
        <polygon points="677,105 674,120 680,120" opacity="0.4" />

        {/* General blocks */}
        <path d="M 0 240 H 1200 V 215 H 1150 V 195 H 1090 V 215 H 1040 V 180 H 980 V 205 H 930 V 240 Z" opacity="0.2" />
      </g>

      {/* Curved dotted landing path */}
      <path d="M 100 -20 Q 350 140, 600 50 T 1000 200" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" className="text-white/20 dark:text-white/10" />
      
      {/* Tiny landing paper airplane */}
      <g className="text-white/30 dark:text-white/25" transform="translate(995, 196) rotate(35) scale(0.65)">
        <path d="M-6 -3 L6 0 L-3 3 Z M-3 3 L-1.5 0 M6 0 L-3 1" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
