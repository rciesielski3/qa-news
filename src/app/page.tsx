'use client';

import { Suspense, useMemo } from 'react';
import SkeletonPipelineEntry from '@/components/SkeletonPipelineEntry';
import FilterBar from '@/components/FilterBar';
import ArticleList from '@/components/ArticleList';
import EmptyState from '@/components/EmptyState';
import RefreshIndicator from '@/components/RefreshIndicator';
import { TrendingReposView } from '@/components/TrendingRepos';
import HeroBento from '@/components/HeroBento';
import SectionNav, { type SectionNavItem } from '@/components/SectionNav';
import SectionHead from '@/components/SectionHead';
import TopPicks from '@/components/TopPicks';
import { useFiltering } from '@/hooks/useFiltering';
import { useArticleData } from '@/hooks/useArticleData';
import { useTrendingRepos } from '@/hooks/useTrendingRepos';
import { motionAllowed } from '@/hooks/useReveal';
import { applyFilters, selectTopPicks } from '@/lib/filtering';
import { computeStats } from '@/lib/stats';
import { CATEGORIES_WITH_LABELS } from '@/lib/styles';

function DailyPageContent() {
  const { articles, allArticles, feedDay, updatedAt, isLoading, isUsingFallback } = useArticleData();
  const { filters, updateFilters, clearFilters } = useFiltering();
  const repos = useTrendingRepos();

  const todayArticles = articles; // Already filtered by hook
  const topPickArticles = useMemo(() => selectTopPicks(todayArticles), [todayArticles]);
  const topPickIds = useMemo(() => new Set(topPickArticles.map((a) => a.id)), [topPickArticles]);
  // Memoised so unrelated re-renders (e.g. trending.json resolving) keep the same
  // array identity; ArticleList resets its Load More progress when it changes.
  const filteredArticles = useMemo(() => applyFilters(todayArticles, filters), [todayArticles, filters]);

  const stats = useMemo(
    () => (isLoading ? null : computeStats(allArticles, feedDay)),
    [isLoading, allArticles, feedDay],
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
      count: isLoading ? undefined : Math.max(todayArticles.length - topPickArticles.length, 0),
    },
    ...(repos.length > 0 ? [{ id: 'repos', no: '03', label: 'New repos', count: Math.min(repos.length, 6) }] : []),
  ];

  return (
    <div className="home">
      <div className="hero">
        <div className="wrap">
          <HeroBento
            stats={stats}
            isLoading={isLoading}
            updatedAt={updatedAt}
            activeCategory={filters.category}
            onSelectCategory={selectCategory}
          />
          <RefreshIndicator />
        </div>
      </div>

      <SectionNav items={navItems} />

      {/* Fallback Indicator */}
      {isUsingFallback && (
        <div className="wrap">
          <div className="notice" role="status">
            Showing yesterday&apos;s articles. Today&apos;s refresh coming at 05:00 UTC.
          </div>
        </div>
      )}

      {/* 01 Top picks */}
      <section id="picks" className="sec" aria-labelledby="picks-title">
        <div className="wrap">
          <SectionHead
            no="01"
            eyebrow="Highest signal"
            title="Today's Top Picks"
            titleId="picks-title"
            sub="The three best-scored stories of the day, ranked by the pipeline's relevance score."
          />
          <TopPicks articles={topPickArticles} isLoading={isLoading} />
        </div>
      </section>

      {/* 02 Pipeline: filters + feed table */}
      <section id="feed" className="sec band" aria-labelledby="feed-title">
        <div className="wrap">
          <SectionHead
            no="02"
            eyebrow="The pipeline"
            title="All Today's Articles"
            titleId="feed-title"
            sub="Everything else that cleared the score threshold. Filter by topic or tag."
          />
          <div id="filters">
            <FilterBar
              categories={CATEGORIES_WITH_LABELS}
              availableTags={todayArticles.length > 0 ? Array.from(new Set(todayArticles.flatMap((a) => a.tags || []))).sort() : []}
              activeFilters={filters}
              onCategoryChange={(category) => updateFilters({ ...filters, category: category ?? undefined })}
              onTagChange={(tag, active) => {
                const newTags = active
                  ? [...(filters.tags || []), tag]
                  : (filters.tags || []).filter((t) => t !== tag);
                updateFilters({ ...filters, tags: newTags.length > 0 ? newTags : undefined });
              }}
              onReset={clearFilters}
              totalArticles={todayArticles.length}
              shownArticles={filteredArticles.length}
            />
          </div>

          {isLoading ? (
            <div className="feed-table" aria-busy="true">
              <ul className="feed-list" role="list">
                <SkeletonPipelineEntry />
                <SkeletonPipelineEntry />
                <SkeletonPipelineEntry />
                <SkeletonPipelineEntry />
                <SkeletonPipelineEntry />
                <SkeletonPipelineEntry />
              </ul>
            </div>
          ) : filteredArticles.length > 0 ? (
            <ArticleList articles={filteredArticles} topPickIds={topPickIds} />
          ) : (
            <EmptyState onReset={clearFilters} />
          )}
        </div>
      </section>

      {/* 03 New & notable repos (hidden when trending.json is missing or empty) */}
      <TrendingReposView repos={repos} />
    </div>
  );
}

export default function DailyPage() {
  return (
    <Suspense fallback={null}>
      <DailyPageContent />
    </Suspense>
  );
}
