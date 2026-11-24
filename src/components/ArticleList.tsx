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
    return <p className="text-2">No articles found.</p>;
  }

  return (
    <div className="feed-table">
      <div className="feed-head" aria-hidden="true">
        <span>#</span>
        <span>Category</span>
        <span>Story</span>
        <span>Source · Date</span>
        <span />
      </div>
      <ul className="feed-list">
        {displayedArticles.map((article, i) => (
          <PipelineEntry key={article.id} article={article} index={i + 1} />
        ))}

        {isLoadingMore && (
          <>
            <SkeletonPipelineEntry />
            <SkeletonPipelineEntry />
          </>
        )}
      </ul>

      {hasMore && (
        <div className="loadmore-wrap">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="loadmore hover:scale-105 hover:bg-[var(--surface-2)] active:bg-[var(--border)] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
