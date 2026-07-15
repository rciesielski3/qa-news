'use client';

import { Suspense, useEffect, useState } from 'react';
import type { Article, Category } from '@/lib/types';
import DailyBriefCard from '@/components/DailyBriefCard';
import FilterBar from '@/components/FilterBar';
import ArticleList from '@/components/ArticleList';
import EmptyState from '@/components/EmptyState';
import { useFiltering } from '@/hooks/useFiltering';
import { applyFilters } from '@/lib/filtering';

// `useFiltering` reads the URL via `useSearchParams`, which requires a
// Suspense boundary above it (Next.js App Router requirement, especially
// relevant for `output: 'export'` static builds).
function MonthlyPageContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { filters, updateFilters, clearFilters } = useFiltering();

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

  // Monthly Brief is always the first 6 articles, independent of filters.
  const monthlyPickIds = new Set(articles.slice(0, 6).map((article) => article.id));
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-12">
        <DailyBriefCard articles={articles} />
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

        <div className="py-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            This Month
          </h2>

          {isLoading ? (
            <p className="text-gray-600">Loading articles…</p>
          ) : filteredArticles.length > 0 ? (
            <ArticleList articles={filteredArticles} dailyPickIds={monthlyPickIds} />
          ) : (
            <EmptyState onReset={clearFilters} />
          )}
        </div>
      </section>
    </div>
  );
}

export default function MonthlyPage() {
  return (
    <Suspense fallback={null}>
      <MonthlyPageContent />
    </Suspense>
  );
}
