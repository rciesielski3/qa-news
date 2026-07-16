import type { Article } from '@/lib/types';
import { getCategoryLabel } from '@/lib/styles';

interface ArticleCardProps {
  article: Article;
  isTopPick?: boolean;
}

export default function ArticleCard({
  article,
  isTopPick = false,
}: ArticleCardProps) {
  return (
    <li>
      <article className="article-card" data-cat={article.category}>
        {/* Meta row: category label + top pick marker + source */}
        <div className="article-meta">
          <span className="cat">{getCategoryLabel(article.category)}</span>
          {isTopPick && <span className="toppick">★ Top Pick</span>}
          <span className="sep">·</span>
          <span className="src">{article.source}</span>
        </div>

        {/* Title */}
        <h3 className="article-title">
          <a href={article.url}>{article.title}</a>
        </h3>

        {/* Tags (if present) */}
        {article.tags.length > 0 && (
          <div className="article-tags">
            {article.tags.map(tag => (
              <span key={tag} className="chip-tag">{tag}</span>
            ))}
          </div>
        )}
      </article>
    </li>
  );
}
