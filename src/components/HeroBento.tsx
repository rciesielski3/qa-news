'use client';

import { useEffect, useId, useState, type ReactNode } from 'react';
import Link from 'next/link';
import type { Category } from '@/lib/types';
import { formatAgo, type Stats } from '@/lib/stats';
import { formatUtcTime } from '@/lib/dailyWindow';
import { getCategoryLabel } from '@/lib/styles';
import { useCountUp } from '@/hooks/useCountUp';
import { staggerDelay, useReveal } from '@/hooks/useReveal';
import { useOffscreenPause } from '@/hooks/useOffscreenPause';
import SkeletonLoader from '@/components/SkeletonLoader';

interface HeroBentoProps {
  /** Derived statistics; null until the data has loaded. */
  stats: Stats | null;
  isLoading: boolean;
  /** latest.json `updatedAt`. */
  updatedAt: string | null;
  /** Category currently filtering the feed (highlights its coverage bar). */
  activeCategory?: string;
  /** Called with a category to filter the feed by, or null to clear it. */
  onSelectCategory: (category: Category | null) => void;
  /** Wall-clock override (ms) for deterministic rendering in tests. */
  now?: number;
}

const CLOCK_REFRESH_MS = 60_000;

export function Tile({
  className,
  index,
  pauseOffscreen = false,
  children,
}: {
  className: string;
  index: number;
  /** Pause the tile's decorative animations while it is scrolled out of view. */
  pauseOffscreen?: boolean;
  children: ReactNode;
}) {
  const { ref, className: reveal } = useReveal<HTMLDivElement>(staggerDelay(index));
  const offscreen = useOffscreenPause(ref, pauseOffscreen);
  return (
    <div ref={ref} className={`tile ${className} ${reveal}${offscreen ? ' paused' : ''}`.trim()}>
      {children}
    </div>
  );
}

