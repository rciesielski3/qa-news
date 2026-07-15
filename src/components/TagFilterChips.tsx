'use client';

import type { Article } from '@/lib/filtering';

interface TagFilterChipsProps {
  articles: Article[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClear: () => void;
}

export default function TagFilterChips({
  articles,
  selectedTags,
  onTagToggle,
  onClear,
}: TagFilterChipsProps) {
  // Extract unique tags from the current article set.
  const uniqueTags = Array.from(new Set(articles.flatMap((a) => a.tags || []))).sort();

  if (uniqueTags.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-ink-600 bg-ink-900 px-5 py-4 sm:px-8">
      <div className="mb-3 flex items-center justify-between text-xs sm:text-sm">
        <span className="font-mono uppercase tracking-wide text-paper-muted">Filter by tags</span>
        {selectedTags.length > 0 && (
          <button
            onClick={onClear}
            className="font-medium text-signal-info transition hover:text-signal-pass"
          >
            Clear tags
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {uniqueTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              aria-pressed={isSelected}
              className={`rounded-full border-2 px-3 py-1 text-xs sm:text-sm font-medium transition ${
                isSelected
                  ? 'border-signal-info bg-signal-info text-ink-900'
                  : 'border-ink-600 text-paper-muted hover:border-paper-muted'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
