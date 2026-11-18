import { useTrendingRepos } from '@/hooks/useTrendingRepos';
import { CATEGORY_META } from '@/lib/category';
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

/** "New & notable repos" on the Daily page. Renders nothing when there is no data. */
export default function TrendingRepos() {
  const repos = useTrendingRepos().slice(0, MAX_TRENDING_REPOS);
  if (repos.length === 0) return null;

  return (
    <section aria-labelledby="trending-repos-title">
      <h2 id="trending-repos-title" className="section-title py-3">
        New &amp; notable repos
      </h2>
      <p className="mb-4 text-xs text-ink-400 dark:text-paper-faint">
        QA and AI-testing repos created in the last 60 days
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {repos.map((repo) => {
          const meta = CATEGORY_META[repo.category as Category];
          const description = truncate(repo.description || repo.summary || '');
          return (
            <li
              key={repo.url}
              className="flex gap-3 py-3 items-start border-b border-ink-200 dark:border-ink-600"
            >
              <span
                className={`mt-1.5 w-2 h-2 flex-shrink-0 rounded-full ${meta?.dot ?? 'bg-gray-400'}`}
                title={meta?.label}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-grow">
                <div className="flex items-baseline justify-between gap-2">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-sm font-semibold text-ink-800 dark:text-paper truncate"
                  >
                    {repo.title}
                  </a>
                  {typeof repo.stars === 'number' && (
                    <span
                      className="flex-shrink-0 font-mono text-xs text-ink-400 dark:text-paper-faint"
                      aria-label={`${repo.stars} stars`}
                    >
                      ★ {formatStars(repo.stars)}
                    </span>
                  )}
                </div>
                {description && (
                  <p className="mt-1 text-xs text-ink-600 dark:text-paper-muted truncate" title={description}>
                    {description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
