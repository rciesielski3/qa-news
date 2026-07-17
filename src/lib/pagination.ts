/**
 * Calculate articles per page based on viewport height.
 *
 * Uses a small fixed overhead for controls/margins rather than trying to
 * account for the full page chrome. Trade-off: the brief section (top-pick
 * cards) sits above the list and its height varies by viewport — especially
 * when the cards stack to a single column on mobile. That section is outside
 * this utility's control, so a perfect "no vertical scroll" guarantee isn't
 * possible here; this assumes the brief is above the fold on most screens.
 * If a strict no-scroll guarantee is ever required, the brief section's
 * measured height would need to feed into this calculation.
 */
export function calculateArticlesPerPage(viewportHeight: number): number {
  const ARTICLE_HEIGHT = 80;
  const MIN_OVERHEAD = 200; // Absolute minimum for controls/margins

  const available = Math.max(viewportHeight - MIN_OVERHEAD, ARTICLE_HEIGHT * 3);
  return Math.max(3, Math.floor(available / ARTICLE_HEIGHT));
}

/**
 * Get a page of articles from the full list.
 */
export function paginateArticles<T>(
  articles: T[],
  pageNumber: number,
  perPage: number
): T[] {
  const startIndex = (pageNumber - 1) * perPage;
  const endIndex = startIndex + perPage;
  return articles.slice(startIndex, endIndex);
}

/**
 * Calculate total number of pages needed.
 */
export function getTotalPages(totalArticles: number, perPage: number): number {
  return Math.ceil(totalArticles / perPage);
}

/**
 * Clamp page number to valid range (1 to total pages).
 */
export function clampPageNumber(pageNumber: number, totalPages: number): number {
  return Math.max(1, Math.min(pageNumber, totalPages));
}
