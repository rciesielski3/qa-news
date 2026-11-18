import { useState, useEffect } from 'react';

/** One repository from /trending.json (exported by ChiefOfStaff's GitHub trends job). */
export interface TrendingRepo {
  title: string; // owner/name
  url: string;
  description?: string;
  summary?: string;
  stars?: number;
  category?: string;
  publishedAt?: string; // repository created_at
}

function isTrendingRepo(value: unknown): value is TrendingRepo {
  const item = value as TrendingRepo | null;
  return !!item && typeof item.title === 'string' && typeof item.url === 'string';
}

/**
 * Fetch /trending.json client-side. Returns an empty list while loading, when the file
 * is missing, when the request fails or when the payload is malformed.
 */
export function useTrendingRepos(): TrendingRepo[] {
  const [repos, setRepos] = useState<TrendingRepo[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch('/trending.json');
        if (!response.ok) return;
        const data = (await response.json()) as { items?: unknown };
        if (cancelled || !Array.isArray(data?.items)) return;
        setRepos(data.items.filter(isTrendingRepo));
      } catch {
        // Optional section: stay hidden on any failure.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return repos;
}
