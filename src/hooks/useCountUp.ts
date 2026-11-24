'use client';

import { useEffect, useRef, useState } from 'react';
import { motionAllowed } from '@/hooks/useReveal';

/**
 * Animates a number towards `to` whenever it changes (ease-out, ~1.1s).
 * Without motion (reduced-motion, no matchMedia, tests) it returns `to` immediately.
 */
export function useCountUp(to: number, duration = 1100): number {
  const [value, setValue] = useState(0);
  const shown = useRef(0);

  useEffect(() => {
    if (!motionAllowed()) {
      shown.current = to;
      setValue(to);
      return;
    }
    const from = shown.current;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - k, 4);
      const next = Math.round(from + (to - from) * eased);
      shown.current = next;
      setValue(next);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  return value;
}
