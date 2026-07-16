// Filtering logic for the QA News UX redesign.
//
// `Article` here is a lightweight shape used by client-side filtering
// (id, title, category, tags, url, publishedAt, isDailyPick). It is
// intentionally decoupled from `lib/types.ts`'s `Article` (the PAIOS
// Knowledge Layer contract) — this one only needs the fields filtering
// and rendering care about, and stays independent of API schema changes.

export type FilterState = {
  category?: string;
  tags?: string[];
};

export type Article = {
  id: string;
  title: string;
  category: string;
  tags?: string[];
  url: string;
  publishedAt: string;
  isDailyPick?: boolean;
};

/**
 * Filter articles published in the last N days (at start of today UTC, look back N-1 full days).
 * @param articles All articles from latest.json
 * @param daysAgo Number of days to look back (1 = today only, 7 = this week, 30 = this month)
 */
export function getArticlesSince(articles: Article[], daysAgo: number): Article[] {
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const cutoff = new Date(startOfToday.getTime() - (daysAgo - 1) * 24 * 60 * 60 * 1000);

  return articles.filter((article) => {
    if (!article.publishedAt) return false;
    const pubDate = new Date(article.publishedAt);
    return pubDate >= cutoff;
  });
}

export function getTodayArticles(articles: Article[]): Article[] {
  return getArticlesSince(articles, 1);
}

export function getWeekArticles(articles: Article[]): Article[] {
  return getArticlesSince(articles, 7);
}

export function getMonthArticles(articles: Article[]): Article[] {
  return getArticlesSince(articles, 30);
}

export function applyFilters<T extends Article>(articles: T[], filters: FilterState): T[] {
  // If no filters, return all articles
  if (!filters.category && (!filters.tags || filters.tags.length === 0)) {
    return articles;
  }

  return articles.filter((article) => {
    // Category must match (if specified)
    if (filters.category && article.category !== filters.category) {
      return false;
    }

    // Tags: OR logic (any tag matches) — if no tags filtered, skip this check
    if (filters.tags && filters.tags.length > 0) {
      const matchesTags = filters.tags.some((tag) => article.tags?.includes(tag));
      if (!matchesTags) {
        return false;
      }
    }

    return true;
  });
}

export function parseFilterParams(searchParams: Record<string, string | string[]>): FilterState {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const tagsParam = searchParams.tags;
  const tags = typeof tagsParam === 'string' ? tagsParam.split(',').filter(Boolean) : undefined;

  return { category, tags };
}

export function serializeFilterParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.tags && filters.tags.length > 0) params.set('tags', filters.tags.join(','));
  return params;
}
