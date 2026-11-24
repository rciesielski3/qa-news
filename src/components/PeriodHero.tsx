'use client';

import Link from 'next/link';
import type { Category } from '@/lib/types';
import type { PeriodStats } from '@/lib/stats';
import { getCategoryLabel } from '@/lib/styles';
import { useCountUp } from '@/hooks/useCountUp';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Tile, formatShortDate } from '@/components/HeroBento';

export interface PeriodCopy {
  /** Tile label, e.g. "Weekly brief". */
  label: string;
  /** Singular noun used in labels, e.g. "week". */
  noun: string;
  /** Hero headline; the word wrapped by `emphasis` is accented. */
  headline: [before: string, emphasis: string, after: string];
  /** Where the sibling period page lives. */
  other: { href: string; label: string };
}

interface PeriodHeroProps {
  copy: PeriodCopy;
  stats: PeriodStats | null;
  isLoading: boolean;
  activeCategory?: string;
  onSelectCategory: (category: Category | null) => void;
}

function CategoryBar({
  category,
  count,
  max,
  pressed,
  periodLabel,
  onSelect,
}: {
  category: Category;
  count: number;
  max: number;
  pressed: boolean;
  periodLabel: string;
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
      aria-label={`${label}: ${count} articles in the last ${periodLabel}`}
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

/** Slim page header plus three stat tiles side by side, computed from the period's articles. */
export default function PeriodHero({ copy, stats, isLoading, activeCategory, onSelectCategory }: PeriodHeroProps) {
  const total = useCountUp(stats?.total ?? 0);
  const ready = !isLoading && stats !== null;
  const days = stats?.days ?? 0;
  const periodLabel = `${days} days`;
  const dailyMax = stats ? Math.max(...stats.daily, 0) : 0;
  const catMax = stats?.categories[0]?.count ?? 0;
  const srcMax = stats?.topSources[0]?.count ?? 0;
  const [before, emphasis, after] = copy.headline;

  return (
    <>
      <header className="period-head">
        <div className="eyebrow">
          {copy.label}
          {stats ? ` · ${formatShortDate(stats.startDay)} – ${formatShortDate(stats.refDay)}` : ''}
        </div>
        <h1>
          {before}
          <em>{emphasis}</em>
          {after}
        </h1>
        <p className="sec-sub">
          The best-scored QA, AI and engineering stories of the last {copy.noun}
          {stats && stats.sourceCount > 0 ? (
            <>
              {' '}
              from <span className="tnum">{stats.sourceCount}</span> sources
            </>
          ) : null}
          , ranked by relevance and de-duplicated.
        </p>
        <Link className="period-switch" href={copy.other.href}>
          {copy.other.label} <span aria-hidden="true">→</span>
        </Link>
      </header>

      <div className="period-stats" id="bento">
      <Tile className="pstat hov" index={0}>
        <div className="tlabel">
          <span className="dot" aria-hidden="true" />
          Published this {copy.noun}
        </div>
        {ready ? (
          <>
            <div className="bignum tnum">
              <span data-testid="period-count">{total}</span>
              <small>articles</small>
            </div>
            <div className="delta tnum">
              {stats.avgPerDay} per day
              {stats.peakDay ? ` · peak ${stats.peakDay.count} on ${formatShortDate(stats.peakDay.day)}` : ''}
            </div>
            <div
              className={`spark${stats.daily.length > 14 ? ' dense' : ''}`}
              role="img"
              aria-label={`Articles per day, last ${stats.daily.length} days: ${stats.daily.join(', ')}`}
            >
              {stats.daily.map((v, i) => (
                <b
                  key={i}
                  title={`${v} articles`}
                  style={{
                    height: `${dailyMax > 0 ? Math.max(8, (v / dailyMax) * 100) : 8}%`,
                    animationDelay: `${i * 25}ms`,
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

      <Tile className="pstat" index={1}>
        <div className="tlabel">
          <span className="dot" aria-hidden="true" />
          Top sources
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

      <Tile className="pstat" index={2}>
        <div className="tlabel">
          <span className="dot" aria-hidden="true" />
          Coverage by category · {days > 0 ? `${days}d` : copy.noun}
        </div>
        {ready ? (
          stats.categories.length > 0 ? (
            <div className="cov">
              {stats.categories.map((c) => (
                <CategoryBar
                  key={c.category}
                  category={c.category}
                  count={c.count}
                  max={catMax}
                  pressed={activeCategory === c.category}
                  periodLabel={periodLabel}
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
    </>
  );
}
