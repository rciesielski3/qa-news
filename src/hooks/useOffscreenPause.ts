'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * True while the element is scrolled out of view. Used to pause decorative CSS
 * animations (animation-play-state) that would otherwise keep the compositor
 * busy off-screen. Without IntersectionObserver (SSR, old browsers, tests) it
 * stays false, so animations simply keep their normal finite run.
 */
export function useOffscreenPause(ref: RefObject<HTMLElement | null>, enabled = true): boolean {
  const [offscreen, setOffscreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      const last = entries[entries.length - 1];
      if (last) setOffscreen(!last.isIntersecting);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, enabled]);

  return offscreen;
}
