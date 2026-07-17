import { useState, useEffect } from 'react';
import type { Article } from '@/lib/types';
import { getArticlesForDate, getUTCToday, getYesterdayUTC, isDayBeforeRefreshTime } from '@/lib/dateUtils';

interface UseArticleDataResult {
  articles: Article[];
  isLoading: boolean;
  isUsingFallback: boolean;
}

export function useArticleData(): UseArticleDataResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch('/latest.json');
        const data = (await response.json()) as { articles: Article[] };
        const allArticles = data.articles ?? [];

        if (cancelled) return;

        // Check if we have today's articles
        const today = getUTCToday();
        const todayArticles = getArticlesForDate(allArticles, today);

        // If no today's articles and before refresh time, try fallback
        if (todayArticles.length === 0 && isDayBeforeRefreshTime()) {
          const yesterday = getYesterdayUTC();
          const yesterdayArticles = getArticlesForDate(allArticles, yesterday);

          if (yesterdayArticles.length > 0) {
            setArticles(yesterdayArticles);
            setIsUsingFallback(true);
            setIsLoading(false);
            return;
          }
        }

        // Otherwise use today's articles (or empty if none)
        setArticles(todayArticles);
        setIsUsingFallback(false);
        setIsLoading(false);
      } catch (error) {
        if (!cancelled) {
          setArticles([]);
          setIsUsingFallback(false);
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { articles, isLoading, isUsingFallback };
}
