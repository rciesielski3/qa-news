'use client';

interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <p className="text-lg text-gray-600">No articles match these filters</p>
      <button
        onClick={onReset}
        className="mt-4 text-blue-600 hover:text-blue-800 hover:underline"
      >
        Reset filters
      </button>
    </div>
  );
}
