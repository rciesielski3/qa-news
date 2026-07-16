'use client';

import { Suspense, useEffect, useState } from 'react';
import type { Article, Category } from '@/lib/types';
import BriefCard from '@/components/BriefCard';
import FilterBar from '@/components/FilterBar';
import TagFilterChips from '@/components/TagFilterChips';
import ArticleList from '@/components/ArticleList';
import EmptyState from '@/components/EmptyState';
import { useFiltering } from '@/hooks/useFiltering';
import { applyFilters } from '@/lib/filtering';

// `useFiltering` reads the URL via `useSearchParams`, which requires a
// Suspense boundary above it (Next.js App Router requirement, especially
// relevant for `output: 'export'` static builds).
function WeeklyPageContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { filters, updateFilters, toggleTag, clearFilters } = useFiltering();

  useEffect(() => {
    let cancelled = false;

    fetch('/latest.json')
      .then((res) => res.json())
      .then((data: { articles: Article[] }) => {
        if (!cancelled) {
          setArticles(data.articles ?? []);
        }
      })
      .catch(() => {
        // Leave articles empty; the page still renders (with EmptyState-like
        // zero counts) instead of crashing.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Weekly Brief is always the first 6 articles, independent of filters.
  const weeklyPickIds = new Set(articles.slice(0, 6).map((article) => article.id));
  const filteredArticles = applyFilters(articles, filters);
  const hasActiveFilters = Boolean(filters.category) || Boolean(filters.tags && filters.tags.length > 0);

  const handleCategorySelect = (category: Category) => {
    // Clicking the already-active category clears it (toggle off).
    if (filters.category === category) {
      updateFilters({ ...filters, category: undefined });
    } else {
      updateFilters({ ...filters, category });
    }
  };

  return (
    <div className="w-full">
      <section className="mb-8 sm:mb-12">
        <BriefCard
          title="Weekly Brief — Top Picks"
          items={articles.slice(0, 6).map((article) => ({
            id: article.id,
            title: article.title,
            category: article.category,
            source: article.source,
            isTopPick: weeklyPickIds.has(article.id),
          }))}
        />
      </section>

      <section>
        <FilterBar
          selectedCategory={filters.category as Category | undefined}
          hasActiveFilters={hasActiveFilters}
          articleCount={filteredArticles.length}
          totalCount={articles.length}
          onCategorySelect={handleCategorySelect}
          onClearFilters={clearFilters}
        />

        <TagFilterChips
          articles={articles}
          selectedTags={filters.tags || []}
          onTagToggle={toggleTag}
          onClear={() => updateFilters({ ...filters, tags: [] })}
        />

        <div className="py-6 sm:py-8">
          <h2 className="mb-4 text-base sm:text-lg font-bold text-paper">
            This Week
          </h2>

          {isLoading ? (
            <p className="text-paper-muted text-sm">Loading articles…</p>
          ) : filteredArticles.length > 0 ? (
            <ArticleList articles={filteredArticles} dailyPickIds={weeklyPickIds} />
          ) : (
            <EmptyState onReset={clearFilters} />
          )}
        </div>
      </section>
    </div>
  );
}

export default function WeeklyPage() {
  return (
    <Suspense fallback={null}>
      <WeeklyPageContent />
    </Suspense>
  );
}
