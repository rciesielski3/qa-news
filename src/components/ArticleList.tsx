'use client';

import { useState, useEffect } from 'react';
import type { Article } from '@/lib/types';
import PipelineEntry from '@/components/PipelineEntry';
import SkeletonPipelineEntry from '@/components/SkeletonPipelineEntry';
import { calculateArticlesPerPage } from '@/lib/pagination';

interface ArticleListProps {
  articles: Article[];
  topPickIds?: Set<string>;
}

export default function ArticleList({ articles, topPickIds }: ArticleListProps) {
  const [batchSize, setBatchSize] = useState(10);
  const [displayedCount, setDisplayedCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const updateBatchSize = () => {
      const newSize = calculateArticlesPerPage(window.innerHeight);
      setBatchSize(newSize);
      setDisplayedCount(newSize);
    };

    updateBatchSize();
    window.addEventListener('resize', updateBatchSize);
    return () => window.removeEventListener('resize', updateBatchSize);
  }, []);

  useEffect(() => {
    setDisplayedCount(batchSize);
  }, [articles, batchSize]);

  const listArticles = topPickIds
    ? articles.filter((article) => !topPickIds.has(article.id))
    : articles;

  const displayedArticles = listArticles.slice(0, displayedCount);
  const hasMore = displayedCount < listArticles.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + batchSize, listArticles.length));
      setIsLoadingMore(false);
    }, 300);
  };

  if (listArticles.length === 0) {
    return <p className="text-ink-600 dark:text-paper-muted">No articles found.</p>;
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-1 min-h-[400px]">
        {displayedArticles.map((article) => (
          <PipelineEntry key={article.id} article={article} />
        ))}

        {isLoadingMore && (
          <>
            <SkeletonPipelineEntry />
            <SkeletonPipelineEntry />
          </>
        )}
      </ul>

      {hasMore && (
        <div className="flex justify-center py-6 border-t border-ink-200 dark:border-ink-600">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-6 py-2 font-mono text-xs uppercase tracking-widest border border-ink-200 dark:border-ink-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors"
          >
            {isLoadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
