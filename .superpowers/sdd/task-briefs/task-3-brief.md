# Task 3: Update Weekly Page with Date Filtering

**Context:** Same as Task 2, but for the weekly page. Filter to last 7 days instead of today only.

**Scope:** Replace `src/app/weekly/page.tsx` to:
1. Import `getWeekArticles` from filtering utilities
2. Call `getWeekArticles(articles)` to filter to 7-day window
3. Brief shows 4 items (not 6)
4. Use date-scoped brief for top picks
5. Keep filtering and tag logic intact

**Files:**
- Modify: `src/app/weekly/page.tsx` (entire file)

**Interfaces:**
- Consumes: `getWeekArticles(articles: Article[]): Article[]` from Task 1
- Produces: Weekly page component showing only last 7 days' articles with 4-item brief

---

## Steps

### Step 1: Replace src/app/weekly/page.tsx with new implementation

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

  // Weekly Brief is the first 3-4 articles from THIS WEEK (last 7 days), independent of filters.
  const weekArticles = getWeekArticles(articles);
  const weeklyPickIds = new Set(weekArticles.slice(0, 4).map((article) => article.id));
  const filteredArticles = applyFilters(weekArticles, filters);

  return (
    <div className="w-full">
      <section className="mb-8 sm:mb-12">
        <BriefCard
          title="Weekly Brief — Top Picks"
          items={weekArticles.slice(0, 4).map((article) => ({
            id: article.id,
            title: article.title,
            category: article.category,
            url: article.url,
            isTopPick: weeklyPickIds.has(article.id),
          }))}
        />
      </section>

      <section>
        {/* Extract unique tags for tag chips */}
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

        <div className="py-6 sm:py-8">
          <h2 className="section-title">
            This Week
          </h2>

          {isLoading ? (
            <p className="text-2 text-sm">Loading articles…</p>
          ) : filteredArticles.length > 0 ? (
            <ArticleList articles={filteredArticles} topPickIds={weeklyPickIds} />
          ) : (
            <EmptyState onReset={clearFilters} />
          )}
        </div>
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

### Step 2: Run TypeScript check

```bash
cd /Users/rafalciesielski/Developer/qa-news && npx tsc --noEmit
```

### Step 3: Test in dev server

```bash
npm run dev
# Open http://localhost:3000/weekly
# Verify: Shows articles from last 7 days (different from daily page)
# Verify: Brief has 4 items
# Verify: Filters work
```

### Step 4: Commit

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/app/weekly/page.tsx
git commit -m "fix: weekly page shows articles from last 7 days with date-scoped brief"
```

---

## Success Criteria

✅ Page imports and uses `getWeekArticles`  
✅ Brief shows 4 items  
✅ Shows 7-day window (not same as daily)  
✅ TypeScript passes  
✅ Commit created