export function formatLongDate(day: string): string {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatShortDate(day: string): string {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

function CoverageBar({
  category,
  count,
  windowCount,
  max,
  pressed,
  onSelect,
}: {
  category: Category;
  /** Articles in the 30-day coverage window. */
  count: number;
  /** Articles on the feed day: what the filter can actually show. */
  windowCount: number;
  max: number;
  pressed: boolean;
  onSelect: () => void;
}) {
  const shown = useCountUp(count);
  const label = getCategoryLabel(category);
  const noteId = useId();
  // A bar with nothing on the feed day would lead to an empty feed. A pressed
  // bar stays usable so the active filter can always be cleared.
  const disabled = windowCount === 0 && !pressed;
  return (
    <button
      type="button"
      className="cov-bar"
      data-cat={category}
      aria-pressed={pressed}
      aria-disabled={disabled || undefined}
      aria-describedby={noteId}
      title={disabled ? 'No articles in the last 24 hours' : `Filter feed: ${label}`}
      aria-label={`${label}: ${count} articles in the last 30 days`}
      onClick={() => {
        if (!disabled) onSelect();
      }}
    >
      <span className="lab">{label}</span>
      <span className="track">
        <span className="fill" style={{ ['--w' as string]: String(max > 0 ? count / max : 0) }} />
      </span>
      <span className="n tnum" aria-hidden="true">
        {shown}
      </span>
      <span id={noteId} className="sr-only">
        {disabled
          ? 'No articles in the last 24 hours, so the feed cannot be filtered by it.'
          : `${windowCount} in the last 24 hours. ${pressed ? 'Clear filter' : 'Filter feed'}.`}
      </span>
    </button>
  );
}

export default function HeroBento({
  stats,
  isLoading,
  updatedAt,
  activeCategory,
  onSelectCategory,
  now,
}: HeroBentoProps) {
  // Wall clock lives in state, set after mount and refreshed every minute: no
  // Date.now() during render (hydration-safe) and the "updated Xm ago" pill ages.
  const [clock, setClock] = useState<number | null>(null);
  useEffect(() => {
    if (now !== undefined) return;
    setClock(Date.now());
    const id = setInterval(() => setClock(Date.now()), CLOCK_REFRESH_MS);
    return () => clearInterval(id);
  }, [now]);
  const nowMs = now ?? clock;
  const todayShown = useCountUp(stats?.windowCount ?? 0);
  const ready = !isLoading && stats !== null;

  // The window ends at the data's updatedAt; when it had to fall back to the
  // newest article the label says "to" and names the day instead of "updated".
  const windowLabel = !stats
    ? 'Last 24 hours'
    : Date.parse(updatedAt ?? '') === stats.windowEndMs
      ? `Last 24 hours · updated ${formatUtcTime(stats.windowEndMs)}`
      : `Last 24 hours · to ${formatUtcTime(stats.windowEndMs)}, ${formatShortDate(stats.refDay)}`;
  const ago = nowMs === null ? '' : formatAgo(updatedAt, nowMs);

  const sparkMax = stats ? Math.max(...stats.spark, 0) : 0;
  const catMax = stats?.categories[0]?.count ?? 0;
  const srcMax = stats?.topSources[0]?.count ?? 0;

  return (
    <div className="bento" id="bento">
      {/* Hero tile: dominates the grid */}
      <Tile className="t-head" index={0} pauseOffscreen>
        <div>
          <div className="tlabel">
            <span className="dot" aria-hidden="true" />
            Daily brief{stats ? ` · ${formatLongDate(stats.refDay)}` : ''}
          </div>
          <h1>
            The signal in QA, AI and engineering, <em>ranked</em> every morning.
          </h1>
          <p>
            Curated QA, AI and engineering news
            {stats && stats.sourceCount > 0 ? (
              <>
                {' '}
                from <span className="tnum">{stats.sourceCount}</span> sources
              </>
            ) : null}
            , scored and de-duplicated, so you read ten good links instead of two hundred.
          </p>
        </div>
        <div className="cta">
          <a className="btn" href="#picks">
            Top picks <span aria-hidden="true">→</span>
          </a>
          <a className="btn ghost" href="#feed">
            Browse the feed
          </a>
          <Link className="btn ghost" href="/how-it-works">
            How it works
          </Link>
          {ago && (
            <span className="live-pill">
              <i aria-hidden="true" />
              updated {ago}
            </span>
          )}
        </div>
      </Tile>

      {/* Last 24 hours + 14-bar sparkline */}
      <Tile className="t-today hov" index={1}>
        <div className="tlabel">
          <span className="dot" aria-hidden="true" />
          {windowLabel}
        </div>
        {ready ? (
          <>
            <div className="bignum tnum">
              <span data-testid="today-count">{todayShown}</span>
              <small>articles</small>
            </div>
            {stats.deltaPct !== null && (
              <div className={`delta tnum${stats.deltaPct < 0 ? ' down' : ''}`}>
                {stats.deltaPct >= 0 ? '▲ +' : '▼ '}
                {stats.deltaPct}% vs 13-day avg
              </div>
            )}
            <div
              className="spark"
              role="img"
              aria-label={`Articles per day, last ${stats.spark.length} days (latest bar: last 24 hours): ${stats.spark.join(', ')}`}
            >
              {stats.spark.map((v, i) => (
                <b
                  key={i}
                  title={`${v} articles`}
                  style={{
                    height: `${sparkMax > 0 ? Math.max(8, (v / sparkMax) * 100) : 8}%`,
                    animationDelay: `${i * 40}ms`,
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="tile-skel" aria-hidden="true">
            <SkeletonLoader width="w-24" height="h-12" />
            <SkeletonLoader width="w-full" height="h-12" />
          </div>
        )}
      </Tile>

      {/* Top 3 sources */}
      <Tile className="t-src" index={2}>
        <div className="tlabel">
          <span className="dot" aria-hidden="true" />
          Top sources
          {ready && <span className="go-n tnum">{stats.total} articles</span>}
        </div>
        {ready ? (
          stats.topSources.length > 0 ? (
            <ol className="srclist" role="list">
              {stats.topSources.map((source, i) => (
                <li key={source.name}>
                  <span className="sn tnum">{String(i + 1).padStart(2, '0')}</span>
                  <span className="nm">{source.name}</span>
                  <span className="ct tnum">
                    {source.count} <em>{source.pct}%</em>
                  </span>
                  <span className="bar">
                    <i style={{ ['--w' as string]: String(srcMax > 0 ? source.count / srcMax : 0), animationDelay: `${i * 120}ms` }} />
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="sec-sub">No sources yet.</p>
          )
        ) : (
          <div className="tile-skel" aria-hidden="true">
            <SkeletonLoader width="w-full" height="h-6" />
            <SkeletonLoader width="w-full" height="h-6" />
            <SkeletonLoader width="w-full" height="h-6" />
          </div>
        )}
      </Tile>

      {/* Coverage by category, 30 days; bars filter the feed */}
      <Tile className="t-dist" index={3}>
        <div className="tlabel">
          <span className="dot" aria-hidden="true" />
          Coverage by category · 30d
        </div>
        {ready ? (
          stats.categories.length > 0 ? (
            <div className="cov">
              {stats.categories.map((c) => (
                <CoverageBar
                  key={c.category}
                  category={c.category}
                  count={c.count}
                  windowCount={stats.windowByCategory[c.category] ?? 0}
                  max={catMax}
                  pressed={activeCategory === c.category}
                  onSelect={() => onSelectCategory(activeCategory === c.category ? null : c.category)}
                />
              ))}
            </div>
          ) : (
            <p className="sec-sub">No category data yet.</p>
          )
        ) : (
          <div className="tile-skel" aria-hidden="true">
            <SkeletonLoader width="w-full" height="h-4" />
            <SkeletonLoader width="w-full" height="h-4" />
            <SkeletonLoader width="w-full" height="h-4" />
          </div>
        )}
      </Tile>
    </div>
  );
}
