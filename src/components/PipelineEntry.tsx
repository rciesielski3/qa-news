import type { Article } from '@/lib/types';
import { CATEGORY_META } from '@/lib/category';
import { formatDay, formatTime } from '@/lib/format';

export default function PipelineEntry({ article }: { article: Article }) {
  const meta = CATEGORY_META[article.category];

  return (
    <li className="pipeline-rail fade-in-up pl-7">
      <span
        aria-hidden
        className={`absolute left-0 top-[0.4rem] h-3 w-3 rounded-full ring-4 ring-ink-900 ${meta.dot}`}
      />

      <div className="pb-9">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-paper-faint">
          <time dateTime={article.publishedAt}>{formatDay(article.publishedAt)}</time>
          <span aria-hidden>·</span>
          <time dateTime={article.publishedAt}>{formatTime(article.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span className={meta.text}>{meta.label}</span>
          <span aria-hidden>·</span>
          <span>{article.source}</span>
        </div>

        <h3 className="mt-2 font-serif text-lg font-medium leading-snug text-paper">
          <a href={article.url} target="_blank" rel="noreferrer noopener">
            {article.title}
          </a>
        </h3>

        <p className="mt-1.5 max-w-[60ch] text-[15px] leading-relaxed text-paper-muted">
          {article.summary}
        </p>

        {article.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2 font-mono text-[11px] text-paper-faint">
            {article.tags.map((tag) => (
              <li key={tag} className="rounded border border-ink-600 px-1.5 py-0.5">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
