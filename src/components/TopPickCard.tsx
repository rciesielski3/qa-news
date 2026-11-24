'use client';

import type { Article } from '@/lib/types';
import { getArticleSubtitle } from '@/lib/summarize';
import { getCategoryLabel } from '@/lib/styles';
import { formatDay } from '@/lib/format';
import { useReveal } from '@/hooks/useReveal';

interface TopPickCardProps {
  article: Article;
  rank: number;
  /** Entrance delay in ms (stagger inside a grid). */
  revealDelay?: number;
}

export default function TopPickCard({ article, rank, revealDelay = 0 }: TopPickCardProps) {
  const subtitle = getArticleSubtitle(article);
  const { ref, className } = useReveal<HTMLElement>(revealDelay);

  return (
    <article
      ref={ref}
      data-cat={article.category}
      data-rank={rank}
      className={`tile pickcard flex flex-col justify-between ${className}`.trim()}
    >
      {/* Header: rank, category, top pick star */}
      <div className="flex-shrink-0 tlabel">
        <span className="rank">{rank}</span>
        <span className="cat-label">{getCategoryLabel(article.category)}</span>
        <span className="star text-orange-600 dark:text-orange-400" aria-hidden="true">
          ★
        </span>
      </div>

      {/* Body: title + subtitle */}
      <div className="pc-body">
        <h3 className="pc-title">{article.title}</h3>
        {subtitle && <p className="sub line-clamp-2">{subtitle}</p>}
      </div>

      <div className="meta">
        <span>{article.source}</span>
        <span className="sep" aria-hidden="true">
          ·
        </span>
        <time dateTime={article.publishedAt}>{formatDay(article.publishedAt)}</time>
        {typeof article.score === 'number' && (
          <span className="score" title="Relevance score">
            {article.score}
          </span>
        )}
      </div>

      {/* Read link: stretched over the whole card via ::after */}
      <a
        href={article.url}
        target="_blank"
        rel="noreferrer"
        className="flex-shrink-0 pick-link"
      >
        Read Article →
      </a>
    </article>
  );
}
