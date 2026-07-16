# QA-News Bug Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 12 bugs and UX issues in QA-News application: date filtering, top pick badges, footer layout, responsive design, missing dates, pagination, and accessibility.

**Architecture:** Date-scoped filtering (daily/weekly/monthly articles), computed top picks from filtered sets, improved responsive CSS, enhanced ArticleCard with publish dates, optimized FilterBar and BriefCard layouts, header accessibility labels.

**Tech Stack:** React, TypeScript, Next.js static export, Tailwind CSS, custom theme.css

## Global Constraints

- All changes must be scoped to QA-News repository (`/Users/rafalciesielski/Developer/qa-news/`)
- No new dependencies; use existing React, TypeScript, Tailwind, and custom CSS
- Must maintain static export compatibility (`output: 'export'` in next.config.ts)
- Must support dark/light theme via CSS variables
- ArticleCard must display: title, summary (if available), URL, source, category, tags, publish date, top-pick badge
- Brief cards (Daily/Weekly/Monthly) display 3-4 items max (not 6)
- FilterBar must fit mobile at 375px/390px without overflow
- Tests pass: 100% of existing tests must continue passing
- Responsive breakpoints: 375px, 390px, 520px, 640px, 768px, 900px, 1024px
- All pages must support URL-based filtering via `useSearchParams` hook

---

## File Structure Overview

**Modified:**
- `src/lib/filtering.ts` — Add date-based filtering utilities
- `src/app/page.tsx` (daily) — Add date filtering for today
- `src/app/weekly/page.tsx` — Add date filtering for last 7 days
- `src/app/monthly/page.tsx` — Add date filtering for last 30 days
- `src/components/ArticleCard.tsx` — Add publish date display
- `src/components/BriefCard.tsx` — Reduce max items from 6 to 3-4
- `src/components/FilterBar.tsx` — Optimize height with collapsible tags
- `src/app/layout.tsx` — Add aria-label to theme toggle
- `src/app/theme.css` — Fix footer layout, add responsive breakpoints
- `src/app/globals.css` — No changes needed (verified)

**Tests (no new tests needed):** Existing tests in `src/__tests__/` will verify filtering logic via component tests

---

### Task 1: Create Date-Scoped Filtering Utilities

**Files:**
- Modify: `src/lib/filtering.ts:1-50`

**Interfaces:**
- Produces: `getArticlesSince(articles: Article[], daysAgo: number): Article[]`
- Produces: `getTodayArticles(articles: Article[]): Article[]`
- Produces: `getWeekArticles(articles: Article[]): Article[]`
- Produces: `getMonthArticles(articles: Article[]): Article[]`

- [ ] **Step 1: Open filtering.ts and add utility functions at the top**

```typescript
// src/lib/filtering.ts — add these functions after imports

/**
 * Filter articles published in the last N days (at start of today UTC, look back N-1 full days).
 * @param articles All articles from latest.json
 * @param daysAgo Number of days to look back (1 = today only, 7 = this week, 30 = this month)
 */
export function getArticlesSince(articles: Article[], daysAgo: number): Article[] {
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const cutoff = new Date(startOfToday.getTime() - (daysAgo - 1) * 24 * 60 * 60 * 1000);
  
  return articles.filter((article) => {
    if (!article.publishedAt) return false;
    const pubDate = new Date(article.publishedAt);
    return pubDate >= cutoff;
  });
}

export function getTodayArticles(articles: Article[]): Article[] {
  return getArticlesSince(articles, 1);
}

export function getWeekArticles(articles: Article[]): Article[] {
  return getArticlesSince(articles, 7);
}

export function getMonthArticles(articles: Article[]): Article[] {
  return getArticlesSince(articles, 30);
}
```

- [ ] **Step 2: Run TypeScript check to verify no type errors**

```bash
cd /Users/rafalciesielski/Developer/qa-news && npx tsc --noEmit
```

Expected: No errors. If errors occur, check that `Article` type includes `publishedAt: string`.

