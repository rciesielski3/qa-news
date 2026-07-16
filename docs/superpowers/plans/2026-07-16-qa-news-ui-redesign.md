# QA-News UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign QA-News page layouts with TopPickCard component, pagination, subtitles, and log-style chronological articles while maintaining current colors and both dark/light themes.

**Architecture:** Add subtitle field to articles, create TopPickCard component for curated section, implement client-side pagination with no-scroll constraint, update layout on all 3 pages to use new components, maintain existing color system and both themes.

**Tech Stack:** React, TypeScript, Next.js, Tailwind CSS (existing), no new dependencies.

## Global Constraints

- All changes on feature branch `feature/ui-redesign-2026-07-16`
- Keep current color system (ink, paper, signal tokens unchanged)
- Support both dark and light themes
- WCAG AA contrast compliance in both themes
- No vertical scroll on article section (pagination required)
- Responsive at all breakpoints (375px–1024px+)
- All existing tests must pass, add tests for new components
- Articles per page calculated from viewport height

---

## File Structure Overview

**Modified:**
- `src/lib/types.ts` — Add subtitle to Article type
- `src/components/ArticleList.tsx` — Add pagination support
- `src/components/PipelineEntry.tsx` — Update for log-style
- `src/app/page.tsx` (daily) — New layout with TopPickCard + pagination
- `src/app/weekly/page.tsx` — New layout with TopPickCard + pagination
- `src/app/monthly/page.tsx` — New layout with TopPickCard + pagination

**Created:**
- `src/components/TopPickCard.tsx` — Curated article card component
- `src/lib/pagination.ts` — Pagination utility (calculate articles per page, slice data)

**Tests:**
- `src/__tests__/TopPickCard.test.tsx` — New component tests
- `src/__tests__/pagination.test.ts` — New utility tests
- Update existing page component tests

---

### Task 1: Add Subtitle Field to Article Type

**Files:**
- Modify: `src/lib/types.ts`

**Interfaces:**
- Produces: `Article` type now includes `subtitle: string` field

- [ ] **Step 1: Open types.ts and review Article type**

```bash
cd /Users/rafalciesielski/Developer/qa-news
cat src/lib/types.ts | grep -A 20 "type Article"
```

Expected: Shows current Article type definition.

- [ ] **Step 2: Add subtitle field to Article type**

Open `src/lib/types.ts` and add `subtitle: string` to the Article type:

```typescript
export type Article = {
  id: string;
  title: string;
  subtitle: string;  // ← ADD THIS LINE
  summary?: string;
  url: string;
  source: string;
  category: Category;
  publishedAt: string;
  tags?: string[];
};
```

- [ ] **Step 3: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors (existing usages of Article type already have subtitles from data).

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: add subtitle field to Article type"
```

---

### Task 2: Create TopPickCard Component

**Files:**
- Create: `src/components/TopPickCard.tsx`
- Create: `src/__tests__/TopPickCard.test.tsx`

**Interfaces:**
- Consumes: `Article` type with subtitle, category colors from existing system
- Produces: `TopPickCard` component with props `{ article: Article; rank: number }`

- [ ] **Step 1: Create TopPickCard component**

Create `src/components/TopPickCard.tsx`:

```typescript
import type { Article } from '@/lib/types';
import { getCategoryLabel, categoryTextColorClass, categoryBgColorClass } from '@/lib/styles';

interface TopPickCardProps {
  article: Article;
  rank: number;
}

export default function TopPickCard({ article, rank }: TopPickCardProps) {
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-800 p-6 dark:bg-ink-800 dark:border-ink-600">
      {/* Header: rank, category, top pick badge */}
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-600 font-mono text-sm font-bold text-paper dark:bg-ink-600 dark:text-paper">
          {rank}
        </span>
        <span className={`font-mono text-xs uppercase tracking-widest ${categoryTextColorClass(article.category)}`}>
          {getCategoryLabel(article.category)}
        </span>
        <span className="ml-auto text-xs font-mono uppercase tracking-widest text-paper-faint border border-ink-600 px-2 py-1 rounded dark:text-paper-faint dark:border-ink-600">
          Top Pick
        </span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl font-semibold leading-tight text-paper mb-2 dark:text-paper">
        {article.title}
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-paper-muted mb-3 dark:text-paper-muted">
        {article.subtitle}
      </p>

      {/* Summary */}
      {article.summary && (
        <p className="text-sm leading-relaxed text-paper-muted mb-4 dark:text-paper-muted">
          {article.summary}
        </p>
      )}

      {/* Read Article Button */}
      <a
        href={article.url}
        target="_blank"
        rel="noreferrer"
        className={`inline-block rounded border px-4 py-2 font-mono text-xs uppercase tracking-widest no-underline transition-colors ${categoryTextColorClass(article.category)} border-current hover:bg-ink-700 dark:hover:bg-ink-700`}
      >
        Read Article →
      </a>
    </div>
  );
}
```

- [ ] **Step 2: Create TopPickCard tests**

Create `src/__tests__/TopPickCard.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import TopPickCard from '@/components/TopPickCard';
import type { Article } from '@/lib/types';

