import type { Article } from '@/lib/types';
import { getCategoryLabel, categoryTextColorClass } from '@/lib/styles';

interface PipelineEntryProps {
  article: Article;
}

function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    'test-automation': '#FF6B9D',
    'ai-integration': '#4ECDC4',
    'performance': '#45B7D1',
    'security': '#F7DC6F',
    'devops': '#BB8FCE',
    'frontend': '#85C1E2',
    'backend': '#F8B88B',
    'mobile': '#82E0AA',
  };
  return colorMap[category] || '#A9A9A9';
}

export default function PipelineEntry({ article }: PipelineEntryProps) {
  return (
    <li className="flex gap-3 py-3 border-b border-ink-600 dark:border-ink-600 group hover:bg-ink-800 dark:hover:bg-ink-800 transition-colors">
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
          <h4 className="font-serif text-sm font-semibold text-paper dark:text-paper truncate">
            {article.title}
          </h4>
        </div>

        {/* Subtitle */}
        <p className="text-xs text-paper-muted dark:text-paper-muted mb-2 line-clamp-1">
          {article.subtitle}
        </p>

        {/* Metadata row */}
        <div className="flex items-center gap-2 text-xs font-mono text-paper-faint dark:text-paper-faint">
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
        className={`flex-shrink-0 text-xs font-mono uppercase tracking-widest no-underline px-2 py-1 rounded border ${categoryTextColorClass(article.category)} border-current hover:bg-ink-700 dark:hover:bg-ink-700 transition-colors`}
      >
        Read
      </a>
    </li>
  );
}