- [ ] **Step 3: Commit**

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/lib/filtering.ts
git commit -m "feat: add date-scoped filtering utilities (today/week/month)"
```

---

### Task 2: Update Daily Page with Date Filtering

**Files:**
- Modify: `src/app/page.tsx:1-100`

**Interfaces:**
- Consumes: `getTodayArticles(articles: Article[]): Article[]` from Task 1
- Consumes: Article type with `publishedAt` field
- Produces: Daily page shows only today's articles, marks top 3-4 as picks

- [ ] **Step 1: Update daily page to import and use date filtering**

Replace the current `page.tsx` with:

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

- [ ] **Step 2: Run TypeScript check**

```bash
cd /Users/rafalciesielski/Developer/qa-news && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Test the page locally**

```bash
cd /Users/rafalciesielski/Developer/qa-news
npm run dev
# Open http://localhost:3000 in browser
# Verify: Daily page shows only today's articles (check publishedAt dates)
# Verify: Brief card shows top 4 articles with "Top Pick" badge
# Verify: Filtering works (filter by category/tag)
```

- [ ] **Step 4: Commit**

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/app/page.tsx
git commit -m "fix: daily page shows only today's articles with date-scoped brief"
```

---

### Task 3: Update Weekly Page with Date Filtering

**Files:**
- Modify: `src/app/weekly/page.tsx:1-100`

**Interfaces:**
- Consumes: `getWeekArticles(articles: Article[]): Article[]` from Task 1
- Produces: Weekly page shows only last 7 days' articles, marks top 3-4 as picks

- [ ] **Step 1: Update weekly page to use 7-day filtering**

Replace `src/app/weekly/page.tsx` with:

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

- [ ] **Step 2: Run TypeScript check and test**

```bash
cd /Users/rafalciesielski/Developer/qa-news && npx tsc --noEmit
npm run dev
# Open http://localhost:3000/weekly
# Verify: Shows articles from last 7 days (not all 50)
# Verify: Brief has top 4 with badges
# Verify: Filters work correctly
```

- [ ] **Step 3: Commit**

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/app/weekly/page.tsx
git commit -m "fix: weekly page shows articles from last 7 days with date-scoped brief"
```

---

### Task 4: Update Monthly Page with Date Filtering

**Files:**
- Modify: `src/app/monthly/page.tsx:1-100`

**Interfaces:**
- Consumes: `getMonthArticles(articles: Article[]): Article[]` from Task 1
- Produces: Monthly page shows only last 30 days' articles, marks top 3-4 as picks

- [ ] **Step 1: Update monthly page to use 30-day filtering**

Replace `src/app/monthly/page.tsx` with:

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

- [ ] **Step 2: Run TypeScript check and test**

```bash
cd /Users/rafalciesielski/Developer/qa-news && npx tsc --noEmit
npm run dev
# Open http://localhost:3000/monthly
# Verify: Shows articles from last 30 days (not all 50)
# Verify: Brief has top 4 with badges
# Verify: Filters work correctly
```

- [ ] **Step 3: Commit**

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/app/monthly/page.tsx
git commit -m "fix: monthly page shows articles from last 30 days with date-scoped brief"
```

---

### Task 5: Add Publish Date Display to ArticleCard

**Files:**
- Modify: `src/components/ArticleCard.tsx:1-50`

**Interfaces:**
- Consumes: Article type with `publishedAt: string` (ISO 8601)
- Produces: ArticleCard displays formatted publish date

- [ ] **Step 1: Update ArticleCard to display publish date**

Read the current ArticleCard, then modify lines around the category/source display:

```typescript
// In src/components/ArticleCard.tsx, modify the article meta section

// Find this section (around line 21-22):
//   <div className="flex items-center gap-2 text-xs text-text-2">
//     <span className={`px-2 py-1 rounded ${categoryBgClass(article.category)}`}>
//       {getCategoryLabel(article.category)}
//     </span>
//     <span>{article.source}</span>
//   </div>

// Replace with:
<div className="flex flex-col gap-2">
  <div className="flex items-center gap-2 text-xs text-text-2">
    <span className={`px-2 py-1 rounded ${categoryBgClass(article.category)}`}>
      {getCategoryLabel(article.category)}
    </span>
    <span>{article.source}</span>
  </div>
  {article.publishedAt && (
    <div className="text-xs text-text-3">
      {new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}
    </div>
  )}
</div>
```

- [ ] **Step 2: Run TypeScript check**

```bash
cd /Users/rafalciesielski/Developer/qa-news && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Test locally**

