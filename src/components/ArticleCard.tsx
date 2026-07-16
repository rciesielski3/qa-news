import type { Article } from '@/lib/types';
import { CATEGORY_META } from '@/lib/category';
import {
  categoryBgClass,
  categoryColorClass,
  categoryTextColorClass,
  getCategoryColor,
  getCategoryLabel,
  getCategoryTextColor,
} from '@/lib/styles';

interface ArticleCardProps {
  article: Article;
  isDailyPick?: boolean;
  compact?: boolean;
}

export default function ArticleCard({
  article,
  isDailyPick = false,
  compact = false,
}: ArticleCardProps) {
  // Fallback for missing category
  const fallbackMeta = {
    label: getCategoryLabel(article.category),
    color: getCategoryColor(article.category),
    dot: categoryColorClass(article.category),
    text: categoryTextColorClass(article.category),
  };
  const meta = CATEGORY_META[article.category] || fallbackMeta;
  const categoryTextColor = getCategoryTextColor(article.category);

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-start gap-2 text-sm font-medium text-paper hover:underline"
        >
          <span
            aria-hidden
            className={`mt-1 flex-shrink-0 h-2 w-2 rounded-full ${meta.dot}`}
          />
          <span className="flex-1 leading-snug">{article.title}</span>
        </a>
        <div className="ml-4 flex flex-wrap gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wide" style={{ color: getCategoryColor(article.category) }}>
            {meta.label}
          </span>
          {isDailyPick && (
            <span className="text-[11px] font-mono uppercase tracking-wide text-signal-pin">
              Top Pick
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <article className={`rounded-lg border border-ink-600 p-4 ${categoryBgClass(article.category)}`}>
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={`mt-1 flex-shrink-0 h-3 w-3 rounded-full ${meta.dot}`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-ink-500">
            <span className={meta.text}>{meta.label}</span>
            {isDailyPick && (
              <span className="text-signal-pin">✦ Top Pick</span>
            )}
            <span aria-hidden>·</span>
            <span>{article.source}</span>
          </div>

          <h3 className="mt-2 font-serif text-base font-medium leading-snug" style={{ color: categoryTextColor }}>
            <a
              href={article.url}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:underline"
            >
              {article.title}
            </a>
          </h3>

          {article.tags.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2 font-mono text-[10px] text-ink-500">
              {article.tags.map((tag) => (
                <li key={tag} className="rounded border border-ink-600 px-1 py-0.5">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
