'use client';

import { useEffect, useState } from 'react';

/**
 * Returns the id of the section that currently crosses the middle of the
 * viewport, or null before any section has been seen and again once the
 * reader scrolls back above the first section. Falls back to null when
 * IntersectionObserver is unavailable.
 */
export function useScrollSpy(ids: string[]): [string | null, (id: string) => void] {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join('|');
  const first = ids[0];

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          } else if (entry.target.id === first && (entry.boundingClientRect?.top ?? 0) > 0) {
            // The first section dropped below the reading line: the user is back
            // above it (hero in view), so no section is current.
            setActive(null);
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    key.split('|').forEach((id) => {
      const el = id ? document.getElementById(id) : null;
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [key, first]);

  return [active, setActive];
}
