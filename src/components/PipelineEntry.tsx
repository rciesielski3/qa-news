import type { Article } from '@/lib/types';
import { getArticleSubtitle } from '@/lib/summarize';
import { getCategoryLabel } from '@/lib/styles';
import { formatDay } from '@/lib/format';

interface PipelineEntryProps {
  article: Article;
  /** 1-based position shown in the "#" column. */
  index?: number;
}

/** One row of the pipeline table: # | category | story | source + date | read. */
export default function PipelineEntry({ article, index }: PipelineEntryProps) {
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
    <li className="feed-row group" data-cat={article.category}>
      <span className="ix tnum" aria-hidden="true">
        {index !== undefined ? String(index).padStart(2, '0') : ''}
      </span>

      <span className="cat-label pill">{getCategoryLabel(article.category)}</span>

      <div className="ttl">
        <h3>
          <a href={article.url} target="_blank" rel="noreferrer" className="feed-link">
            {article.title}
          </a>
        </h3>
        {showSubtitle && <p className="sub line-clamp-2">{subtitle}</p>}
        {showDescription && <p className="sub line-clamp-2">{article.description}</p>}
      </div>

      <div className="m">
        <b>{article.source}</b>
        <span className="tnum">
          {formatDay(article.publishedAt)}
          {typeof article.score === 'number' ? ` · score ${article.score}` : ''}
        </span>
      </div>

      <span className="arr">
        Read<span aria-hidden="true"> ↗</span>
      </span>
    </li>
  );
}
