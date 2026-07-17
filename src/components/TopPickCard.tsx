import type { Article } from '@/lib/types';
import { getCategoryLabel, categoryTextColorClass, categoryBgColorClass } from '@/lib/styles';

interface TopPickCardProps {
  article: Article;
  rank: number;
}

export default function TopPickCard({ article, rank }: TopPickCardProps) {
  return (
    <div className="rounded-lg border border-ink-200 bg-paper p-6 dark:bg-ink-800 dark:border-ink-600">
      {/* Header: rank, category, top pick badge */}
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-100 font-mono text-sm font-bold text-ink-800 dark:bg-ink-600 dark:text-paper">
          {rank}
        </span>
        <span className={`font-mono text-xs uppercase tracking-widest ${categoryTextColorClass(article.category)}`}>
          {getCategoryLabel(article.category)}
        </span>
        <span className={`ml-auto text-xs font-mono uppercase tracking-widest px-2 py-1 rounded ${categoryBgColorClass(article.category)} ${categoryTextColorClass(article.category)} border-current`}>
          Top Pick
        </span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl font-semibold leading-tight text-ink-800 mb-2 dark:text-paper">
        {article.title}
      </h3>

      {/* Subtitle */}
      {article.subtitle && (
        <p className="text-sm text-ink-600 mb-3 dark:text-paper-muted">
          {article.subtitle}
        </p>
      )}

      {/* Summary */}
      {article.summary && (
        <p className="text-sm leading-relaxed text-ink-600 mb-4 dark:text-paper-muted">
          {article.summary}
        </p>
      )}

      {/* Read Article Button */}
      <a
        href={article.url}
        target="_blank"
        rel="noreferrer"
        className={`inline-block rounded border px-4 py-2 font-mono text-xs uppercase tracking-widest no-underline transition-colors ${categoryTextColorClass(article.category)} border-current hover:bg-ink-50 dark:hover:bg-ink-700`}
      >
        Read Article →
      </a>
    </div>
  );
}
