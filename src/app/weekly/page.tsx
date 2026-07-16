'use client';

import { Suspense, useEffect, useState } from 'react';
import type { Article } from '@/lib/types';
import BriefCard from '@/components/BriefCard';
import FilterBar from '@/components/FilterBar';
import ArticleList from '@/components/ArticleList';
import EmptyState from '@/components/EmptyState';
import { useFiltering } from '@/hooks/useFiltering';
import { applyFilters } from '@/lib/filtering';
import { CATEGORIES_WITH_LABELS } from '@/lib/styles';

// `useFiltering` reads the URL via `useSearchParams`, which requires a
// Suspense boundary above it (Next.js App Router requirement, especially
// relevant for `output: 'export'` static builds).
function WeeklyPageContent() {
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

  // Weekly Brief is always the first 6 articles, independent of filters.
  const weeklyPickIds = new Set(articles.slice(0, 6).map((article) => article.id));
  const filteredArticles = applyFilters(articles, filters);

  return (
    <div className="w-full">
      <section className="mb-8 sm:mb-12">
        <BriefCard
          title="Weekly Brief — Top Picks"
          items={articles.slice(0, 6).map((article) => ({
            id: article.id,
            title: article.title,
            category: article.category,
            url: article.url,
            isTopPick: weeklyPickIds.has(article.id),
          }))}
        />
      </section>

      <section>
        {/* Extract unique tags for tag chips */}
        {articles.length > 0 && (
          <FilterBar
            categories={CATEGORIES_WITH_LABELS}
            availableTags={Array.from(new Set(articles.flatMap((a) => a.tags || []))).sort()}
            activeFilters={filters}
            onCategoryChange={(category) => updateFilters({ ...filters, category: category ?? undefined })}
            onTagChange={(tag, active) => {
              const newTags = active
                ? [...(filters.tags || []), tag]
                : (filters.tags || []).filter((t) => t !== tag);
              updateFilters({ ...filters, tags: newTags.length > 0 ? newTags : undefined });
            }}
            onReset={clearFilters}
            totalArticles={articles.length}
            shownArticles={filteredArticles.length}
          />
        )}

        <div className="py-6 sm:py-8">
          <h2 className="section-title">
            This Week
          </h2>

          {isLoading ? (
            <p className="text-2 text-sm">Loading articles…</p>
          ) : filteredArticles.length > 0 ? (
            <ArticleList articles={filteredArticles} topPickIds={weeklyPickIds} />
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
