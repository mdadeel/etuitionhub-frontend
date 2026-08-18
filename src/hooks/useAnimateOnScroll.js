import { useRef } from 'react';

// Scroll-reveal animation hook — intentionally neutralized.
//
// Design-system policy: content must render visible without JavaScript, and
// animation is limited to hover/active/focus/expand/dialog/toast/loading.
// The old implementation hid content behind `.animate-in-up`/`.scroll-reveal`
// until an IntersectionObserver fired (content stayed invisible if JS never
// ran). Callers keep using this hook for a stable ref; it performs no
// class-mutation and never hides content.
export default function useAnimateOnScroll() {
  return useRef(null);
}
