'use client';

import type { Category } from '@/lib/types';

interface FilterBarProps {
  categories: Array<{ id: Category; label: string }>;
  availableTags: string[];
  activeFilters: { category?: string; tags?: string[] };
  onCategoryChange: (category: Category | null) => void;
  onTagChange: (tag: string, active: boolean) => void;
  onReset: () => void;
  totalArticles: number;
  shownArticles: number;
}

export default function FilterBar({
  categories,
  availableTags,
  activeFilters,
  onCategoryChange,
  onTagChange,
  onReset,
  totalArticles,
  shownArticles,
}: FilterBarProps) {
  const filtering = Boolean(activeFilters.category || activeFilters.tags?.length);

  return (
    <div className="filters">
      {/* Category chips row */}
      <div className="chip-row items-center">
        <span className="filters-label">Filter by category</span>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="chip-cat"
            data-cat={cat.id}
            aria-pressed={activeFilters.category === cat.id ? 'true' : 'false'}
            onClick={() =>
              onCategoryChange(activeFilters.category === cat.id ? null : cat.id)
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tag chips row */}
      <div className="chip-row">
        <span className="filters-label">Filter by tags</span>
        <div className="chip-row">
          {availableTags.map((tag) => {
            const isPressed = activeFilters.tags?.includes(tag) ?? false;
            return (
              <button
                key={tag}
                className="chip-tag"
                aria-pressed={isPressed ? 'true' : 'false'}
                onClick={() =>
                  onTagChange(tag, !isPressed)
                }
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter status & reset. The status node is always mounted (empty when no
          filter is active) so screen readers announce count changes politely. */}
      <div className="filter-status">
        <span role="status" aria-live="polite" aria-atomic="true">
          {filtering && (
            <>
              Showing <strong>{shownArticles}</strong> of <strong>{totalArticles}</strong> articles
            </>
          )}
        </span>
        {filtering && (
          <button className="filter-reset" onClick={onReset}>
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
