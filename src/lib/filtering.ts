/**
 * Filtering logic for the QA News UX redesign.
 *
 * **Case Sensitivity Behavior:**
 *
 * This module performs **case-sensitive exact matching** for both category and tag filters.
 * All filtering functions assume that input data (categories and tags) have been normalized
 * to a consistent case by the data provider (RSS pipeline/data source).
 *
 * **Key Assumptions:**
 * - Categories are normalized to lowercase by the data source (e.g., 'ai', 'test-automation')
 * - Tags are normalized to lowercase by the data source (e.g., 'llm', 'prompt-engineering')
 * - Filter parameters (categories, tags) passed via URL search params are expected to match
 *   the case convention used by the data source
 * - The filtering layer does NOT perform any case normalization; it relies on upstream
 *   normalization to ensure consistency
 *
 * **Examples:**
 * - Filtering by `category: 'ai'` will NOT match articles with `category: 'AI'` or `category: 'Ai'`
 * - Filtering by `tags: ['llm']` will NOT match articles with `tags: ['LLM']` or `tags: ['Llm']`
 * - Comma-separated tags in URL params are split and trimmed but NOT lowercased
 *   (e.g., `tags=llm,prompt-engineering` → `['llm', 'prompt-engineering']`)
 *
 * **Why No Normalization Here:**
 * The filtering layer intentionally avoids normalization to maintain a clear separation of concerns:
 * - Data normalization happens once at the source (RSS pipeline)
 * - Filtering operates on already-normalized data
 * - This approach is more performant and keeps filtering logic simple and predictable
 */

import type { Article as TypesArticle, Category } from '@/lib/types';
import { generateSummary } from '@/lib/summarize';

export type FilterState = {
  category?: string;
  tags?: string[];
};

// Re-export the full Article type from types.ts
export type Article = TypesArticle;

/**
 * Filter articles published in the last N days (at start of today UTC, look back N-1 full days).
 *
 * **Case Sensitivity:** Not applicable — this function filters by date only.
 *
 * **Note on Summary Normalization:**
 * This function normalizes article summaries to 2-3 sentences (~150 chars) using {@link generateSummary}.
 * This is separate from category/tag case normalization; it ensures consistent display in the UI
 * even when RSS descriptions vary in length.
 *
 * @param articles All articles from latest.json
 * @param daysAgo Number of days to look back (1 = today only, 7 = this week, 30 = this month)
 * @returns Articles published within the specified date range, with normalized summaries
 *
 * @example
 * // Get articles from the last 7 days
 * const weekArticles = getArticlesSince(allArticles, 7);
 */
export function getArticlesSince(articles: Article[], daysAgo: number): Article[] {
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const cutoff = new Date(startOfToday.getTime() - (daysAgo - 1) * 24 * 60 * 60 * 1000);

  return articles
    .filter((article) => {
      if (!article.publishedAt) return false;
      const pubDate = new Date(article.publishedAt);
      return pubDate >= cutoff;
    })
    .map((article) => ({
      ...article,
      // Normalize to a 2-3 sentence, ~150 char summary. The RSS pipeline
      // doesn't always cap description length, and articles missing a
      // summary entirely fall back to the title so the UI never renders
      // a blank summary field.
      summary: generateSummary(article.summary || article.title || ''),
    }));
}

/**
 * Get articles published today (UTC).
 *
 * **Case Sensitivity:** Not applicable — this function filters by date only.
 *
 * @param articles All articles from latest.json
 * @returns Articles published today
 * @see {@link getArticlesSince} for implementation details
 */
export function getTodayArticles(articles: Article[]): Article[] {
  return getArticlesSince(articles, 1);
}

/**
 * Get articles published in the current week (last 7 days, UTC).
 *
 * **Case Sensitivity:** Not applicable — this function filters by date only.
 *
 * @param articles All articles from latest.json
 * @returns Articles published in the last 7 days
 * @see {@link getArticlesSince} for implementation details
 */
export function getWeekArticles(articles: Article[]): Article[] {
  return getArticlesSince(articles, 7);
}

/**
 * Get articles published in the current month (last 30 days, UTC).
 *
 * **Case Sensitivity:** Not applicable — this function filters by date only.
 *
 * @param articles All articles from latest.json
 * @returns Articles published in the last 30 days
 * @see {@link getArticlesSince} for implementation details
 */
export function getMonthArticles(articles: Article[]): Article[] {
  return getArticlesSince(articles, 30);
}

