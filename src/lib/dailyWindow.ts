import type { Article } from '@/lib/types';

export const WINDOW_MS = 24 * 60 * 60 * 1000;
/** The "latest update is N hours old" notice appears once the data is older than this. */
export const STALE_AFTER_HOURS = 30;

export interface DailyWindow {
  /** Articles inside the window, in their original order. */
  articles: Article[];
  /** Window start (exclusive), epoch ms; null when there is nothing to anchor a window to. */
  startMs: number | null;
  /** Window end (inclusive), epoch ms; null when there is nothing to anchor a window to. */
  endMs: number | null;
  /** True when the window ends at `updatedAt` (as opposed to the newest article). */
  anchoredToUpdate: boolean;
}

function parseMs(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? null : ms;
}

function newestArticleMs(articles: Article[]): number | null {
  let best: number | null = null;
  for (const article of articles) {
    const ms = parseMs(article.publishedAt);
    if (ms !== null && (best === null || ms > best)) best = ms;
  }
  return best;
}

function inWindow(articles: Article[], startMs: number, endMs: number): Article[] {
  return articles.filter((article) => {
    const ms = parseMs(article.publishedAt);
    // Start is exclusive and end inclusive: an article exactly 24h before the end
    // belongs to the previous window, one published at the end instant to this one.
    return ms !== null && ms > startMs && ms <= endMs;
  });
}

/**
 * The Daily feed window: the 24 hours ending at the data's `updatedAt`. When
 * `updatedAt` is missing or unreadable the newest article's time ends the window
 * instead; when the window holds nothing (stale data) the 24 hours before the
 * newest article are used. Pure: never reads the clock, so the result depends on
 * the data alone.
 */
export function computeDailyWindow(articles: Article[], updatedAt?: string | null): DailyWindow {
  const newest = newestArticleMs(articles);
  const updatedMs = parseMs(updatedAt);
  const endMs = updatedMs ?? newest;
  if (endMs === null) return { articles: [], startMs: null, endMs: null, anchoredToUpdate: false };

  const inRange = inWindow(articles, endMs - WINDOW_MS, endMs);
  if (inRange.length > 0 || newest === null) {
    return { articles: inRange, startMs: endMs - WINDOW_MS, endMs, anchoredToUpdate: updatedMs !== null };
  }
  return {
    articles: inWindow(articles, newest - WINDOW_MS, newest),
    startMs: newest - WINDOW_MS,
    endMs: newest,
    anchoredToUpdate: false,
  };
}

/** Whole hours between `updatedAt` and `nowMs` when that exceeds STALE_AFTER_HOURS, else null. */
export function staleHours(updatedAt: string | null | undefined, nowMs: number | null): number | null {
  const updatedMs = parseMs(updatedAt);
  if (updatedMs === null || nowMs === null) return null;
  const hours = (nowMs - updatedMs) / (60 * 60 * 1000);
  return hours > STALE_AFTER_HOURS ? Math.floor(hours) : null;
}

/** "06:30 UTC" for an epoch ms. */
export function formatUtcTime(ms: number): string {
  return `${new Date(ms).toISOString().slice(11, 16)} UTC`;
}