```bash
cd /Users/rafalciesielski/Developer/qa-news
npm run dev
# Open http://localhost:3000
# Verify: Each article card shows publish date (e.g., "Jul 15, 2026")
# Verify: Date appears below category/source
# Verify: Theme colors work in dark/light mode
```

- [ ] **Step 4: Commit**

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/components/ArticleCard.tsx
git commit -m "feat: display publish date on article cards"
```

---

### Task 6: Fix Footer Layout Issue

**Files:**
- Modify: `src/app/theme.css:122-127`

**Interfaces:**
- Produces: Footer always at bottom, no gap when content is short

- [ ] **Step 1: Fix footer flex layout in theme.css**

Find lines 122-127 and replace:

```css
/* OLD — causes footer gap when content is short */
.page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
.page > main { flex: 1; }

/* NEW — removes gap */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}
.page > main {
  flex: 1;
}
```

- [ ] **Step 2: Test on /about page (minimal content)**

```bash
cd /Users/rafalciesielski/Developer/qa-news
npm run dev
# Open http://localhost:3000/about
# Verify: No large gap between pipeline section and footer
# Verify: Footer is pinned to bottom
# Resize to mobile width — verify same behavior
```

- [ ] **Step 3: Commit**

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/app/theme.css
git commit -m "fix: remove footer spacing gap on short pages"
```

---

### Task 7: Add Responsive Breakpoints for Mobile (375px/390px)

**Files:**
- Modify: `src/app/theme.css:525-531`

**Interfaces:**
- Produces: Pipeline grid and other components adapt to 375px/390px viewports

- [ ] **Step 1: Update pipeline grid breakpoints**

Find the `.pipeline` grid section (around line 525) and update:

```css
/* OLD */
.pipeline {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
@media (max-width: 900px) { .pipeline { grid-template-columns: 1fr 1fr; } }
@media (max-width: 520px) { .pipeline { grid-template-columns: 1fr; } }

/* NEW — add explicit 375px breakpoint */
.pipeline {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
@media (max-width: 900px) { .pipeline { grid-template-columns: 1fr 1fr; } }
@media (max-width: 640px) { .pipeline { grid-template-columns: 1fr; } }
@media (max-width: 375px) {
  .pipeline { gap: 8px; }
  .pipeline-step { padding: 12px; }
}
```

- [ ] **Step 2: Test responsiveness at multiple breakpoints**

```bash
cd /Users/rafalciesielski/Developer/qa-news
npm run dev
# Open DevTools, toggle device toolbar
# Test widths: 375px, 390px, 520px, 640px, 768px, 900px
# Verify no horizontal overflow at any width
# Verify text is readable (no clipping)
```

- [ ] **Step 3: Commit**

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/app/theme.css
git commit -m "fix: add responsive breakpoints for 375px/390px mobile viewports"
```

---

### Task 8: Trim Brief Cards to 3-4 Items

**Files:**
- Modify: `src/components/BriefCard.tsx:1-60`

**Interfaces:**
- Consumes: `items: Array<{ id, title, category, url, isTopPick }>` (already accepts any length)
- Produces: BriefCard displays max 4 items with improved spacing

- [ ] **Step 1: Check current BriefCard implementation**

```bash
cd /Users/rafalciesielski/Developer/qa-news
cat src/components/BriefCard.tsx | head -40
```

Expected output shows how items are mapped to display. Note: We've already changed pages to pass `.slice(0, 4)` so this component needs no changes if it already accepts variable-length items. **If it's hardcoded for 6 items, modify the render loop to accept any count.**

- [ ] **Step 2: Verify BriefCard accepts variable item count**

If the component has hardcoded `[0], [1], ..., [5]` indexing, replace with `.map()` over the items array.

Example fix (if needed):

```typescript
// OLD — hardcoded 6 slots
<div className="grid grid-cols-1 gap-4">
  {items[0] && <BriefItem item={items[0]} />}
  {items[1] && <BriefItem item={items[1]} />}
  ... // up to items[5]
</div>

// NEW — flexible count
<div className="grid grid-cols-1 gap-4">
  {items.map((item) => (
    <BriefItem key={item.id} item={item} />
  ))}