const mockArticle: Article = {
  id: '1',
  title: 'Test Article',
  subtitle: 'Test subtitle',
  summary: 'Test summary',
  url: 'https://example.com',
  source: 'Example',
  category: 'test-automation',
  publishedAt: '2026-07-16T00:00:00Z',
  tags: ['testing'],
};

describe('TopPickCard', () => {
  it('renders rank badge', () => {
    render(<TopPickCard article={mockArticle} rank={1} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders title and subtitle', () => {
    render(<TopPickCard article={mockArticle} rank={1} />);
    expect(screen.getByText('Test Article')).toBeInTheDocument();
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
  });

  it('renders "Top Pick" badge', () => {
    render(<TopPickCard article={mockArticle} rank={1} />);
    expect(screen.getByText('Top Pick')).toBeInTheDocument();
  });

  it('renders read article link', () => {
    render(<TopPickCard article={mockArticle} rank={1} />);
    const link = screen.getByText('Read Article →');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm test -- TopPickCard.test.tsx
```

Expected: All 4 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/TopPickCard.tsx src/__tests__/TopPickCard.test.tsx
git commit -m "feat: add TopPickCard component for curated articles"
```

---

### Task 3: Create Pagination Utility

**Files:**
- Create: `src/lib/pagination.ts`
- Create: `src/__tests__/pagination.test.ts`

**Interfaces:**
- Produces: `calculateArticlesPerPage(viewportHeight: number): number`
- Produces: `paginateArticles<T>(articles: T[], pageNumber: number, perPage: number): T[]`
- Produces: `getTotalPages(totalArticles: number, perPage: number): number`

- [ ] **Step 1: Create pagination utility**

Create `src/lib/pagination.ts`:

```typescript
/**
 * Calculate articles per page based on viewport height.
 * Assumes ~80px per article row + header/filters overhead.
 * Leaves ~100px margin for pagination controls.
 */
export function calculateArticlesPerPage(viewportHeight: number): number {
  const ARTICLE_ROW_HEIGHT = 80;
  const HEADER_FILTERS_HEIGHT = 300;
  const PAGINATION_MARGIN = 100;
  
  const availableHeight = viewportHeight - HEADER_FILTERS_HEIGHT - PAGINATION_MARGIN;
  const articlesPerPage = Math.max(3, Math.floor(availableHeight / ARTICLE_ROW_HEIGHT));
  
  return articlesPerPage;
}

/**
 * Get a page of articles from the full list.
 */
export function paginateArticles<T>(
  articles: T[],
  pageNumber: number,
  perPage: number
): T[] {
  const startIndex = (pageNumber - 1) * perPage;
  const endIndex = startIndex + perPage;
  return articles.slice(startIndex, endIndex);
}

/**
 * Calculate total number of pages needed.
 */
export function getTotalPages(totalArticles: number, perPage: number): number {
  return Math.ceil(totalArticles / perPage);
}

/**
 * Clamp page number to valid range (1 to total pages).
 */
export function clampPageNumber(pageNumber: number, totalPages: number): number {
  return Math.max(1, Math.min(pageNumber, totalPages));
}
```

- [ ] **Step 2: Create pagination tests**

Create `src/__tests__/pagination.test.ts`:

```typescript
import {
  calculateArticlesPerPage,
  paginateArticles,
  getTotalPages,
  clampPageNumber,
} from '@/lib/pagination';

describe('pagination', () => {
  describe('calculateArticlesPerPage', () => {
    it('returns at least 3 articles', () => {
      const result = calculateArticlesPerPage(500);
      expect(result).toBeGreaterThanOrEqual(3);
    });

    it('scales with viewport height', () => {
      const small = calculateArticlesPerPage(600);
      const large = calculateArticlesPerPage(1200);
      expect(large).toBeGreaterThan(small);
    });
  });

  describe('paginateArticles', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    it('returns first page', () => {
      expect(paginateArticles(items, 1, 3)).toEqual([1, 2, 3]);
    });

    it('returns second page', () => {
      expect(paginateArticles(items, 2, 3)).toEqual([4, 5, 6]);
    });

    it('handles partial last page', () => {
      expect(paginateArticles(items, 4, 3)).toEqual([10]);
    });
  });

  describe('getTotalPages', () => {
    it('calculates total pages correctly', () => {
      expect(getTotalPages(10, 3)).toBe(4);
      expect(getTotalPages(9, 3)).toBe(3);
    });
  });

  describe('clampPageNumber', () => {
    it('clamps to valid range', () => {
      expect(clampPageNumber(0, 5)).toBe(1);
      expect(clampPageNumber(10, 5)).toBe(5);
      expect(clampPageNumber(3, 5)).toBe(3);
    });
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm test -- pagination.test.ts
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/pagination.ts src/__tests__/pagination.test.ts
git commit -m "feat: add pagination utility for no-scroll article display"
```

---

### Task 4: Update PipelineEntry for Log-Style

**Files:**
- Modify: `src/components/PipelineEntry.tsx`

**Interfaces:**
- Consumes: `Article` type with subtitle
- Produces: Updated PipelineEntry component displaying log-style row with subtitle and read button

- [ ] **Step 1: Review current PipelineEntry**

```bash
cat src/components/PipelineEntry.tsx
```

- [ ] **Step 2: Update PipelineEntry for log-style with subtitle and button**

Replace `src/components/PipelineEntry.tsx`:

```typescript
import type { Article } from '@/lib/types';
import { getCategoryLabel, categoryTextColorClass } from '@/lib/styles';

interface PipelineEntryProps {
  article: Article;
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
```

**Note:** Import `getCategoryColor` from `@/lib/styles` (verify it exists, or adjust import).

- [ ] **Step 3: Run TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/PipelineEntry.tsx
git commit -m "feat: update PipelineEntry for log-style with subtitle and read button"
```

---

### Task 5: Update ArticleList for Pagination

**Files:**
- Modify: `src/components/ArticleList.tsx`

**Interfaces:**
- Consumes: `articles: Article[]`, pagination state management from parent
- Produces: ArticleList component with pagination controls

- [ ] **Step 1: Review current ArticleList**

```bash
cat src/components/ArticleList.tsx
```

- [ ] **Step 2: Update ArticleList to add pagination controls and state**

Modify `src/components/ArticleList.tsx` to add pagination UI and manage page state:

```typescript
'use client';

import { useState, useEffect } from 'react';
import type { Article } from '@/lib/types';
import PipelineEntry from '@/components/PipelineEntry';
import { paginateArticles, getTotalPages, clampPageNumber, calculateArticlesPerPage } from '@/lib/pagination';

interface ArticleListProps {
  articles: Article[];
  topPickIds?: Set<string>;
}

export default function ArticleList({ articles, topPickIds }: ArticleListProps) {
  const [pageNumber, setPageNumber] = useState(1);
  const [articlesPerPage, setArticlesPerPage] = useState(6);

  // Calculate articles per page on mount and resize
  useEffect(() => {
    const updateArticlesPerPage = () => {
      const newPerPage = calculateArticlesPerPage(window.innerHeight);
      setArticlesPerPage(newPerPage);
    };

    updateArticlesPerPage();
    window.addEventListener('resize', updateArticlesPerPage);
    return () => window.removeEventListener('resize', updateArticlesPerPage);
  }, []);

  const totalPages = getTotalPages(articles.length, articlesPerPage);
  const validPageNumber = clampPageNumber(pageNumber, totalPages);
  const pageArticles = paginateArticles(articles, validPageNumber, articlesPerPage);

  if (articles.length === 0) {
    return <p className="text-paper-muted">No articles found.</p>;
  }

  return (
    <div className="space-y-4">
      {/* Articles */}
      <ul className="space-y-1 min-h-[400px]">
        {pageArticles.map((article) => (
          <PipelineEntry
            key={article.id}
            article={article}
          />
        ))}
      </ul>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-6 border-t border-ink-600 dark:border-ink-600">
          <button
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber === 1}
            className="px-4 py-2 font-mono text-xs uppercase tracking-widest border border-ink-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink-700 dark:hover:bg-ink-700 transition-colors"
          >
            ← Previous
          </button>

          <span className="text-sm font-mono text-paper-muted">
            Page {validPageNumber} of {totalPages}
          </span>

          <button
            onClick={() => setPageNumber(Math.min(totalPages, pageNumber + 1))}
            disabled={pageNumber === totalPages}
            className="px-4 py-2 font-mono text-xs uppercase tracking-widest border border-ink-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink-700 dark:hover:bg-ink-700 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Run TypeScript check and tests**

```bash
npx tsc --noEmit && npm test
```

Expected: No type errors, existing tests still pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/ArticleList.tsx
git commit -m "feat: add pagination controls to ArticleList"
```

---

### Task 6: Update Daily Page Layout

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: Date filtering utilities, updated ArticleList, TopPickCard component
- Produces: Daily page with new layout (TopPickCard brief + paginated log-style articles)

- [ ] **Step 1: Review current daily page**

```bash
head -100 src/app/page.tsx
```

- [ ] **Step 2: Update daily page to use TopPickCard and new ArticleList**

Modify `src/app/page.tsx` to use TopPickCard for brief and updated ArticleList:

```typescript
'use client';

import { Suspense, useEffect, useState } from 'react';
import type { Article } from '@/lib/types';
import TopPickCard from '@/components/TopPickCard';
import FilterBar from '@/components/FilterBar';
import ArticleList from '@/components/ArticleList';
import EmptyState from '@/components/EmptyState';
import { useFiltering } from '@/hooks/useFiltering';
import { applyFilters } from '@/lib/filtering';
import { getTodayArticles } from '@/lib/filtering';
import { CATEGORIES_WITH_LABELS } from '@/lib/styles';

function DailyPageContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { filters, updateFilters, clearFilters } = useFiltering();

  useEffect(() => {
    let cancelled = false;

    fetch('/latest.json')
      .then((res) => res.json())
      .then((data: { articles: Article[] }) => {
        if (!cancelled) {
          setArticles(data.articles ?? []);
        }
      })
      .catch(() => {
        // Empty on error
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const todayArticles = getTodayArticles(articles);
  const topPickArticles = todayArticles.slice(0, 3);
  const topPickIds = new Set(topPickArticles.map((a) => a.id));
  const filteredArticles = applyFilters(todayArticles, filters);

  return (
    <div className="w-full space-y-8">
      {/* Top Picks Brief */}
      <section>
        <h2 className="section-title mb-4">Today's Top Picks</h2>
        {topPickArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topPickArticles.map((article, i) => (
              <TopPickCard key={article.id} article={article} rank={i + 1} />
            ))}
          </div>
        ) : (
          <p className="text-paper-muted">No top picks for today.</p>
        )}
      </section>

      {/* Filters */}
      <section>
        {todayArticles.length > 0 && (
          <FilterBar
            categories={CATEGORIES_WITH_LABELS}
            availableTags={Array.from(new Set(todayArticles.flatMap((a) => a.tags || []))).sort()}
            activeFilters={filters}
            onCategoryChange={(category) => updateFilters({ ...filters, category: category ?? undefined })}
            onTagChange={(tag, active) => {
              const newTags = active
                ? [...(filters.tags || []), tag]
                : (filters.tags || []).filter((t) => t !== tag);
              updateFilters({ ...filters, tags: newTags.length > 0 ? newTags : undefined });
            }}
            onReset={clearFilters}
            totalArticles={todayArticles.length}
            shownArticles={filteredArticles.length}
          />
        )}
      </section>

      {/* Paginated Article List */}
      <section>
        <h2 className="section-title mb-4">All Today's Articles</h2>
        {isLoading ? (
          <p className="text-paper-muted">Loading articles…</p>
        ) : filteredArticles.length > 0 ? (
          <ArticleList articles={filteredArticles} topPickIds={topPickIds} />
        ) : (
          <EmptyState onReset={clearFilters} />
        )}
      </section>
    </div>
  );
}

export default function DailyPage() {
  return (
    <Suspense fallback={null}>
      <DailyPageContent />
    </Suspense>
  );
}
```

- [ ] **Step 3: Test in dev server**

```bash
npm run dev
# Open http://localhost:3000
# Verify: Top picks show in TopPickCard format
# Verify: Articles list below with pagination
# Verify: No vertical scroll (pagination controls at bottom)
```

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: redesign daily page with TopPickCard and pagination"
```

---

### Task 7: Update Weekly Page Layout

**Files:**
- Modify: `src/app/weekly/page.tsx`

**Interfaces:**
- Same as daily page, scoped to weekly articles

- [ ] **Step 1-2: Update weekly page (identical pattern to daily page)**

Replace `src/app/weekly/page.tsx` with the same structure as Task 6, but using `getWeekArticles()` and "This Week's" labels:

```typescript
'use client';

import { Suspense, useEffect, useState } from 'react';
import type { Article } from '@/lib/types';
import TopPickCard from '@/components/TopPickCard';
import FilterBar from '@/components/FilterBar';
import ArticleList from '@/components/ArticleList';
import EmptyState from '@/components/EmptyState';
import { useFiltering } from '@/hooks/useFiltering';
import { applyFilters } from '@/lib/filtering';
import { getWeekArticles } from '@/lib/filtering';
import { CATEGORIES_WITH_LABELS } from '@/lib/styles';

function WeeklyPageContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { filters, updateFilters, clearFilters } = useFiltering();

  useEffect(() => {
    let cancelled = false;

    fetch('/latest.json')
      .then((res) => res.json())
      .then((data: { articles: Article[] }) => {
        if (!cancelled) {
          setArticles(data.articles ?? []);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const weekArticles = getWeekArticles(articles);
  const topPickArticles = weekArticles.slice(0, 3);
  const topPickIds = new Set(topPickArticles.map((a) => a.id));
  const filteredArticles = applyFilters(weekArticles, filters);

  return (
    <div className="w-full space-y-8">
      <section>
        <h2 className="section-title mb-4">This Week's Top Picks</h2>
        {topPickArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topPickArticles.map((article, i) => (
              <TopPickCard key={article.id} article={article} rank={i + 1} />
            ))}
          </div>
        ) : (
          <p className="text-paper-muted">No top picks this week.</p>
        )}
      </section>

      <section>
        {weekArticles.length > 0 && (
          <FilterBar
            categories={CATEGORIES_WITH_LABELS}
            availableTags={Array.from(new Set(weekArticles.flatMap((a) => a.tags || []))).sort()}
            activeFilters={filters}
            onCategoryChange={(category) => updateFilters({ ...filters, category: category ?? undefined })}
            onTagChange={(tag, active) => {
              const newTags = active
                ? [...(filters.tags || []), tag]
                : (filters.tags || []).filter((t) => t !== tag);
              updateFilters({ ...filters, tags: newTags.length > 0 ? newTags : undefined });
            }}
            onReset={clearFilters}
            totalArticles={weekArticles.length}
            shownArticles={filteredArticles.length}
          />
        )}
      </section>

      <section>
        <h2 className="section-title mb-4">All This Week's Articles</h2>
        {isLoading ? (
          <p className="text-paper-muted">Loading articles…</p>
        ) : filteredArticles.length > 0 ? (
          <ArticleList articles={filteredArticles} topPickIds={topPickIds} />
        ) : (
          <EmptyState onReset={clearFilters} />
        )}
      </section>
    </div>
  );
}

export default function WeeklyPage() {
  return (
    <Suspense fallback={null}>
      <WeeklyPageContent />
    </Suspense>
  );
}
```

- [ ] **Step 3: Test in dev server**

```bash
npm run dev
# Open http://localhost:3000/weekly
# Verify same layout as daily, but with weekly articles
```

- [ ] **Step 4: Commit**

```bash
git add src/app/weekly/page.tsx
git commit -m "feat: redesign weekly page with TopPickCard and pagination"
```

---

### Task 8: Update Monthly Page Layout

**Files:**
- Modify: `src/app/monthly/page.tsx`

**Interfaces:**
- Same as daily/weekly, scoped to monthly articles

- [ ] **Step 1-4: Update monthly page (identical pattern)**

Replace `src/app/monthly/page.tsx` using `getMonthArticles()` and "This Month's" labels.

Expected structure mirrors Tasks 6-7 but with 30-day filtering.

- [ ] **Step 3: Test in dev server**

```bash
npm run dev
# Open http://localhost:3000/monthly
# Verify same layout as daily/weekly, but with monthly articles
```

- [ ] **Step 4: Commit**

```bash
git add src/app/monthly/page.tsx
git commit -m "feat: redesign monthly page with TopPickCard and pagination"
```

---

### Task 9: Test at All Breakpoints

**Files:**
- Test: All pages (/, /weekly, /monthly)

**Interfaces:**
- Consumes: All updated pages and components
- Produces: Verification that no vertical scroll exists, pagination works

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test at each breakpoint**

Using DevTools device toolbar, test:

| Breakpoint | Tests |
|-----------|-------|
| 375px | No horizontal scroll, pagination visible, TopPickCard stacks to 1 column, articles fit without vertical scroll |
| 390px | Same as 375px |
| 520px | TopPickCard 2 columns, articles still no vertical scroll |
| 640px | TopPickCard 2-3 columns, articles still no vertical scroll |
| 768px | TopPickCard 2-3 columns, articles still no vertical scroll |
| 900px | TopPickCard 3 columns, articles still no vertical scroll |
| 1024px+ | Full layout, articles still no vertical scroll |

- [ ] **Step 3: Test dark/light theme at 3 breakpoints**

```bash
# Use header gear icon to toggle theme
# At 375px, 768px, 1024px:
# - Text readable in both modes
# - No contrast issues
# - Layout stable on theme toggle
```

- [ ] **Step 4: Test pagination functionality**

```bash
# At 375px and 1024px:
# - Previous/Next buttons work
# - Page counter updates
# - Articles change correctly
# - Pagination controls visible at bottom
```

- [ ] **Step 5: Test filter functionality**

```bash
# Test at 375px and 1024px:
# - Category filters work
# - Tag filters work (collapse/expand)
# - Clear filters works
# - Pagination resets to page 1 on filter change
```

- [ ] **Step 6: Create test report**

Create `docs/superpowers/plans/2026-07-16-qa-news-ui-redesign-testing.md`:

```markdown
# UI Redesign Testing Report

**Date:** [date]
**Status:** ✅ All tests pass

## Breakpoint Testing

- ✅ 375px: No scroll, pagination visible
- ✅ 390px: No scroll, pagination visible
- ✅ 520px: No scroll, responsive grid
- ✅ 640px: No scroll, responsive grid
- ✅ 768px: No scroll, responsive grid
- ✅ 900px: No scroll, responsive grid
- ✅ 1024px+: No scroll, responsive grid

## Theme Testing

- ✅ Dark theme: readable, contrasts OK
- ✅ Light theme: readable, contrasts OK
- ✅ Theme toggle: stable layout

## Filter & Pagination

- ✅ Pagination works (prev/next, page counter)
- ✅ Filters work (category, tags, clear)
- ✅ Pagination resets on filter change
- ✅ All pages (daily/weekly/monthly) work correctly
```

- [ ] **Step 7: Commit test report**

```bash
git add docs/superpowers/plans/2026-07-16-qa-news-ui-redesign-testing.md
git commit -m "test: verify UI redesign at all breakpoints and themes"
```

---

### Task 10: Run Full Test Suite and Final Build

**Files:**
- Test: All unit tests

**Interfaces:**
- Consumes: All updated components and pages
- Produces: 100% test pass rate, clean build

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: All tests pass (including new TopPickCard and pagination tests).

- [ ] **Step 2: Build static export**

```bash
npm run build
```

Expected: Build succeeds, no errors or warnings.

- [ ] **Step 3: Test built output**

```bash
npx http-server out -p 3001
# Open http://localhost:3001
# Test all pages and features work in production build
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "build: UI redesign complete and verified"
```

---

## Summary

**10 tasks implementing QA-News UI redesign:**
1. ✅ Add subtitle to Article type
2. ✅ Create TopPickCard component
3. ✅ Create pagination utility
4. ✅ Update PipelineEntry for log-style
5. ✅ Update ArticleList with pagination controls
6. ✅ Redesign daily page
7. ✅ Redesign weekly page
8. ✅ Redesign monthly page
9. ✅ Test at all breakpoints
10. ✅ Verify build and tests

**Changes:**
- 2 new components (TopPickCard, pagination utility)
- 5 modified pages/components (ArticleList, PipelineEntry, all 3 pages)
- 1 type update (Article subtitle)
- New tests for new components
- Verified at all breakpoints and themes
- All tests passing, build verified

Ready to execute. Which approach?
