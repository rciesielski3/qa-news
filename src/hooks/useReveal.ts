'use client';

import { useEffect, useRef, useState } from 'react';

/** True when animation is allowed: matchMedia exists and the user has not asked for reduced motion. */
export function motionAllowed(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

type Phase = 'idle' | 'armed' | 'in' | 'done';

/**
 * Blur-fade-in on first scroll into view.
 *
 * The hidden state is applied only after mount, only when IntersectionObserver
 * exists and motion is allowed, so server-rendered HTML, tests and reduced-motion
 * users always see the content. Returns a ref and the class names to put on the
 * element (`reveal` hides it, `reveal in` shows it; both are removed once settled
 * so they never interfere with hover transforms).
 */
export function useReveal<T extends HTMLElement = HTMLElement>(delayMs = 0) {
  const ref = useRef<T>(null);
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed() || typeof IntersectionObserver === 'undefined') return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    setPhase('armed');
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        timers.push(setTimeout(() => setPhase('in'), delayMs));
        timers.push(setTimeout(() => setPhase('done'), delayMs + 1000));
      },
      { threshold: 0.12 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [delayMs]);

  const className = phase === 'armed' ? 'reveal' : phase === 'in' ? 'reveal in' : '';
  return { ref, className };
}

/** Stagger helper: 70ms per sibling, capped so long lists do not wait forever. */
export function staggerDelay(index: number): number {
  return Math.min(index, 8) * 70;
}
