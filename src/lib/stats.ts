import type { Article, Category } from '@/lib/types';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Days shown in the "Published today" sparkline. */
export const SPARK_DAYS = 14;
/** Window (in days, reference day included) for the category coverage bars. */
export const COVERAGE_DAYS = 30;
/** Number of sources listed in the "Top sources" tile. */
export const TOP_SOURCES = 3;

export interface SourceStat {
  name: string;
  count: number;
  /** Share of all articles, 0-100, rounded. */
  pct: number;
}

export interface CategoryStat {
  category: Category;
  count: number;
}

export interface Stats {
  /** Reference day (UTC, YYYY-MM-DD) that "today" figures are computed for. */
  refDay: string;
  /** All articles in the dataset. */
  total: number;
  /** Distinct source names. */
  sourceCount: number;
  /** Articles published on the reference day. */
  todayCount: number;
  /** Per-day counts for the SPARK_DAYS days ending on the reference day (oldest first). */
  spark: number[];
  /** Reference day vs the average of the 13 days before it, in percent; null when there is no baseline. */
  deltaPct: number | null;
  /** Top sources by article count (ties broken alphabetically). */
  topSources: SourceStat[];
  /** Articles per category within the last COVERAGE_DAYS days, most covered first; empty categories are omitted. */
  categories: CategoryStat[];
}

/** UTC day key (YYYY-MM-DD) for an ISO string, or null when it cannot be parsed. */
function dayKey(iso: string | undefined): string | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return null;
  return new Date(ms).toISOString().slice(0, 10);
}

function dayStartMs(key: string): number {
  return Date.parse(`${key}T00:00:00.000Z`);
}

/** The most recent UTC day that has at least one article, or null for empty/unreadable data. */
export function latestArticleDay(articles: Article[]): string | null {
  let best: string | null = null;
  for (const article of articles) {
    const key = dayKey(article.publishedAt);
    if (key && (best === null || key > best)) best = key;
  }
  return best;
}

/**
 * Derive every number shown in the hero tiles from the article list. Pure: the
 * reference day is an argument (defaults to the newest day in the data), so the
 * result never depends on the wall clock.
 */
export function computeStats(articles: Article[], refDay?: Date | string | null): Stats {
  const ref =
    refDay instanceof Date
      ? refDay.toISOString().slice(0, 10)
      : refDay || latestArticleDay(articles) || new Date().toISOString().slice(0, 10);
  const refStart = dayStartMs(ref);

  const perDay = new Map<string, number>();
  const perSource = new Map<string, number>();
  const perCategory = new Map<Category, number>();
  const coverageFrom = refStart - (COVERAGE_DAYS - 1) * DAY_MS;

  for (const article of articles) {
    const source = article.source?.trim();
    if (source) perSource.set(source, (perSource.get(source) ?? 0) + 1);

    const key = dayKey(article.publishedAt);
    if (!key) continue;
    perDay.set(key, (perDay.get(key) ?? 0) + 1);

    const start = dayStartMs(key);
    if (start >= coverageFrom && start <= refStart) {
      perCategory.set(article.category, (perCategory.get(article.category) ?? 0) + 1);
    }
  }

  const spark: number[] = [];
  for (let i = SPARK_DAYS - 1; i >= 0; i--) {
    const key = new Date(refStart - i * DAY_MS).toISOString().slice(0, 10);
    spark.push(perDay.get(key) ?? 0);
  }

  const todayCount = spark[SPARK_DAYS - 1];
  const baseline = spark.slice(0, SPARK_DAYS - 1);
  const avg = baseline.reduce((sum, n) => sum + n, 0) / baseline.length;
  const deltaPct = avg > 0 ? Math.round(((todayCount - avg) / avg) * 100) : null;

  const total = articles.length;
  const topSources = [...perSource.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, TOP_SOURCES)
    .map(([name, count]) => ({ name, count, pct: total > 0 ? Math.round((count / total) * 100) : 0 }));

  const categories = [...perCategory.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));

  return {
    refDay: ref,
    total,
    sourceCount: perSource.size,
    todayCount,
    spark,
    deltaPct,
    topSources,
    categories,
  };
}

/** "5m ago" / "3h ago" / "2d ago" for an ISO timestamp, relative to nowMs. Empty string if unreadable. */
export function formatAgo(iso: string | null | undefined, nowMs: number): string {
  if (!iso) return '';
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return '';
  const minutes = Math.max(1, Math.round((nowMs - then) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
