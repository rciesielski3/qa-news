import type { Article } from '@/lib/types';
import ArticleCard from './ArticleCard';

interface DailyBriefCardProps {
  articles: Article[];
}

export default function DailyBriefCard({ articles }: DailyBriefCardProps) {
  const topSix = articles.slice(0, 6);

  return (
    <div className="rounded-lg border-l-4 border-signal-pass bg-gradient-to-br from-signal-pass/5 to-transparent p-6">
      <h2 className="font-serif text-lg font-semibold text-paper">
        Daily Brief — Top Picks
      </h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {topSix.map((article) => (
          <div key={article.id}>
            <ArticleCard article={article} isDailyPick compact />
          </div>
        ))}
      </div>
    </div>
  );
}
