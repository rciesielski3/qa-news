import type { Article } from '@/lib/types';
import BriefCard from './BriefCard';

interface DailyBriefCardProps {
  articles: Article[];
}

export default function DailyBriefCard({ articles }: DailyBriefCardProps) {
  const topSix = articles.slice(0, 6);

  return (
    <BriefCard
      title="Daily Brief — Top Picks"
      items={topSix.map((article) => ({
        id: article.id,
        title: article.title,
        category: article.category,
        source: article.source,
        url: article.url,
        isTopPick: true,
      }))}
    />
  );
}
