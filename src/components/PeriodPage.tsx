'use client';

import { useMemo } from 'react';
import SkeletonPipelineEntry from '@/components/SkeletonPipelineEntry';
import FilterBar from '@/components/FilterBar';
import ArticleList from '@/components/ArticleList';
import EmptyState from '@/components/EmptyState';
import SectionNav, { type SectionNavItem } from '@/components/SectionNav';
import SectionHead from '@/components/SectionHead';
import TopPicks from '@/components/TopPicks';
import PeriodHero, { type PeriodCopy } from '@/components/PeriodHero';
import { useFiltering } from '@/hooks/useFiltering';
import { useArticleData } from '@/hooks/useArticleData';
import { motionAllowed } from '@/hooks/useReveal';
import { applyFilters, getMonthArticles, getWeekArticles, selectTopPicks } from '@/lib/filtering';
import { computePeriodStats } from '@/lib/stats';
import { CATEGORIES_WITH_LABELS } from '@/lib/styles';
import type { Article } from '@/lib/types';

export type Period = 'week' | 'month';

interface PeriodConfig extends PeriodCopy {
  days: number;
  select: (articles: Article[]) => Article[];
  /** "This Week" / "This Month", used in section titles. */
  title: string;
}

const PERIODS: Record<Period, PeriodConfig> = {
  week: {
    days: 7,
    select: getWeekArticles,
    title: 'This Week',
    label: 'Weekly brief',
    noun: 'week',
    headline: ['The week in QA, ', 'ranked', '.'],
    other: { href: '/monthly', label: 'Monthly brief' },
  },
  month: {
    days: 30,
    select: getMonthArticles,
    title: 'This Month',
    label: 'Monthly brief',
    noun: 'month',
    headline: ['The month in QA, ', 'ranked', '.'],
    other: { href: '/weekly', label: 'Weekly brief' },
  },
};

/** Shared body of the /weekly and /monthly pages: same building blocks as the Daily page, a different window. */
export default function PeriodPage({ period }: { period: Period }) {
  const config = PERIODS[period];
  const { allArticles, isLoading } = useArticleData();
  const { filters, updateFilters, clearFilters } = useFiltering();

  const periodArticles = useMemo(() => config.select(allArticles), [config, allArticles]);
  const topPickArticles = useMemo(() => selectTopPicks(periodArticles), [periodArticles]);
  const topPickIds = useMemo(() => new Set(topPickArticles.map((a) => a.id)), [topPickArticles]);
  const filteredArticles = useMemo(() => applyFilters(periodArticles, filters), [periodArticles, filters]);
  const stats = useMemo(
    () => (isLoading ? null : computePeriodStats(periodArticles, config.days)),
    [isLoading, periodArticles, config.days],
  );

  const selectCategory = (category: string | null) => {
    updateFilters({ ...filters, category: category ?? undefined });
    if (category) {
      document
        .getElementById('filters')
        ?.scrollIntoView({ behavior: motionAllowed() ? 'smooth' : 'auto', block: 'center' });
    }
  };

  const navItems: SectionNavItem[] = [
    { id: 'picks', no: '01', label: 'Top picks', count: isLoading ? undefined : topPickArticles.length },
    {
      id: 'feed',
      no: '02',
      label: 'Pipeline',
      count: isLoading ? undefined : Math.max(periodArticles.length - topPickArticles.length, 0),
    },
  ];

  return (
    <div className="home">
      <div className="hero">
        <div className="wrap">
          <PeriodHero
            copy={config}
            stats={stats}
            isLoading={isLoading}
            activeCategory={filters.category}
            onSelectCategory={selectCategory}
          />
        </div>
      </div>

      <SectionNav items={navItems} />

      <section id="picks" className="sec" aria-labelledby="picks-title">
        <div className="wrap">
          <SectionHead
            no="01"
            eyebrow="Highest signal"
            title={`${config.title}'s Top Picks`}
            titleId="picks-title"
            sub={`The three best-scored stories of the ${config.noun}, at most one per source.`}
          />
          <TopPicks articles={topPickArticles} isLoading={isLoading} emptyLabel={`No top picks this ${config.noun}.`} />
        </div>
      </section>

      <section id="feed" className="sec band" aria-labelledby="feed-title">
        <div className="wrap">
          <SectionHead
            no="02"
            eyebrow="The pipeline"
            title={`All ${config.title}'s Articles`}
            titleId="feed-title"
            sub="Everything else that cleared the score threshold. Filter by topic or tag."
          />
          <div id="filters">
            <FilterBar
              categories={CATEGORIES_WITH_LABELS}
              availableTags={periodArticles.length > 0 ? Array.from(new Set(periodArticles.flatMap((a) => a.tags || []))).sort() : []}
              activeFilters={filters}
              onCategoryChange={(category) => updateFilters({ ...filters, category: category ?? undefined })}
              onTagChange={(tag, active) => {
                const newTags = active
                  ? [...(filters.tags || []), tag]
                  : (filters.tags || []).filter((t) => t !== tag);
                updateFilters({ ...filters, tags: newTags.length > 0 ? newTags : undefined });
              }}
              onReset={clearFilters}
              totalArticles={periodArticles.length}
              shownArticles={filteredArticles.length}
            />
          </div>

          {isLoading ? (
            <div className="feed-table" aria-busy="true">
              <ul className="feed-list" role="list">
                {Array.from({ length: 6 }, (_, i) => (
                  <SkeletonPipelineEntry key={i} />
                ))}
              </ul>
            </div>
          ) : filteredArticles.length > 0 ? (
            <ArticleList articles={filteredArticles} topPickIds={topPickIds} />
          ) : (
            <EmptyState onReset={clearFilters} />
          )}
        </div>
      </section>
    </div>
  );
}
