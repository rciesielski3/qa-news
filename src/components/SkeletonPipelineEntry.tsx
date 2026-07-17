import SkeletonLoader from './SkeletonLoader';

export default function SkeletonPipelineEntry() {
  return (
    <li className="flex gap-4 py-3 border-b border-ink-200 dark:border-ink-700 last:border-b-0">
      {/* Category dot + badge */}
      <div className="flex-shrink-0 flex items-center gap-2">
        <SkeletonLoader width="w-5" height="h-5" className="rounded-full" />
        <SkeletonLoader width="w-16" height="h-4" className="rounded-full" />
      </div>

      {/* Title and subtitle */}
      <div className="flex-1 min-w-0 space-y-2">
        <SkeletonLoader width="w-3/4" height="h-5" />
        <SkeletonLoader width="w-full" height="h-4" />
      </div>

      {/* Read button */}
      <div className="flex-shrink-0 mt-1">
        <SkeletonLoader width="w-20" height="h-6" className="rounded" />
      </div>
    </li>
  );
}
