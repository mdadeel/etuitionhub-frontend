import { cn } from '@/lib/utils';

export default function StudentThinking({ className }) {
  return (
    <svg viewBox="0 0 500 400" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={cn("select-none pointer-events-none text-primary", className)}>
      <defs>
        <linearGradient id="bubbleBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Soft ground shelf */}
      <line x1="40" y1="360" x2="460" y2="360" strokeWidth="1.5" opacity="0.4" />

      {/* Stack of books on the side */}
      <g transform="translate(60, 275)" className="text-primary/70">
        {/* Book 1 (Bottom) */}
        <path d="M 0 60 H 90 V 85 H 0 Z" fill="none" strokeWidth="1.2" />
        <path d="M 90 60 L 98 64 V 89 L 90 85 Z" fill="currentColor" opacity="0.1" />
        <line x1="10" y1="72" x2="80" y2="72" strokeWidth="0.8" strokeDasharray="3 3" />
        {/* Book 2 (Middle) */}
        <path d="M 8 35 H 82 V 60 H 8 Z" fill="none" strokeWidth="1.2" />
        <line x1="18" y1="48" x2="72" y2="48" strokeWidth="0.8" strokeDasharray="2 2" />
        {/* Book 3 (Top - slanted) */}
        <g transform="translate(10, 10) rotate(-8)">
          <path d="M 0 0 H 68 V 24 H 0 Z" fill="none" strokeWidth="1.2" />
          <line x1="8" y1="12" x2="60" y2="12" strokeWidth="0.8" />
        </g>
      </g>

      {/* Pencil holder pot */}
      <g transform="translate(175, 305)" className="text-primary/60">
        <rect x="0" y="20" width="30" height="35" rx="3" fill="none" />
        {/* Pencils pointing up */}
        <line x1="8" y1="20" x2="-2" y2="-2" strokeWidth="1.5" />
        <path d="M -2 -2 L 1 -8 L 4 -2" strokeWidth="1" /> {/* Pencil tip */}
        <line x1="22" y1="20" x2="30" y2="2" strokeWidth="1.5" />
        <path d="M 30 2 L 34 -4 L 37 2" strokeWidth="1" />
      </g>

      {/* STUDENT THINKING (Notre Dame/Viqarunnisa style student outline) */}
      <g transform="translate(240, 150)" className="text-foreground/80">
        {/* Head */}
        <circle cx="70" cy="55" r="22" fill="none" strokeWidth="1.5" />
        
        {/* Thinking posture arm (Hand supporting chin) */}
        {/* Shoulder and body */}
        <path d="M 45 145 C 45 105, 95 105, 95 145" strokeWidth="1.5" />
        
        {/* Arm resting on desk and elbow bent upwards */}
        <path d="M 40 210 L 25 150 L 58 75" fill="none" strokeWidth="1.5" />
        
        {/* Cute face features (Thinking closed eyes, smile) */}
        <path d="M 68 52 A 2.5 2.5 0 0 1 73 52" strokeWidth="1.5" />
        <path d="M 70 65 Q 65 67 60 62" strokeWidth="1" /> {/* Chin support touch */}

        {/* Desk surface in front of student */}
        <line x1="-30" y1="210" x2="160" y2="210" strokeWidth="1.2" opacity="0.6" />
      </g>

      {/* Floating Question Marks (Illustrating curiosity) */}
      <g className="text-primary" strokeWidth="1.5">
        {/* Big central question mark */}
        <path d="M 230 90 C 230 65, 260 65, 260 85 C 260 100, 245 105, 245 118" />
        <circle cx="245" cy="130" r="2.5" fill="currentColor" stroke="none" />

        {/* Small floating question marks */}
        <g transform="translate(140, 70) scale(0.65)" opacity="0.7">
          <path d="M 20 20 C 20 5, 40 5, 40 18 C 40 28, 30 32, 30 40" strokeWidth="1.8" />
          <circle cx="30" cy="48" r="2" fill="currentColor" stroke="none" />
        </g>

        <g transform="translate(350, 100) scale(0.75) rotate(15)" opacity="0.7">
          <path d="M 20 20 C 20 5, 40 5, 40 18 C 40 28, 30 32, 30 40" strokeWidth="1.8" />
          <circle cx="30" cy="48" r="2" fill="currentColor" stroke="none" />
        </g>
      </g>

      {/* Floating Thought Cloud/Bubble */}
      <path d="M 160 145 C 150 145, 140 135, 145 125 C 140 115, 155 100, 170 105 C 175 95, 195 95, 200 105 C 215 100, 225 115, 220 125 C 225 135, 215 145, 205 145 C 200 150, 170 150, 160 145 Z" 
        fill="url(#bubbleBlue)" stroke="none" />

      {/* Floating Sticky Notes */}
      <g transform="translate(370, 240) rotate(-10)" className="text-primary/60">
        <rect x="0" y="0" width="50" height="50" rx="2" fill="none" strokeWidth="1.2" />
        <line x1="8" y1="12" x2="42" y2="12" strokeWidth="0.8" />
        <line x1="8" y1="22" x2="38" y2="22" strokeWidth="0.8" />
        <line x1="8" y1="32" x2="30" y2="32" strokeWidth="0.8" />
      </g>

      {/* Tiny academic symbols floating */}
      <g className="text-primary/30 font-mono text-[9px]">
        <text x="350" y="70">Δx → 0</text>
        <text x="70" y="240">π ≈ 3.14</text>
        <text x="180" y="270">∑ xi</text>
      </g>
    </svg>
  );
}
