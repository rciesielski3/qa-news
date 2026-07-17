import type { Article } from '@/lib/types';
import { getCategoryLabel, categoryTextColorClass, categoryBgColorClass, categoryBgColorDarkInverted, categoryTextColorDarkInverted, getCategoryColorName } from '@/lib/styles';

interface TopPickCardProps {
  article: Article;
  rank: number;
}

export default function TopPickCard({ article, rank }: TopPickCardProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-ink-200 bg-paper p-6 dark:bg-ink-800 dark:border-ink-600">
      {/* Header: rank, category, top pick badge */}
      <div className="flex items-center justify-center gap-3 mb-4 text-center">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-100 font-mono text-sm font-bold text-ink-800 dark:bg-ink-600 dark:text-paper">
          {rank}
        </span>
        <span className={`font-mono text-xs uppercase tracking-widest ${categoryTextColorClass(article.category)} dark:brightness-125`}>
          {getCategoryLabel(article.category)}
        </span>
        <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border border-orange-300 dark:border-orange-700">
          Top Pick
        </span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl font-semibold leading-tight text-ink-800 mb-2 dark:text-paper text-center">
        {article.title}
      </h3>

      {/* Subtitle */}
      {article.subtitle && (
        <p className="text-sm text-ink-600 mb-3 dark:text-paper-muted text-center">
          {article.subtitle}
        </p>
      )}

      {/* Summary */}
      {article.summary && (
        <p className="text-sm leading-relaxed text-ink-600 mb-4 dark:text-paper-muted text-center">
          {article.summary}
        </p>
      )}

      {/* Read Article Button */}
      <a
        href={article.url}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-center justify-center rounded h-8 px-4 font-mono text-xs uppercase tracking-widest no-underline transition-opacity ${categoryBgColorClass(article.category)} ${categoryBgColorDarkInverted(article.category)} ${categoryTextColorClass(article.category)} ${categoryTextColorDarkInverted(article.category)} hover:opacity-90`}
      >
        Read Article →
      </a>
    </div>
  );
}
