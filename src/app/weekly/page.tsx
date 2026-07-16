'use client';

import { Suspense, useEffect, useState } from 'react';
import type { Article } from '@/lib/types';
import TopPickCard from '@/components/TopPickCard';
import FilterBar from '@/components/FilterBar';
import ArticleList from '@/components/ArticleList';
import EmptyState from '@/components/EmptyState';
import { useFiltering } from '@/hooks/useFiltering';
import { applyFilters } from '@/lib/filtering';
import { getWeekArticles } from '@/lib/filtering';
import { CATEGORIES_WITH_LABELS } from '@/lib/styles';

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
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const weekArticles = getWeekArticles(articles as any) as Article[];
  const topPickArticles = weekArticles.slice(0, 3);
  const topPickIds = new Set(topPickArticles.map((a) => a.id));
  const filteredArticles = applyFilters(weekArticles as any, filters) as Article[];

  return (
    <div className="w-full space-y-8">
      <section>
        <h2 className="section-title mb-4">This Week's Top Picks</h2>
        {topPickArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topPickArticles.map((article, i) => (
              <TopPickCard key={article.id} article={article} rank={i + 1} />
            ))}
          </div>
        ) : (
          <p className="text-paper-muted">No top picks this week.</p>
        )}
      </section>

      <section>
        {weekArticles.length > 0 && (
          <FilterBar
            categories={CATEGORIES_WITH_LABELS}
            availableTags={Array.from(new Set(weekArticles.flatMap((a) => a.tags || []))).sort()}
            activeFilters={filters}
            onCategoryChange={(category) => updateFilters({ ...filters, category: category ?? undefined })}
            onTagChange={(tag, active) => {
              const newTags = active
                ? [...(filters.tags || []), tag]
                : (filters.tags || []).filter((t) => t !== tag);
              updateFilters({ ...filters, tags: newTags.length > 0 ? newTags : undefined });
            }}
            onReset={clearFilters}
            totalArticles={weekArticles.length}
            shownArticles={filteredArticles.length}
          />
        )}
      </section>

      <section>
        <h2 className="section-title mb-4">All This Week's Articles</h2>
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

export default function WeeklyPage() {
  return (
    <Suspense fallback={null}>
      <WeeklyPageContent />
    </Suspense>
  );
}
