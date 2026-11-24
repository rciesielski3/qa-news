import SkeletonLoader from './SkeletonLoader';

export default function SkeletonTopPickCard() {
  return (
    <div className="tile pickcard pickcard-skel" aria-hidden="true">
      {/* Header: rank + category */}
      <div className="skel-row">
        <SkeletonLoader width="w-6" height="h-6" className="rounded-md" />
        <SkeletonLoader width="w-24" height="h-4" />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <SkeletonLoader width="w-full" height="h-6" />
        <SkeletonLoader width="w-5/6" height="h-6" />
      </div>

      {/* Subtitle */}
      <div className="space-y-2">
        <SkeletonLoader width="w-full" height="h-4" />
        <SkeletonLoader width="w-4/5" height="h-4" />
      </div>

      {/* Meta */}
      <SkeletonLoader width="w-32" height="h-4" />
    </div>
  );
}
