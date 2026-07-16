# Task 4: Update Monthly Page with Date Filtering

**Context:** Same pattern as Tasks 2 and 3, but for monthly page. Filter to last 30 days.

**Scope:** Replace `src/app/monthly/page.tsx` to:
1. Import `getMonthArticles` from filtering utilities
2. Call `getMonthArticles(articles)` to filter to 30-day window
3. Brief shows 4 items (not 6)
4. Use date-scoped brief for top picks
5. Keep filtering logic intact

**Files:**
- Modify: `src/app/monthly/page.tsx` (entire file)

**Interfaces:**
- Consumes: `getMonthArticles(articles: Article[]): Article[]` from Task 1
- Produces: Monthly page component showing only last 30 days' articles with 4-item brief

---

## Steps

### Step 1: Replace src/app/monthly/page.tsx with new implementation

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
import { getMonthArticles } from '@/lib/filtering';
import { CATEGORIES_WITH_LABELS } from '@/lib/styles';

function MonthlyPageContent() {
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

  // Monthly Brief is the first 3-4 articles from THIS MONTH (last 30 days), independent of filters.
  const monthArticles = getMonthArticles(articles);
  const monthlyPickIds = new Set(monthArticles.slice(0, 4).map((article) => article.id));
  const filteredArticles = applyFilters(monthArticles, filters);

  return (
    <div className="w-full">
      <section className="mb-8 sm:mb-12">
        <BriefCard
          title="Monthly Highlights"
          items={monthArticles.slice(0, 4).map((article) => ({
            id: article.id,
            title: article.title,
            category: article.category,
            url: article.url,
            isTopPick: monthlyPickIds.has(article.id),
          }))}
        />
      </section>

      <section>
        {/* Extract unique tags for tag chips */}
        {monthArticles.length > 0 && (
          <FilterBar
            categories={CATEGORIES_WITH_LABELS}
            availableTags={Array.from(new Set(monthArticles.flatMap((a) => a.tags || []))).sort()}
            activeFilters={filters}
            onCategoryChange={(category) => updateFilters({ ...filters, category: category ?? undefined })}
            onTagChange={(tag, active) => {
              const newTags = active
                ? [...(filters.tags || []), tag]
                : (filters.tags || []).filter((t) => t !== tag);
              updateFilters({ ...filters, tags: newTags.length > 0 ? newTags : undefined });
            }}
            onReset={clearFilters}
            totalArticles={monthArticles.length}
            shownArticles={filteredArticles.length}
          />
        )}

        <div className="py-6 sm:py-8">
          <h2 className="section-title">
            This Month
          </h2>

          {isLoading ? (
            <p className="text-2 text-sm">Loading articles…</p>
          ) : filteredArticles.length > 0 ? (
            <ArticleList articles={filteredArticles} topPickIds={monthlyPickIds} />
          ) : (
            <EmptyState onReset={clearFilters} />
          )}
        </div>
      </section>
    </div>
  );
}

export default function MonthlyPage() {
  return (
    <Suspense fallback={null}>
      <MonthlyPageContent />
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
# Open http://localhost:3000/monthly
# Verify: Shows articles from last 30 days (different from daily/weekly)
# Verify: Brief has 4 items
# Verify: Filters work
```

### Step 4: Commit

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/app/monthly/page.tsx
git commit -m "fix: monthly page shows articles from last 30 days with date-scoped brief"
```

---

## Success Criteria

✅ Page imports and uses `getMonthArticles`  
✅ Brief shows 4 items  
✅ Shows 30-day window (distinct from daily/weekly)  
✅ TypeScript passes  
✅ Commit created
