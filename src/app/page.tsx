'use client';

import { Suspense, useEffect, useState } from 'react';
import type { Article, Category } from '@/lib/types';
import BriefCard from '@/components/BriefCard';
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

  // Daily Brief is the first 3-4 articles from TODAY ONLY, independent of filters.
  const todayArticles = getTodayArticles(articles as any) as Article[];
  const dailyPickIds = new Set(todayArticles.slice(0, 4).map((article) => article.id));
  const filteredArticles = applyFilters(todayArticles as any, filters) as Article[];

  return (
    <div className="w-full">
      <section className="mb-8 sm:mb-12">
        <BriefCard
          title="Today's Top Picks"
          items={todayArticles.slice(0, 4).map((article) => ({
            id: article.id,
            title: article.title,
            category: article.category as Category,
            url: article.url,
            isTopPick: dailyPickIds.has(article.id),
          }))}
        />
      </section>

      <section>
        {/* Extract unique tags for tag chips */}
        {todayArticles.length > 0 && (
          <FilterBar
            categories={CATEGORIES_WITH_LABELS}
            availableTags={Array.from(new Set(todayArticles.flatMap((a) => a.tags || []))).sort()}
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
        )}

        <div className="py-6 sm:py-8">
          <h2 className="section-title">
            Today's Articles
          </h2>

          {isLoading ? (
            <p className="text-2 text-sm">Loading articles…</p>
          ) : filteredArticles.length > 0 ? (
            <ArticleList articles={filteredArticles} topPickIds={dailyPickIds} />
          ) : (
            <EmptyState onReset={clearFilters} />
          )}
        </div>
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
