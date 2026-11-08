import Link from 'next/link';
import type { Article } from '@/lib/types';
import { getArticleSubtitle } from '@/lib/summarize';
import { getCategoryLabel, categoryTextColorClass, categoryBgColorClass, categoryBgColorDarkInverted, categoryTextColorDarkInverted, getCategoryColor } from '@/lib/styles';

interface PipelineEntryProps {
  article: Article;
}

export default function PipelineEntry({ article }: PipelineEntryProps) {
  const subtitle = getArticleSubtitle(article);
  // Compare whitespace-normalized, case-insensitive text so newlines or
  // double spaces in the RSS description cannot hide a duplicate.
  const norm = (text: string) => text.replace(/\s+/g, ' ').trim().toLowerCase();
  const subtitleNorm = norm(subtitle);
  const descriptionNorm = norm(article.description ?? '');
  const subtitleIsDescription = subtitleNorm !== '' && subtitleNorm === descriptionNorm;
  // Skip the subtitle when the description below already contains it.
  // Exception: when they are identical, the subtitle is the one shown.
  const showSubtitle =
    subtitleNorm !== '' &&
    (subtitleIsDescription || !descriptionNorm.includes(subtitleNorm));
  // The description repeats the subtitle only when it is the subtitle's source.
  const showDescription = descriptionNorm !== '' && !subtitleIsDescription;

  return (
    <Link href={article.url} target="_blank" rel="noreferrer" className="no-underline hover:no-underline">
      <li className="flex gap-3 py-3 items-center border-b border-ink-200 dark:border-ink-600 group hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors cursor-pointer">
        {/* Category dot */}
        <div className="flex-shrink-0 flex items-start justify-center pt-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: getCategoryColor(article.category),
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <h4 className="font-serif text-sm font-semibold text-ink-800 dark:text-paper truncate">
              {article.title}
            </h4>
          </div>

          {/* Subtitle */}
          {showSubtitle && (
            <p className="text-xs text-ink-600 dark:text-paper-muted mb-2 line-clamp-2">
              {subtitle}
            </p>
          )}

          {/* Description */}
          {showDescription && (
            <p className="text-xs text-ink-600 dark:text-paper-muted mb-2 line-clamp-2">
              {article.description}
            </p>
          )}

          {/* Metadata row */}
          <div className="flex items-center gap-2 text-xs font-mono text-ink-400 dark:text-paper-faint">
            <span>{article.source}</span>
            <span>•</span>
            <span>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span>•</span>
            <span className={categoryTextColorClass(article.category)}>
              {getCategoryLabel(article.category)}
            </span>
          </div>
        </div>

        {/* Read button (visual indicator, no separate link) */}
        <div
          className={`flex-shrink-0 flex items-center justify-center text-xs font-mono uppercase tracking-widest no-underline h-8 px-4 rounded transition-transform group-hover:scale-110 ${categoryBgColorClass(article.category)} ${categoryBgColorDarkInverted(article.category)} ${categoryTextColorClass(article.category)} ${categoryTextColorDarkInverted(article.category)}`}
        >
          Read
        </div>
      </li>
    </Link>
  );
}
