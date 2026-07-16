'use client';

interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16">
      {/* Generic empty state message using design tokens */}
      <p className="text-base sm:text-lg text-2">No articles match these filters</p>
      <button
        onClick={onReset}
        className="mt-4 accent transition text-sm"
      >
        Reset filters
      </button>
    </div>
  );
}
