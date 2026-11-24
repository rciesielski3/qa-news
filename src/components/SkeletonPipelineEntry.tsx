import SkeletonLoader from './SkeletonLoader';

export default function SkeletonPipelineEntry() {
  return (
    <li className="feed-row feed-row-skel" aria-hidden="true">
      <SkeletonLoader width="w-6" height="h-4" />
      <SkeletonLoader width="w-24" height="h-6" className="rounded-full" />
      <div className="ttl">
        <SkeletonLoader width="w-3/4" height="h-5" />
        <SkeletonLoader width="w-full" height="h-4" />
      </div>
      <div className="m">
        <SkeletonLoader width="w-20" height="h-4" />
        <SkeletonLoader width="w-16" height="h-3" />
      </div>
      <span />
    </li>
  );
}