/**
 * Apply category and tag filters to articles.
 *
 * **Filter Logic:**
 * - Category: AND logic (article.category must exactly match filters.category if specified)
 * - Tags: OR logic (article must match at least one tag if tags filter is specified)
 * - Combined: AND between category and tags (both must match if both are specified)
 *
 * **Case Sensitivity:**
 * Both category and tag filters use **case-sensitive exact matching** via strict equality (===)
 * and Array.includes(). No normalization is performed; all inputs are compared as-is.
 *
 * This means:
 * - Category 'ai' will NOT match articles with category 'AI', 'Ai', or 'aI'
 * - Tag 'llm' will NOT match articles with tags 'LLM', 'Llm', or 'lLm'
 *
 * **Assumptions:**
 * - All article categories and tags are pre-normalized to a consistent case (typically lowercase)
 *   by the data source (RSS pipeline)
 * - Filter parameters are expected to use the same case convention as the source data
 * - If filters don't match any articles, it's likely a case mismatch rather than data absence
 *
 * **Examples:**
 * ```typescript
 * // Will match articles with category 'ai' and any of the tags 'llm' or 'agents'
 * applyFilters(articles, { category: 'ai', tags: ['llm', 'agents'] })
 *
 * // Will match articles with category 'ai' (tags ignored)
 * applyFilters(articles, { category: 'ai' })
 *
 * // Will match articles with any of the tags 'jest' or 'testing'
 * applyFilters(articles, { tags: ['jest', 'testing'] })
 *
 * // Returns all articles (no filters specified)
 * applyFilters(articles, {})
 * ```
 *
 * @template T Extends Article type
 * @param articles Array of articles to filter
 * @param filters FilterState object with optional category and tags
 * @returns Filtered array of articles matching the specified criteria
 */
export function applyFilters<T extends Article>(articles: T[], filters: FilterState): T[] {
  // If no filters, return all articles
  if (!filters.category && (!filters.tags || filters.tags.length === 0)) {
    return articles;
  }

  return articles.filter((article) => {
    // Category must match exactly (case-sensitive) if specified
    if (filters.category && article.category !== filters.category) {
      return false;
    }

    // Tags: OR logic (any tag matches, case-sensitive) — if no tags filtered, skip this check
    if (filters.tags && filters.tags.length > 0) {
      const matchesTags = filters.tags.some((tag) => article.tags?.includes(tag));
      if (!matchesTags) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Parse URL search parameters into a FilterState object.
 *
 * **Case Sensitivity:**
 * This function does NOT normalize case. It extracts and trims the raw values from URL params,
 * preserving the case as provided in the URL.
 *
 * **Processing Details:**
 * - Category: Extracted as-is (no normalization)
 * - Tags: Split by comma, each tag is trimmed of whitespace, case is preserved
 * - Empty tags are filtered out (e.g., 'llm,,agents' → ['llm', 'agents'])
 *
 * **Important:** The caller is responsible for ensuring filter parameters match the case
 * convention used by the data source. If a filter doesn't return results, first check for
 * case mismatches (e.g., URL has 'AI' but articles have 'ai').
 *
 * @param searchParams URL search parameters object (typically from URL.searchParams or Next.js router.query)
 * @returns FilterState object ready for use with {@link applyFilters}
 *
 * @example
 * // URL: ?category=ai&tags=llm,prompt-engineering
 * const filters = parseFilterParams({ category: 'ai', tags: 'llm,prompt-engineering' });
 * // Returns: { category: 'ai', tags: ['llm', 'prompt-engineering'] }
 *
 * @example
 * // URL: ?tags=jest, testing , agents
 * const filters = parseFilterParams({ tags: 'jest, testing , agents' });
 * // Returns: { tags: ['jest', 'testing', 'agents'] } (whitespace trimmed, case preserved)
 *
 * @example
 * // URL: ?category=AI (note: uppercase)
 * const filters = parseFilterParams({ category: 'AI' });
 * // Returns: { category: 'AI' } (case preserved as-is; may not match articles if they use 'ai')
 */
export function parseFilterParams(searchParams: Record<string, string | string[]>): FilterState {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const tagsParam = searchParams.tags;
  const tags = typeof tagsParam === 'string'
    ? tagsParam.split(',').map((tag) => tag.trim()).filter(Boolean)
    : undefined;

  return { category, tags };
}

/**
 * Serialize a FilterState object into URL search parameters.
 *
 * **Case Sensitivity:**
 * This function preserves the case of the input FilterState as-is. No normalization is performed.
 * Tags are joined with commas (no spaces added).
 *
 * **Processing Details:**
 * - Category: Serialized as-is to 'category' param (if defined)
 * - Tags: Joined by commas and set to 'tags' param (if non-empty)
 * - Empty filters result in an empty URLSearchParams object
 *
 * @param filters FilterState object to serialize
 * @returns URLSearchParams ready for use in URLs (e.g., `?${params.toString()}`)
 *
 * @example
 * // Serialize to URL string
 * const filters = { category: 'ai', tags: ['llm', 'agents'] };
 * const params = serializeFilterParams(filters);
 * const url = `https://example.com?${params.toString()}`;
 * // url: 'https://example.com?category=ai&tags=llm%2Cagents'
 *
 * @example
 * // Only tags
 * const filters = { tags: ['jest', 'testing'] };
 * const params = serializeFilterParams(filters);
 * // params.toString(): 'tags=jest%2Ctesting'
 *
 * @example
 * // Empty filters
 * const filters = {};
 * const params = serializeFilterParams(filters);
 * // params.toString(): ''
 */
export function serializeFilterParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.tags && filters.tags.length > 0) params.set('tags', filters.tags.join(','));
  return params;
}
