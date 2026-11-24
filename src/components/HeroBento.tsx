'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import type { Category } from '@/lib/types';
import { formatAgo, type Stats } from '@/lib/stats';
import { getCategoryLabel } from '@/lib/styles';
import { useCountUp } from '@/hooks/useCountUp';
import { staggerDelay, useReveal } from '@/hooks/useReveal';
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

function Tile({ className, index, children }: { className: string; index: number; children: ReactNode }) {
  const { ref, className: reveal } = useReveal<HTMLDivElement>(staggerDelay(index));
  return (
    <div ref={ref} className={`tile ${className} ${reveal}`.trim()}>
      {children}
    </div>
  );
}

function formatLongDate(day: string): string {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function formatShortDate(day: string): string {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

function CoverageBar({
  category,
  count,
  max,
  pressed,
  onSelect,
}: {
  category: Category;
  count: number;
  max: number;
  pressed: boolean;
  onSelect: () => void;
}) {
  const shown = useCountUp(count);
  const label = getCategoryLabel(category);
  return (
    <button
      type="button"
      className="cov-bar"
      data-cat={category}
      aria-pressed={pressed}
      title={`Filter feed: ${label}`}
      aria-label={`${label}: ${count} articles in the last 30 days. ${pressed ? 'Clear filter' : 'Filter feed'}`}
      onClick={onSelect}
    >
      <span className="lab">{label}</span>
      <span className="track">
        <span className="fill" style={{ ['--w' as string]: String(max > 0 ? count / max : 0) }} />
      </span>
      <span className="n tnum" aria-hidden="true">
        {shown}
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
  const nowMs = now ?? Date.now();
  const todayKey = new Date(nowMs).toISOString().slice(0, 10);
  const todayShown = useCountUp(stats?.todayCount ?? 0);
  const ready = !isLoading && stats !== null;

  const isToday = stats?.refDay === todayKey;
  const todayLabel = !stats ? 'Published today' : isToday ? 'Published today' : `Latest day · ${formatShortDate(stats.refDay)}`;
  const ago = formatAgo(updatedAt, nowMs);

  const sparkMax = stats ? Math.max(...stats.spark, 0) : 0;
  const catMax = stats?.categories[0]?.count ?? 0;
  const srcMax = stats?.topSources[0]?.count ?? 0;

  return (
    <div className="bento" id="bento">
      {/* Hero tile: dominates the grid */}
      <Tile className="t-head" index={0}>
        <div>
          <div className="tlabel">
            <span className="dot" />
            Daily brief{stats ? ` · ${formatLongDate(stats.refDay)}` : ''}
          </div>
          <h1>
            The signal in QA, <em>ranked</em> every morning.
          </h1>
          <p>
            Curated testing, automation and AI-testing news
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
            Today&apos;s top picks <span aria-hidden="true">→</span>
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

      {/* Published today + 14-day sparkline */}
      <Tile className="t-today hov" index={1}>
        <div className="tlabel">
          <span className="dot" />
          {todayLabel}
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
                {stats.deltaPct}% vs 14-day avg
              </div>
            )}
            <div
              className="spark"
              role="img"
              aria-label={`Articles per day, last ${stats.spark.length} days: ${stats.spark.join(', ')}`}
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
          <span className="dot" />
          Top sources
          {ready && <span className="go-n tnum">{stats.total} articles</span>}
        </div>
        {ready ? (
          stats.topSources.length > 0 ? (
            <ol className="srclist">
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
          <span className="dot" />
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
