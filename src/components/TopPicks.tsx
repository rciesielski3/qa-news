import type { Article } from '@/lib/types';
import TopPickCard from '@/components/TopPickCard';
import SkeletonTopPickCard from '@/components/SkeletonTopPickCard';
import { staggerDelay } from '@/hooks/useReveal';

interface TopPicksProps {
  /** Already ranked, best first. The first one is rendered as the large featured card. */
  articles: Article[];
  isLoading?: boolean;
}

/** Top picks grid: #1 large on the left (spans two rows), #2 and #3 stacked on the right. */
export default function TopPicks({ articles, isLoading = false }: TopPicksProps) {
  if (isLoading) {
    return (
      <div className="picks" aria-busy="true">
        <SkeletonTopPickCard />
        <SkeletonTopPickCard />
        <SkeletonTopPickCard />
      </div>
    );
  }

  if (articles.length === 0) {
    return <p className="text-2">No top picks for today.</p>;
  }

  return (
    <div className="picks">
      {articles.map((article, i) => (
        <TopPickCard key={article.id} article={article} rank={i + 1} revealDelay={staggerDelay(i)} />
      ))}
    </div>
  );
}
