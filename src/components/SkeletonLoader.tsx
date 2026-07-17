interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  className?: string;
}

export default function SkeletonLoader({
  width = 'w-full',
  height = 'h-4',
  className = '',
}: SkeletonLoaderProps) {
  return <div className={`skeleton rounded ${width} ${height} ${className}`} aria-busy="true" />;
}
