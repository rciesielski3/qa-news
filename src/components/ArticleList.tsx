import type { Article } from '@/lib/types';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: Article[];
  topPickIds?: Set<string>;
}

export default function ArticleList({
  articles,
  topPickIds = new Set(),
}: ArticleListProps) {
  return (
    <ul className="feed">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          isTopPick={topPickIds.has(article.id)}
        />
      ))}
    </ul>
  );
}
