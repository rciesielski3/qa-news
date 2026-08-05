import { useState, useEffect } from 'react';
import type { Article } from '@/lib/types';
import { getArticlesForDate, getUTCToday, getYesterdayUTC, isDayBeforeRefreshTime } from '@/lib/dateUtils';

interface UseArticleDataResult {
  articles: Article[];
  updatedAt: string | null;
  isLoading: boolean;
  isUsingFallback: boolean;
}

export function useArticleData(): UseArticleDataResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch('/latest.json');
        const data = (await response.json()) as { updatedAt?: string; articles: Article[] };
        const allArticles = data.articles ?? [];
        const timestamp = data.updatedAt ?? null;

        if (cancelled) return;

        // Check if we have today's articles
        const today = getUTCToday();
        const todayArticles = getArticlesForDate(allArticles, today);

        // If we have today's articles, use them
        if (todayArticles.length > 0) {
          setArticles(todayArticles);
          setUpdatedAt(timestamp);
          setIsUsingFallback(false);
          setIsLoading(false);
          return;
        }

        // If no today's articles, try fallback to yesterday immediately
        // (show previous day's data while waiting for fresh data)
        const yesterday = getYesterdayUTC();
        const yesterdayArticles = getArticlesForDate(allArticles, yesterday);

        if (yesterdayArticles.length > 0) {
          setArticles(yesterdayArticles);
          setUpdatedAt(timestamp);
          setIsUsingFallback(true);
          setIsLoading(false);
          return;
        }

        // Otherwise use empty array (no data available at all)
        setArticles([]);
        setUpdatedAt(timestamp);
        setIsUsingFallback(false);
        setIsLoading(false);
      } catch (error) {
        if (!cancelled) {
          setArticles([]);
          setUpdatedAt(null);
          setIsUsingFallback(false);
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { articles, updatedAt, isLoading, isUsingFallback };
}
