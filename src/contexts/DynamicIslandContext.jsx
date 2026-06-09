import { createContext } from 'react';

export const DynamicIslandContext = createContext(null);

export const LAYOUT_PRESETS = {
  idle: {
    type: 'idle',
    width: 110,
    height: 30,
    radius: 9999,
    bg: 'bg-transparent border-transparent',
    glowClass: '',
    isHidden: true,
  },
  success: {
    type: 'success',
    width: 320,
    height: 54,
    radius: 20,
    bg: 'bg-emerald-950/90 border border-emerald-500/20 text-emerald-300',
    glowClass: 'shadow-[0_0_20px_rgba(34,197,94,0.15)] shadow-emerald-500/10',
  },
  error: {
    type: 'error',
    width: 320,
    height: 54,
    radius: 20,
    bg: 'bg-rose-950/90 border border-rose-500/20 text-rose-300',
    glowClass: 'shadow-[0_0_20px_rgba(239,68,68,0.15)] shadow-rose-500/10',
  },
  warning: {
    type: 'warning',
    width: 320,
    height: 54,
    radius: 20,
    bg: 'bg-amber-950/90 border border-amber-500/20 text-amber-300',
    glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.15)] shadow-amber-500/10',
  },
  info: {
    type: 'info',
    width: 320,
    height: 54,
    radius: 20,
    bg: 'bg-slate-950/95 border border-blue-500/20 text-blue-300',
    glowClass: 'shadow-[0_0_20px_rgba(37,99,235,0.15)] shadow-blue-500/10',
  },
  process: {
    type: 'process',
    width: 340,
    height: 60,
    radius: 22,
    bg: 'bg-slate-950/95 border border-blue-500/20 text-zinc-300',
    glowClass: 'shadow-[0_0_25px_rgba(37,99,235,0.2)] shadow-blue-500/10',
  },
  interactive: {
    type: 'interactive',
    width: 380,
    height: 120,
    radius: 28,
    bg: 'bg-slate-950/98 border border-white/10 text-zinc-300',
    glowClass: 'shadow-[0_0_30px_rgba(37,99,235,0.25)] shadow-blue-500/15',
  }
};

