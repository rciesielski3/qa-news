# Task 2: Update Daily Page with Date Filtering

**Context:** Now that date-filtering utilities exist (Task 1), update the daily page (`src/app/page.tsx`) to use them. Currently, the page shows all 50 articles unfiltered. After this task, it will show only today's articles.

**Scope:** Replace the daily page component to:
1. Import `getTodayArticles` from filtering utilities
2. Call `getTodayArticles(articles)` to filter to today only
3. Change brief from 6 items to 4 items
4. Use date-scoped brief for top picks (not global articles.slice(0,6))
5. Keep all other functionality intact (filters, tags, etc.)

**Files:**
- Modify: `src/app/page.tsx` (entire file)

**Interfaces:**
- Consumes: `getTodayArticles(articles: Article[]): Article[]` from Task 1
- Consumes: `useFiltering`, `applyFilters`, `Article` type (existing)
- Produces: Daily page component showing only today's articles with 4-item brief

---

## Steps

### Step 1: Replace src/app/page.tsx with new implementation

Replace the ENTIRE file with this code:

```typescript
'use client';

import { Suspense, useEffect, useState } from 'react';
import type { Article } from '@/lib/types';
import BriefCard from '@/components/BriefCard';
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
        // Leave articles empty; the page still renders (with EmptyState-like
        // zero counts) instead of crashing.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Daily Brief is the first 3-4 articles from TODAY ONLY, independent of filters.
  const todayArticles = getTodayArticles(articles);
  const dailyPickIds = new Set(todayArticles.slice(0, 4).map((article) => article.id));
  const filteredArticles = applyFilters(todayArticles, filters);

  return (
    <div className="w-full">
      <section className="mb-8 sm:mb-12">
        <BriefCard
          title="Today's Top Picks"
          items={todayArticles.slice(0, 4).map((article) => ({
            id: article.id,
            title: article.title,
            category: article.category,
            url: article.url,
            isTopPick: dailyPickIds.has(article.id),
          }))}
        />
      </section>

      <section>
        {/* Extract unique tags for tag chips */}
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

        <div className="py-6 sm:py-8">
          <h2 className="section-title">
            Today's Articles
          </h2>

          {isLoading ? (
            <p className="text-2 text-sm">Loading articles…</p>
          ) : filteredArticles.length > 0 ? (
            <ArticleList articles={filteredArticles} topPickIds={dailyPickIds} />
          ) : (
            <EmptyState onReset={clearFilters} />
          )}
        </div>
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

**Key Changes:**
- Import `getTodayArticles` from filtering utilities
- Call `getTodayArticles(articles)` to filter to today only
- Change brief from `.slice(0, 6)` to `.slice(0, 4)` (3-4 items)
- Use `todayArticles` instead of `articles` for brief and filters
- Keep `FilterBar` and `ArticleList` logic identical (just operating on filtered set)

### Step 2: Run TypeScript check

```bash
cd /Users/rafalciesielski/Developer/qa-news && npx tsc --noEmit
```

Expected: No type errors.

### Step 3: Test in dev server

```bash
cd /Users/rafalciesielski/Developer/qa-news && npm run dev
# Open http://localhost:3000 in browser
# Verify:
# - Daily page shows only today's articles (compare dates to /weekly, /monthly)
# - Brief card shows top 4 articles (not 6)
# - Filtering works (try category/tag filters)
# - All links clickable
# - No errors in console
```

### Step 4: Commit

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/app/page.tsx
git commit -m "fix: daily page shows only today's articles with date-scoped brief"
```

---

## Success Criteria

✅ Page imports and uses `getTodayArticles`  
✅ Brief shows 4 items (not 6)  
✅ Top picks only on today's articles  
✅ Filtering works on date-scoped set  
✅ TypeScript passes  
✅ Dev server renders without errors  
✅ Commit created
