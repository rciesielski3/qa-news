import { useState, useEffect } from 'react';
import type { Article } from '@/lib/types';
import { computeDailyWindow, type DailyWindow } from '@/lib/dailyWindow';

interface UseArticleDataResult {
  /** Articles of the Daily window (the 24 hours ending at `updatedAt`). */
  articles: Article[];
  /** Every article in latest.json (used for the hero statistics). */
  allArticles: Article[];
  /** The window the feed shows; null while loading or when there is no data to anchor it. */
  window: DailyWindow | null;
  updatedAt: string | null;
  isLoading: boolean;
}

const NO_ARTICLES: Article[] = [];

export function useArticleData(): UseArticleDataResult {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [window, setWindow] = useState<DailyWindow | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch('/latest.json');
        const data = (await response.json()) as { updatedAt?: string; articles: Article[] };
        if (cancelled) return;
        const list = data.articles ?? [];
        setAllArticles(list);
        setUpdatedAt(data.updatedAt ?? null);
        setWindow(computeDailyWindow(list, data.updatedAt));
        setIsLoading(false);
      } catch {
        if (!cancelled) {
          setAllArticles([]);
          setWindow(null);
          setUpdatedAt(null);
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { articles: window?.articles ?? NO_ARTICLES, allArticles, window, updatedAt, isLoading };
}
