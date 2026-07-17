'use client';

import { useState, useEffect } from 'react';
import type { Article } from '@/lib/types';
import PipelineEntry from '@/components/PipelineEntry';
import { paginateArticles, getTotalPages, clampPageNumber, calculateArticlesPerPage } from '@/lib/pagination';

interface ArticleListProps {
  articles: Article[];
  topPickIds?: Set<string>;
}

export default function ArticleList({ articles, topPickIds }: ArticleListProps) {
  const [pageNumber, setPageNumber] = useState(1);
  const [articlesPerPage, setArticlesPerPage] = useState(6);

  // Calculate articles per page on mount and resize
  useEffect(() => {
    const updateArticlesPerPage = () => {
      const newPerPage = calculateArticlesPerPage(window.innerHeight);
      setArticlesPerPage(newPerPage);
    };

    updateArticlesPerPage();
    window.addEventListener('resize', updateArticlesPerPage);
    return () => window.removeEventListener('resize', updateArticlesPerPage);
  }, []);

  // Exclude top picks so they don't appear twice (once as TopPickCard, once here)
  const listArticles = topPickIds
    ? articles.filter((article) => !topPickIds.has(article.id))
    : articles;

  const totalPages = getTotalPages(listArticles.length, articlesPerPage);
  const validPageNumber = clampPageNumber(pageNumber, totalPages);
  const pageArticles = paginateArticles(listArticles, validPageNumber, articlesPerPage);

  // Generate signature from article IDs to detect content changes (not just length)
  const articleIdsSignature = listArticles.map((a) => a.id).join(',');

  // Reset to page 1 whenever the result set or page size changes, so
  // Previous/Next disabled logic never operates on a stale page number.
  useEffect(() => {
    setPageNumber(1);
  }, [articleIdsSignature, articlesPerPage]);

  if (listArticles.length === 0) {
    return <p className="text-ink-600 dark:text-paper-muted">No articles found.</p>;
  }

  return (
    <div className="space-y-4">
      {/* Articles */}
      <ul className="space-y-1 min-h-[400px]">
        {pageArticles.map((article) => (
          <PipelineEntry
            key={article.id}
            article={article}
          />
        ))}
      </ul>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-6 border-t border-ink-200 dark:border-ink-600">
          <button
            onClick={() => setPageNumber(Math.max(1, validPageNumber - 1))}
            disabled={validPageNumber === 1}
            className="px-4 py-2 font-mono text-xs uppercase tracking-widest border border-ink-200 dark:border-ink-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors"
          >
            ← Previous
          </button>

          <span className="text-sm font-mono text-ink-600 dark:text-paper-muted">
            Page {validPageNumber} of {totalPages}
          </span>

          <button
            onClick={() => setPageNumber(Math.min(totalPages, validPageNumber + 1))}
            disabled={validPageNumber === totalPages}
            className="px-4 py-2 font-mono text-xs uppercase tracking-widest border border-ink-200 dark:border-ink-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
