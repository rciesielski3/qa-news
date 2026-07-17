import SkeletonLoader from './SkeletonLoader';

export default function SkeletonTopPickCard() {
  return (
    <div className="rounded-lg border border-ink-200 bg-paper p-6 dark:bg-ink-800 dark:border-ink-600 space-y-4">
      {/* Header: rank + category + badge */}
      <div className="flex items-center gap-3 mb-4">
        <SkeletonLoader width="w-8" height="h-8" className="rounded-full" />
        <SkeletonLoader width="w-24" height="h-4" />
        <SkeletonLoader width="w-20" height="h-6" className="rounded-full" />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <SkeletonLoader width="w-full" height="h-6" />
        <SkeletonLoader width="w-5/6" height="h-6" />
      </div>

      {/* Subtitle */}
      <SkeletonLoader width="w-full" height="h-4" />

      {/* Summary */}
      <div className="space-y-2">
        <SkeletonLoader width="w-full" height="h-4" />
        <SkeletonLoader width="w-4/5" height="h-4" />
      </div>

      {/* Button */}
      <SkeletonLoader width="w-32" height="h-8" className="rounded" />
    </div>
  );
}
