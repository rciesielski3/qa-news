'use client';

import type { ReactNode } from 'react';
import { staggerDelay, useReveal } from '@/hooks/useReveal';
import { useOffscreenPause } from '@/hooks/useOffscreenPause';

/**
 * Bento tile for the content pages (About, How it works): the same blur-fade
 * reveal and offscreen animation pause as the Daily hero tiles. Content stays
 * visible without JS, in tests and for reduced-motion users (see useReveal).
 */
export default function ContentTile({
  className = '',
  index = 0,
  pauseOffscreen = false,
  children,
}: {
  className?: string;
  /** Position among siblings, for the reveal stagger. */
  index?: number;
  pauseOffscreen?: boolean;
  children: ReactNode;
}) {
  const { ref, className: reveal } = useReveal<HTMLDivElement>(staggerDelay(index));
  const offscreen = useOffscreenPause(ref, pauseOffscreen);
  return (
    <div ref={ref} className={`tile ${className} ${reveal}${offscreen ? ' paused' : ''}`.replace(/\s+/g, ' ').trim()}>
      {children}
    </div>
  );
}
