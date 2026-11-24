'use client';

import { useTrendingRepos, type TrendingRepo } from '@/hooks/useTrendingRepos';
import { useReveal, staggerDelay } from '@/hooks/useReveal';
import SectionHead from '@/components/SectionHead';
import { getCategoryLabel } from '@/lib/styles';
import { formatDay } from '@/lib/format';
import type { Category } from '@/lib/types';

export const MAX_TRENDING_REPOS = 6;
const MAX_DESCRIPTION_LENGTH = 120;

export function formatStars(stars: number): string {
  if (stars >= 1000) return `${(stars / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(stars);
}

export function truncate(text: string, max: number = MAX_DESCRIPTION_LENGTH): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

function RepoCard({ repo, index }: { repo: TrendingRepo; index: number }) {
  const { ref, className } = useReveal<HTMLLIElement>(staggerDelay(index));
  const description = truncate(repo.description || repo.summary || '');
  const label = repo.category ? getCategoryLabel(repo.category) : '';

  return (
    <li ref={ref} className={`tile repo ${className}`.trim()} data-cat={repo.category}>
      <div className="tlabel">
        {typeof repo.stars === 'number' && (
          <span className="stars" aria-label={`${repo.stars} stars`}>
            ★ {formatStars(repo.stars)}
          </span>
        )}
        <span className="go" aria-hidden="true">
          ↗
        </span>
      </div>
      <a href={repo.url} target="_blank" rel="noreferrer" className="nm feed-link">
        {repo.title}
      </a>
      {description && (
        <p className="sub" title={description}>
          {description}
        </p>
      )}
      <div className="meta">
        {label && <span className="cat-label">{label}</span>}
        {label && repo.publishedAt && (
          <span className="sep" aria-hidden="true">
            ·
          </span>
        )}
        {repo.publishedAt && <time dateTime={repo.publishedAt}>{formatDay(repo.publishedAt)}</time>}
      </div>
    </li>
  );
}

/** Presentational section: renders nothing for an empty list. */
export function TrendingReposView({ repos, band = false }: { repos: TrendingRepo[]; band?: boolean }) {
  const shown = repos.slice(0, MAX_TRENDING_REPOS);
  if (shown.length === 0) return null;

  return (
    <section id="repos" className={band ? 'sec band' : 'sec'} aria-labelledby="trending-repos-title">
      <div className="wrap">
        <SectionHead
          no="03"
          eyebrow="Open source"
          title="New & notable repos"
          titleId="trending-repos-title"
          sub="QA and AI-testing repos created in the last 60 days"
        />
        <ul className="repos">
          {shown.map((repo, i) => (
            <RepoCard key={repo.url} repo={repo} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/** "New & notable repos" on the Daily page. Fetches /trending.json; renders nothing when there is no data. */
export default function TrendingRepos() {
  const repos = useTrendingRepos();
  return <TrendingReposView repos={repos} />;
}
