/**
 * Calculate articles per page based on viewport height.
 * Assumes ~80px per article row + header/filters overhead.
 * Leaves ~100px margin for pagination controls.
 */
export function calculateArticlesPerPage(viewportHeight: number): number {
  const ARTICLE_ROW_HEIGHT = 80;
  const HEADER_FILTERS_HEIGHT = 300;
  const PAGINATION_MARGIN = 100;

  const availableHeight = viewportHeight - HEADER_FILTERS_HEIGHT - PAGINATION_MARGIN;
  const articlesPerPage = Math.max(3, Math.floor(availableHeight / ARTICLE_ROW_HEIGHT));

  return articlesPerPage;
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
