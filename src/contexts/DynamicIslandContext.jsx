import { createContext } from 'react';

export const DynamicIslandContext = createContext(null);

export const LAYOUT_PRESETS = {
  idle: {
    type: 'idle',
    width: 120,
    height: 34,
    radius: 50,
    bg: 'bg-white dark:bg-slate-900',
    glowClass: '',
    isHidden: true,
  },
  success: {
    type: 'success',
    width: 360,
    height: 64,
    radius: 32,
    bg: 'bg-white dark:bg-slate-900',
    glowClass: 'shadow-lg shadow-emerald-500/10 dark:shadow-emerald-500/20 border-emerald-100 dark:border-emerald-500/30',
  },
  error: {
    type: 'error',
    width: 360,
    height: 64,
    radius: 32,
    bg: 'bg-white dark:bg-slate-900',
    glowClass: 'shadow-lg shadow-red-500/10 dark:shadow-red-500/20 border-red-100 dark:border-red-500/30',
  },
  warning: {
    type: 'warning',
    width: 360,
    height: 64,
    radius: 32,
    bg: 'bg-white dark:bg-slate-900',
    glowClass: 'shadow-lg shadow-amber-500/10 dark:shadow-amber-500/20 border-amber-100 dark:border-amber-500/30',
  },
  info: {
    type: 'info',
    width: 200,
    height: 44,
    radius: 50,
    bg: 'bg-white dark:bg-slate-900',
    glowClass: 'shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20 border-blue-100 dark:border-blue-500/30',
  },
  process: {
    type: 'process',
    width: 340,
    height: 60,
    radius: 30,
    bg: 'bg-white dark:bg-slate-900',
    glowClass: 'shadow-lg shadow-purple-500/10 dark:shadow-purple-500/20 border-purple-100 dark:border-purple-500/30',
  },
  interactive: {
    type: 'interactive',
    width: 440,
    height: 160,
    radius: 38,
    bg: 'bg-white dark:bg-slate-900',
    glowClass: 'shadow-xl shadow-black/10 dark:shadow-black/40 border-slate-200 dark:border-white/10',
  }
};