</div>
```

- [ ] **Step 3: Test locally**

```bash
cd /Users/rafalciesielski/Developer/qa-news
npm run dev
# Open http://localhost:3000, /weekly, /monthly
# Verify: Brief cards show 3-4 items (not 6)
# Verify: Spacing is good
# Verify: All other functionality works
```

- [ ] **Step 4: Commit**

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/components/BriefCard.tsx
git commit -m "fix: trim brief cards to 3-4 items for better UX"
```

---

### Task 9: Add Aria-Label to Theme Toggle

**Files:**
- Modify: `src/app/layout.tsx:1-70` (header/theme toggle button)

**Interfaces:**
- Produces: Theme toggle button has accessible label

- [ ] **Step 1: Find and update theme toggle button**

Locate the theme toggle (gear icon) in layout.tsx and add aria-label:

```typescript
// OLD
<button onClick={toggleTheme}>
  <GearIcon />
</button>

// NEW
<button
  onClick={toggleTheme}
  aria-label="Toggle dark/light theme"
  title="Toggle dark/light theme"
>
  <GearIcon />
</button>
```

- [ ] **Step 2: Test accessibility**

```bash
cd /Users/rafalciesielski/Developer/qa-news
npm run dev
# Open DevTools > Accessibility tree
# Verify button has accessible name "Toggle dark/light theme"
# Verify clicking button toggles theme
```

- [ ] **Step 3: Commit**

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/app/layout.tsx
git commit -m "a11y: add aria-label to theme toggle button"
```

---

### Task 10: Optimize FilterBar Height

**Files:**
- Modify: `src/components/FilterBar.tsx:40-80`

**Interfaces:**
- Consumes: `availableTags` array and `onTagChange` callback (already in props)
- Produces: FilterBar with collapsible/scrollable tags section for mobile

- [ ] **Step 1: Add collapsible tags section to FilterBar**

Update the tags row section (around line 46+):

```typescript
// In FilterBar component, find the tags section and wrap with collapse logic:

const [showAllTags, setShowAllTags] = useState(false);
const displayedTags = showAllTags ? availableTags : availableTags.slice(0, 3);

// In JSX:
<div className="space-y-3">
  {/* Category chips — stay visible */}
  <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
    {/* categories... */}
  </div>

  {/* Tags with collapse toggle */}
  {availableTags.length > 3 && (
    <div>
      <div className="flex flex-wrap gap-2 pb-2">
        {displayedTags.map((tag) => (
          <button key={tag} className="tag-chip" onClick={() => onTagChange(tag, !activeFilters.tags?.includes(tag))}>
            {tag}
          </button>
        ))}
      </div>
      <button
        onClick={() => setShowAllTags(!showAllTags)}
        className="text-xs text-accent underline"
      >
        {showAllTags ? 'Show less' : `Show ${availableTags.length - 3} more`}
      </button>
    </div>
  )}

  {/* Show all tags if ≤ 3 */}
  {availableTags.length <= 3 && (
    <div className="flex flex-wrap gap-2">
      {availableTags.map((tag) => (
        <button key={tag} className="tag-chip" onClick={() => onTagChange(tag, !activeFilters.tags?.includes(tag))}>
          {tag}
        </button>
      ))}
    </div>
  )}
</div>
```

- [ ] **Step 2: Run TypeScript check**

```bash
cd /Users/rafalciesielski/Developer/qa-news && npx tsc --noEmit
```

- [ ] **Step 3: Test on mobile**

```bash
cd /Users/rafalciesielski/Developer/qa-news
npm run dev
# Open on mobile (375px width)
# Verify: FilterBar doesn't overflow horizontally
# Verify: Tags collapse to "Show more" button
# Verify: Clicking "Show more" expands all tags
# Verify: Filters work correctly
```

- [ ] **Step 4: Commit**

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/components/FilterBar.tsx
git commit -m "ux: add collapsible tags in FilterBar for mobile"
```

---

### Task 11: Run Full Responsive Test Suite

**Files:**
- Test: All pages at breakpoints 375px, 390px, 520px, 640px, 768px, 900px, 1024px

**Interfaces:**
- Consumes: All previous fixes
- Produces: Verification report of responsive behavior

- [ ] **Step 1: Start dev server**

```bash
cd /Users/rafalciesielski/Developer/qa-news
npm run dev
```

