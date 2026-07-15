import type { Article } from '@/lib/types';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: Article[];
  dailyPickIds?: Set<string>;
}

export default function ArticleList({
  articles,
  dailyPickIds = new Set(),
}: ArticleListProps) {
  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <div key={article.id} className="border-b border-ink-600 pb-4 last:border-b-0">
          <ArticleCard
            article={article}
            isDailyPick={dailyPickIds.has(article.id)}
          />
        </div>
      ))}
    </div>
  );
}
