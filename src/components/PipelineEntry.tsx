import type { Article } from '@/lib/types';
import { getCategoryLabel, categoryTextColorClass, categoryBgColorClass, getCategoryColor } from '@/lib/styles';

interface PipelineEntryProps {
  article: Article;
}

export default function PipelineEntry({ article }: PipelineEntryProps) {
  return (
    <li className="flex gap-3 py-3 border-b border-ink-200 dark:border-ink-600 group hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
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
        {article.subtitle && (
          <p className="text-xs text-ink-600 dark:text-paper-muted mb-2 line-clamp-1">
            {article.subtitle}
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

      {/* Read button */}
      <a
        href={article.url}
        target="_blank"
        rel="noreferrer"
        className={`flex-shrink-0 flex items-center justify-center text-xs font-mono uppercase tracking-widest no-underline px-3 py-1 rounded transition-opacity ${categoryBgColorClass(article.category)} ${categoryTextColorClass(article.category)} hover:opacity-90`}
      >
        Read
      </a>
    </li>
  );
}
