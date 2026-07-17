'use client';

import { Suspense } from 'react';
import type { Article } from '@/lib/types';
import TopPickCard from '@/components/TopPickCard';
import SkeletonTopPickCard from '@/components/SkeletonTopPickCard';
import SkeletonPipelineEntry from '@/components/SkeletonPipelineEntry';
import FilterBar from '@/components/FilterBar';
import ArticleList from '@/components/ArticleList';
import EmptyState from '@/components/EmptyState';
import RefreshIndicator from '@/components/RefreshIndicator';
import { useFiltering } from '@/hooks/useFiltering';
import { useArticleData } from '@/hooks/useArticleData';
import { applyFilters } from '@/lib/filtering';
import { getTodayArticles } from '@/lib/filtering';
import { CATEGORIES_WITH_LABELS } from '@/lib/styles';

function DailyPageContent() {
  const { articles, isLoading, isUsingFallback } = useArticleData();
  const { filters, updateFilters, clearFilters } = useFiltering();

  const todayArticles = articles; // Already filtered by hook
  const topPickArticles = todayArticles.slice(0, 3);
  const topPickIds = new Set(topPickArticles.map((a) => a.id));
  const filteredArticles = applyFilters(todayArticles, filters);

  return (
    <div className="w-full space-y-8">
      {/* Refresh Status */}
      <RefreshIndicator />

      {/* Fallback Indicator */}
      {isUsingFallback && (
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-700 rounded px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          Showing yesterday's articles. Today's refresh coming at 05:00 UTC.
        </div>
      )}

      {/* Top Picks Brief */}
      <section className="py-5">
        <h2 className="section-title mb-4">Today's Top Picks</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-center">
            <SkeletonTopPickCard />
            <SkeletonTopPickCard />
            <SkeletonTopPickCard />
          </div>
        ) : topPickArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-center">
            {topPickArticles.map((article, i) => (
              <TopPickCard key={article.id} article={article} rank={i + 1} />
            ))}
          </div>
        ) : (
          <p className="text-paper-muted">No top picks for today.</p>
        )}
      </section>

      {/* Filters */}
      <section>
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
      </section>

      {/* Article List with Load More */}
      <section>
        <h2 className="section-title mb-4">All Today's Articles</h2>
        {isLoading ? (
          <ul className="space-y-1">
            <SkeletonPipelineEntry />
            <SkeletonPipelineEntry />
            <SkeletonPipelineEntry />
            <SkeletonPipelineEntry />
            <SkeletonPipelineEntry />
            <SkeletonPipelineEntry />
          </ul>
        ) : filteredArticles.length > 0 ? (
          <ArticleList articles={filteredArticles} topPickIds={topPickIds} />
        ) : (
          <EmptyState onReset={clearFilters} />
        )}
      </section>
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
