import { cn } from '@/lib/utils';

export default function Campus({ className }) {
  return (
    <svg viewBox="0 0 800 200" fill="none" stroke="currentColor" strokeWidth="1" className={cn("select-none pointer-events-none text-primary", className)}>
      {/* Curzon Hall silhouette shape (Dhaka University landmark) */}
      <path d="M 10 200 L 40 160 H 80 L 110 200 M 110 200 H 130 V 160 H 155 V 125 H 165 V 110 H 175 V 125 H 185 V 160 H 210 V 200 M 210 200 H 250 V 150 H 290 V 135 H 300 V 100 H 310 V 135 H 320 V 150 H 360 V 200 M 360 200 H 390 V 170 H 425 V 130 H 435 V 110 H 445 V 130 H 455 V 170 H 490 V 200 M 490 200 H 530 V 155 H 570 V 120 H 585 V 115 H 600 V 120 H 615 V 155 H 655 V 200 M 655 200 H 680 V 160 H 705 V 125 H 715 V 110 H 725 V 125 H 735 V 160 H 760 V 200 H 790" 
        strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Dotted lines/connectors */}
      <path d="M 40 130 Q 150 70, 300 120 T 580 90 T 740 140" strokeWidth="1" strokeDasharray="3 4" opacity="0.4" />
      <circle cx="150" cy="85" r="3" />
      <circle cx="580" cy="90" r="3" />
    </svg>
  );
}
