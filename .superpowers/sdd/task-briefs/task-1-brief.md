# Task 1: Create Date-Scoped Filtering Utilities

**Context:** Phase 1 of QA-News bug fixes. Daily/Weekly/Monthly pages currently show identical content because they all fetch the same unfiltered articles. This task creates the foundational filtering utilities to enable date-scoping.

**Scope:** Add four utility functions to `src/lib/filtering.ts`:
- `getArticlesSince(articles, daysAgo)` — core filter
- `getTodayArticles(articles)` — 1-day cutoff
- `getWeekArticles(articles)` — 7-day cutoff
- `getMonthArticles(articles)` — 30-day cutoff

**Files:**
- Modify: `src/lib/filtering.ts:1-50`

**Interfaces:**
- Consumes: `Article` type with `publishedAt: string` (ISO 8601 date)
- Produces: `getArticlesSince(articles: Article[], daysAgo: number): Article[]` — filters by date
- Produces: `getTodayArticles(articles: Article[]): Article[]` — 1-day shorthand
- Produces: `getWeekArticles(articles: Article[]): Article[]` — 7-day shorthand
- Produces: `getMonthArticles(articles: Article[]): Article[]` — 30-day shorthand

---

## Steps

### Step 1: Add utility functions to src/lib/filtering.ts

Open the file and add these functions after the existing imports (top of file):

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

**Rationale:**
- `getArticlesSince()` is the core implementation (DRY)
- Shorthand functions provide semantic clarity for callers
- Date math uses UTC to match ISO 8601 format
- Filters articles missing `publishedAt` (defensive)

### Step 2: Run TypeScript check

```bash
cd /Users/rafalciesielski/Developer/qa-news && npx tsc --noEmit
```

Expected: No errors. If you see "Article is not defined", check that `src/lib/types.ts` exports the `Article` type with `publishedAt: string`.

### Step 3: Commit

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/lib/filtering.ts
git commit -m "feat: add date-scoped filtering utilities (today/week/month)"
```

---

## Success Criteria

✅ All four functions exported and typed correctly  
✅ TypeScript type check passes  
✅ Functions filter articles by date correctly  
✅ Existing code still compiles (no breaking changes)  
✅ Commit created
