import { cn } from '@/lib/utils';

export default function Robot({ className }) {
  return (
    <svg viewBox="0 0 500 400" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={cn("select-none pointer-events-none text-primary", className)}>
      <defs>
        <linearGradient id="robotBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#93C5FD" />
        </linearGradient>
        <linearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background digital classroom details (Grid/board) in soft blue */}
      <g className="text-blue-500/10 dark:text-blue-500/5" stroke="currentColor" strokeWidth="1">
        {/* Light digital blackboard outline */}
        <rect x="40" y="30" width="420" height="240" rx="6" strokeWidth="1.2" />
        {/* Hanging digital wires */}
        <line x1="120" y1="30" x2="120" y2="80" strokeWidth="0.8" />
        <line x1="380" y1="30" x2="380" y2="80" strokeWidth="0.8" />
        
        {/* Hanging nodes/diagram */}
        <circle cx="120" cy="80" r="3" />
        <circle cx="380" cy="80" r="3" />
        <line x1="120" y1="80" x2="150" y2="100" strokeWidth="0.8" />
        <circle cx="150" cy="100" r="2" />
      </g>

      {/* Soft blue glowing backdrop under the robot */}
      <ellipse cx="340" cy="310" rx="90" ry="15" fill="url(#glowGrad)" />

      {/* Ground shelf/desk surface */}
      <rect x="50" y="320" width="400" height="12" rx="2" fill="#E5E7EB" opacity="0.6" />

      {/* Table Plant (Teal) */}
      <g transform="translate(60, 240)">
        <path d="M 15 80 L 18 55 H 32 L 35 80 Z" fill="#D1D5DB" />
        <path d="M 25 55 C 10 35, 8 20, 2 25 C 2 40, 15 50, 25 55" fill="#0D9488" opacity="0.5" />
        <path d="M 25 55 C 40 35, 42 20, 48 25 C 48 40, 35 50, 25 55" fill="#0D9488" opacity="0.6" />
      </g>

      {/* Stack of books next to plant */}
      <g transform="translate(110, 285)">
        <rect x="0" y="20" width="55" height="15" rx="1" fill="#60A5FA" opacity="0.5" />
        <rect x="3" y="10" width="48" height="10" rx="1" fill="#3B82F6" opacity="0.6" />
        <rect x="6" y="0" width="42" height="10" rx="1" fill="#93C5FD" opacity="0.7" />
      </g>

      {/* ROBOT (Right Side) - Friendly, Cute style */}
      <g transform="translate(280, 130)">
        {/* Robot Base/Body */}
        <rect x="40" y="110" width="80" height="80" rx="25" fill="#F3F4F6" stroke="#93C5FD" strokeWidth="1.5" />
        {/* Blue LED Belly Screen */}
        <rect x="52" y="125" width="56" height="40" rx="8" fill="url(#robotBlueGrad)" />
        {/* Inner status graph on belly screen */}
        <path d="M 60 150 Q 70 135 80 145 T 100 135" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

        {/* Robot Head */}
        <rect x="45" y="45" width="70" height="55" rx="20" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
        {/* Head Screen Face */}
        <rect x="52" y="52" width="56" height="41" rx="14" fill="#1E293B" />
        {/* Glowing Screen Eyes (Happy curved arches) */}
        <path d="M 62 70 A 5 5 0 0 1 72 70" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 88 70 A 5 5 0 0 1 98 70" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
        {/* Cute screen cheeks */}
        <circle cx="59" cy="78" r="2" fill="#EF4444" opacity="0.6" />
        <circle cx="101" cy="78" r="2" fill="#EF4444" opacity="0.6" />

        {/* Robot Neck */}
        <rect x="70" y="98" width="20" height="14" rx="2" fill="#D1D5DB" />

        {/* Cute ears/side antennas */}
        <circle cx="42" cy="72" r="4" fill="#93C5FD" />
        <circle cx="118" cy="72" r="4" fill="#93C5FD" />
        {/* Top antenna */}
        <line x1="80" y1="45" x2="80" y2="30" stroke="#93C5FD" strokeWidth="1.5" />
        <circle cx="80" cy="28" r="3" fill="#60A5FA" />

        {/* Hands */}
        <path d="M 35 140 C 25 145, 10 160, 20 170 C 25 165, 35 155, 38 148" fill="#F3F4F6" stroke="#93C5FD" strokeWidth="1" />
        <path d="M 120 135 C 135 125, 145 105, 138 98 C 130 102, 122 120, 118 130" fill="#F3F4F6" stroke="#93C5FD" strokeWidth="1" />
      </g>

      {/* Laptop (in front of Robot) */}
      <g transform="translate(230, 275)">
        <path d="M 25 45 L 32 10 H 68 L 75 45 Z" fill="#D1D5DB" stroke="#93C5FD" strokeWidth="1.2" />
        <rect x="33" y="13" width="34" height="28" fill="url(#robotBlueGrad)" opacity="0.9" />
        <line x1="38" y1="20" x2="52" y2="20" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
        <line x1="38" y1="26" x2="62" y2="26" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
        <line x1="38" y1="32" x2="58" y2="32" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
        <path d="M 15 45 H 85 L 90 49 H 10 Z" fill="#9CA3AF" />
      </g>

      {/* Floating Chat Bubble */}
      <g transform="translate(180, 80) scale(0.9)" className="text-blue-500/20 dark:text-blue-500/10">
        <path d="M 10 10 H 90 A 6 6 0 0 1 96 16 V 44 A 6 6 0 0 1 90 50 H 30 L 15 62 V 50 A 6 6 0 0 1 10 44 V 16 A 6 6 0 0 1 10 10 Z" fill="currentColor" stroke="#60A5FA" strokeWidth="1" />
        <line x1="22" y1="22" x2="80" y2="22" stroke="#60A5FA" strokeWidth="1.2" opacity="0.6" />
        <line x1="22" y1="32" x2="68" y2="32" stroke="#60A5FA" strokeWidth="1.2" opacity="0.6" />
      </g>

      {/* Floating Learning Cards */}
      <g transform="translate(70, 110) rotate(-8) scale(0.9)">
        <rect x="0" y="0" width="80" height="55" rx="4" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1" />
        <circle cx="15" cy="15" r="4" fill="#60A5FA" />
        <line x1="25" y1="12" x2="70" y2="12" stroke="#D1D5DB" strokeWidth="1.5" />
        <line x1="12" y1="35" x2="68" y2="35" stroke="#E5E7EB" strokeWidth="2.5" />
        <line x1="12" y1="35" x2="48" y2="35" stroke="#3B82F6" strokeWidth="2.5" />
      </g>

      {/* Floating formulas */}
      <g className="text-blue-500/40 dark:text-blue-500/20 font-mono text-[10px]">
        <text x="70" y="80">y = mx + c</text>
        <text x="250" y="65">f(x) = ∫ x dx</text>
      </g>
    </svg>
  );
}
