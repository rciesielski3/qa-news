'use client';

import { useEffect, useRef, useState } from 'react';

/** True when animation is allowed: matchMedia exists and the user has not asked for reduced motion. */
export function motionAllowed(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const REVEAL_FALLBACK_MS = 3000;

type Phase = 'idle' | 'armed' | 'in' | 'done';

/**
 * Blur-fade-in on first scroll into view.
 *
 * The hidden state is applied only after mount, only when IntersectionObserver
 * exists, motion is allowed and the element starts below the viewport, so
 * server-rendered HTML, tests, above-the-fold tiles and reduced-motion users
 * always see the content without a hide/show flash. Returns a ref and the class names to put on the
 * element (`reveal` hides it, `reveal in` shows it; both are removed once settled
 * so they never interfere with hover transforms).
 */
export function useReveal<T extends HTMLElement = HTMLElement>(delayMs = 0) {
  const ref = useRef<T>(null);
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed() || typeof IntersectionObserver === 'undefined') return;

    // Content already in (or above) the first viewport must never flash
    // visible -> hidden -> visible, and an element with no box (display:none
    // ancestor, zero height) can never intersect, so neither is armed.
    const rect = el.getBoundingClientRect();
    const hasBox = el.getClientRects().length > 0 && rect.width > 0 && rect.height > 0;
    if (!hasBox || rect.top < window.innerHeight) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    setPhase('armed');
    // Safety net: if the element is still boxless later (it was laid out after
    // mount, or hidden afterwards) the observer will not fire; show it anyway.
    timers.push(
      setTimeout(() => {
        if (el.getClientRects().length === 0 || el.getBoundingClientRect().height === 0) {
          observer.disconnect();
          setPhase('done');
        }
      }, REVEAL_FALLBACK_MS),
    );
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
