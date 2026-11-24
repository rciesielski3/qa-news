'use client';

import { useEffect, useState } from 'react';

/**
 * Returns the id of the section that currently crosses the middle of the
 * viewport, or null before any section has been seen. Falls back to null when
 * IntersectionObserver is unavailable.
 */
export function useScrollSpy(ids: string[]): [string | null, (id: string) => void] {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join('|');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    key.split('|').forEach((id) => {
      const el = id ? document.getElementById(id) : null;
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [key]);

  return [active, setActive];
}
