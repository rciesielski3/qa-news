'use client';

import { Suspense, useEffect, useState } from 'react';
import type { Article } from '@/lib/types';
import TopPickCard from '@/components/TopPickCard';
import FilterBar from '@/components/FilterBar';
import ArticleList from '@/components/ArticleList';
import EmptyState from '@/components/EmptyState';
import { useFiltering } from '@/hooks/useFiltering';
import { applyFilters } from '@/lib/filtering';
import { getTodayArticles } from '@/lib/filtering';
import { CATEGORIES_WITH_LABELS } from '@/lib/styles';

function DailyPageContent() {
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
        // Empty on error
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const todayArticles = getTodayArticles(articles);
  const topPickArticles = todayArticles.slice(0, 3);
  const topPickIds = new Set(topPickArticles.map((a) => a.id));
  const filteredArticles = applyFilters(todayArticles, filters);

  return (
    <div className="w-full space-y-8">
      {/* Top Picks Brief */}
      <section>
        <h2 className="section-title mb-4">Today's Top Picks</h2>
        {topPickArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Paginated Article List */}
      <section>
        <h2 className="section-title mb-4">All Today's Articles</h2>
        {isLoading ? (
          <p className="text-paper-muted">Loading articles…</p>
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
