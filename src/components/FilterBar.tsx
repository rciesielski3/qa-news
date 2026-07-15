'use client';

import type { Category } from '@/lib/types';
import { CATEGORY_META } from '@/lib/category';
import { categoryTextClass, categoryBgClass, getCategoryLabel } from '@/lib/styles';

interface FilterBarProps {
  selectedCategory?: Category;
  hasActiveFilters: boolean;
  articleCount: number;
  totalCount: number;
  onCategorySelect: (category: Category) => void;
  onClearFilters: () => void;
}

const CATEGORIES: Category[] = ['test-automation', 'qa-practice', 'tooling', 'engineering', 'ai'];

export default function FilterBar({
  selectedCategory,
  hasActiveFilters,
  articleCount,
  totalCount,
  onCategorySelect,
  onClearFilters,
}: FilterBarProps) {
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category buttons */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => {
            const meta = CATEGORY_META[category];
            const isActive = selectedCategory === category;
            const textColor = categoryTextClass(category);
            const bgColor = categoryBgClass(category);

            return (
              <button
                key={category}
                onClick={() => onCategorySelect(category)}
                className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? `${bgColor} border-current ${textColor}`
                    : `border-current ${textColor} bg-transparent hover:opacity-80`
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: meta.dot.replace('bg-', '').includes('-')
                          ? undefined
                          : undefined,
                      }
                    : undefined
                }
                aria-pressed={isActive}
              >
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={`h-2 w-2 rounded-full ${meta.dot}`}
                  />
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Status and reset */}
        {hasActiveFilters && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">
              Showing <strong>{articleCount}</strong> of <strong>{totalCount}</strong> articles
            </span>
            <button
              onClick={onClearFilters}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
