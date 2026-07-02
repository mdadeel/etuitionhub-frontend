import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Import all SVG decorations from assets folder
import PaperAirplane from '../../../assets/decorations/PaperAirplane';
import Leaf from '../../../assets/decorations/Leaf';
import Sparkle from '../../../assets/decorations/Sparkle';
import Book from '../../../assets/decorations/Book';
import Pencil from '../../../assets/decorations/Pencil';
import Ruler from '../../../assets/decorations/Ruler';
import Calculator from '../../../assets/decorations/Calculator';
import Atom from '../../../assets/decorations/Atom';
import GraduationCap from '../../../assets/decorations/GraduationCap';
import Paperclip from '../../../assets/decorations/Paperclip';
import StickyNote from '../../../assets/decorations/StickyNote';
import SpeechBubble from '../../../assets/decorations/SpeechBubble';
import Globe from '../../../assets/decorations/Globe';

const decorationMap = {
  'paper-airplane': PaperAirplane,
  'leaf': Leaf,
  'sparkle': Sparkle,
  'book': Book,
  'pencil': Pencil,
  'ruler': Ruler,
  'calculator': Calculator,
  'atom': Atom,
  'graduation-cap': GraduationCap,
  'paperclip': Paperclip,
  'sticky-note': StickyNote,
  'speech-bubble': SpeechBubble,
  'globe': Globe,
};

export default function Decoration({ name, className, animateVariant, ...props }) {
  const Comp = decorationMap[name];
  if (!Comp) return null;

  // Configure Framer Motion properties for unified, non-distracting animation styles
  let animateProps = {};

  if (animateVariant === 'twinkle' || name === 'sparkle') {
    animateProps = {
      animate: { opacity: [0.3, 0.9, 0.3] },
      transition: { duration: 6 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" }
    };
  } else if (animateVariant === 'sway' || name === 'leaf') {
    animateProps = {
      animate: { rotate: [-5, 5, -5] },
      transition: { duration: 8 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" }
    };
  } else if (animateVariant === 'float' || name === 'paper-airplane') {
    animateProps = {
      animate: { y: [-3, 3, -3] },
      transition: { duration: 9 + Math.random() * 3, repeat: Infinity, ease: "easeInOut" }
    };
  } else {
    // Default tiny float for stationery elements (pencil, ruler, etc.)
    animateProps = {
      animate: { y: [-1.5, 1.5, -1.5] },
      transition: { duration: 10 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" }
    };
  }

  return (
    <motion.div 
      className={cn("select-none pointer-events-none w-6 h-6 shrink-0", className)}
      {...animateProps}
      {...props}
    >
      <Comp className="w-full h-full" />
    </motion.div>
  );
}
