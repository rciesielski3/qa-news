'use client';

interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p className="text-base sm:text-lg text-2">No articles match these filters</p>
      <button onClick={onReset} className="accent transition text-sm">
        Reset filters
      </button>
    </div>
  );
}
