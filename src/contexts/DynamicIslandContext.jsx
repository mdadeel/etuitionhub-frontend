import { createContext } from 'react';

export const DynamicIslandContext = createContext(null);

export const LAYOUT_PRESETS = {
  idle: {
    type: 'idle',
    width: 120,
    height: 34,
    radius: 50,
    bg: 'bg-popover/90 text-popover-foreground',
    glowClass: '',
    isHidden: true,
  },
  success: {
    type: 'success',
    width: 360,
    height: 64,
    radius: 32,
    bg: 'bg-popover/90 text-popover-foreground',
    glowClass: 'shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-success/30',
  },
  error: {
    type: 'error',
    width: 360,
    height: 64,
    radius: 32,
    bg: 'bg-popover/90 text-popover-foreground',
    glowClass: 'shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-destructive/30',
  },
  warning: {
    type: 'warning',
    width: 360,
    height: 64,
    radius: 32,
    bg: 'bg-popover/90 text-popover-foreground',
    glowClass: 'shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-warning/30',
  },
  info: {
    type: 'info',
    width: 200,
    height: 44,
    radius: 50,
    bg: 'bg-popover/90 text-popover-foreground',
    glowClass: 'shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-primary/30',
  },
  process: {
    type: 'process',
    width: 340,
    height: 60,
    radius: 30,
    bg: 'bg-popover/90 text-popover-foreground',
    glowClass: 'shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-accent/40',
  },
  interactive: {
    type: 'interactive',
    width: 440,
    height: 160,
    radius: 38,
    bg: 'bg-popover/90 text-popover-foreground',
    glowClass: 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] border-border',
  }
};