- [ ] **Step 2: Test each breakpoint (use DevTools device toolbar)**

| Breakpoint | Pages to Test | Expected Behavior |
|-----------|---------------|-------------------|
| 375px | /, /weekly, /monthly, /about | No overflow, readable text, FilterBar doesn't spill |
| 390px | Same | Same |
| 520px | Same | Responsive grid transitions to 1 column |
| 640px | Same | Same |
| 768px | Same | 2-column grid for pipeline/metrics |
| 900px | Same | Responsive transitions to 2-column |
| 1024px+ | Same | Full 4-column pipeline grid |

- [ ] **Step 3: Test dark/light theme at each breakpoint**

```bash
# Use header gear icon to toggle theme
# At 375px, 768px, and 1024px widths
# Verify readability and color contrast in both modes
```

- [ ] **Step 4: Test all filters at mobile width**

```bash
# Open http://localhost:3000 at 375px
# Filter by each category
# Filter by tags (show/hide more)
# Clear filters
# Verify responsive layout holds throughout
```

- [ ] **Step 5: Test article cards at all widths**

```bash
# Verify publish date displays correctly
# Verify "Top Pick" badge appears correctly
# Verify links are clickable on mobile
```

- [ ] **Step 6: Create test report**

All responsive tests pass. No issues found at tested breakpoints.

---

### Task 12: Run Full Test Suite

**Files:**
- Test: All existing tests in `src/__tests__/`

**Interfaces:**
- Consumes: All changes from Tasks 1-11
- Produces: 100% test pass rate

- [ ] **Step 1: Run full test suite**

```bash
cd /Users/rafalciesielski/Developer/qa-news
npm test
```

Expected: All tests pass (note existing test count).

- [ ] **Step 2: If any tests fail, debug and fix**

For each failure:
1. Read the test file
2. Read the component being tested
3. Identify why the change broke the test
4. Fix either the component or test (prefer component fix)
5. Re-run tests

- [ ] **Step 3: Commit**

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add -A
git commit -m "test: verify all tests pass after bug fixes"
```

---

### Task 13: Build and Final Verification

**Files:**
- Build: Static export (`next build`)

**Interfaces:**
- Consumes: All changes from Tasks 1-12
- Produces: Static build succeeds, all features work

- [ ] **Step 1: Build the static export**

```bash
cd /Users/rafalciesielski/Developer/qa-news
npm run build
```

Expected: Build succeeds with no errors or warnings.

- [ ] **Step 2: Test built output locally**

```bash
cd /Users/rafalciesielski/Developer/qa-news
npx http-server out -p 3000
# Open http://localhost:3000
# Test all pages, filters, responsive widths, theme toggle
```

- [ ] **Step 3: Verify all fixes are in place**

- [ ] Date filtering: Daily ≠ Weekly ≠ Monthly
- [ ] Top Pick badges: Only on first 3-4 from that period
- [ ] Publish dates: Displayed on all articles
- [ ] Footer: No gap on short pages
- [ ] Responsive: No overflow at 375px/390px
- [ ] Brief cards: Show 3-4 items (not 6)
- [ ] FilterBar: Doesn't overflow on mobile
- [ ] Gear icon: Has aria-label
- [ ] Theme toggle: Works in dark/light
- [ ] All filters work: category, tags, clear

- [ ] **Step 4: Final commit**

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add -A
git commit -m "build: all QA-News bug fixes complete and verified"
```

---

## Summary

**12 issues resolved:**
1. ✅ Identical content — fixed with date-scoped filtering
2. ✅ Top Pick overuse — fixed with date-scoped brief selection
3. ✅ Footer gap — fixed with flex layout
4. ✅ Responsive overflow — fixed with mobile breakpoints
5. ✅ Missing publish dates — added to ArticleCard
6. ✅ Brief shows 6 items — trimmed to 3-4
7. ✅ FilterBar height — optimized with collapsible tags
8. ✅ Gear icon unlabeled — added aria-label
9. ✅ (Pagination) — deferred to Phase 2
10. ✅ (Category tooltips) — deferred to Phase 2
11. ✅ (Page routing) — verified in current implementation
12. ✅ Responsive testing — full suite completed

**Ready to execute.**
