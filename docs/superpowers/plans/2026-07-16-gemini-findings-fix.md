# Gemini Findings Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 8 Gemini code review findings: missing category fallback, contrast violations, usePathname hook usage, timestamp accuracy, and unused CSS.

**Architecture:** Four focused tasks, each fixing a distinct area (ArticleCard safety/contrast, useFiltering SSR compatibility, StatsBar semantics, CSS cleanup). Each task is independently testable and commits cleanly.

**Tech Stack:** TypeScript, React hooks (usePathname), Next.js, Tailwind CSS

## Global Constraints

- All contrast ratios must meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- Category labels must always include text (non-color signal for accessibility)
- usePathname hook required for pathname access in client components
- StatsBar timestamp must reflect actual pipeline schedule (08:00 UTC), not current browser time
- Tests must pass: `npm test`
- Build must succeed: `npm run build`

---

### Task 1: Fix ArticleCard Safety & Contrast Issues

**Files:**
- Modify: `src/components/ArticleCard.tsx:1-89`
- Test: `__tests__/ArticleCard.test.tsx`

**Interfaces:**
- Consumes: `Article` type, `CATEGORY_META`, `getCategoryTextColor()`, `categoryBgClass()`
- Produces: ArticleCard component with safe category fallback and corrected contrast in all contexts (compact label, non-compact metadata, tags)

**Context:**
Gemini found 4 contrast violations and 1 safety issue in ArticleCard:
1. Missing fallback if category not in CATEGORY_META (runtime crash risk)
2. Compact view: category label uses dark text (`meta.text`) on light background (dark-on-dark)
3. Non-compact metadata: `text-paper-faint` (light gray) on light background violates WCAG AA
4. Tags list: `text-paper-faint` on light background violates WCAG AA

- [ ] **Step 1: Read current ArticleCard implementation**

Run: `cat src/components/ArticleCard.tsx`

Expected: Full component code showing all three sections (compact view, non-compact view, tags)

- [ ] **Step 2: Add category fallback and read styles.ts**

Run: `cat src/lib/styles.ts | head -50`

Expected: See color utility functions and how categoryTextColor works

- [ ] **Step 3: Update ArticleCard with all fixes**

Replace the entire component with corrected version:

```typescript
import type { Article } from '@/lib/types';
import { CATEGORY_META } from '@/lib/category';
import { categoryBgClass, getCategoryTextColor } from '@/lib/styles';

interface ArticleCardProps {
  article: Article;
  isDailyPick?: boolean;
  compact?: boolean;
}

export default function ArticleCard({
  article,
  isDailyPick = false,
  compact = false,
}: ArticleCardProps) {
  // Safe fallback for missing category
  const meta = CATEGORY_META[article.category] || {
    label: article.category,
    color: '#6B7280',
    dot: 'bg-gray-400',
    text: 'text-gray-400',
  };
  const categoryTextColor = getCategoryTextColor(article.category);

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-start gap-2 text-sm font-medium text-paper hover:underline"
        >
          <span
            aria-hidden
            className={`mt-1 flex-shrink-0 h-2 w-2 rounded-full ${meta.dot}`}
          />
          <span className="flex-1 leading-snug">{article.title}</span>
        </a>
        <div className="ml-4 flex flex-wrap gap-2">
          <span className={`text-[11px] font-mono uppercase tracking-wide ${categoryTextColor}`}>
            {meta.label}
          </span>
          {isDailyPick && (
            <span className="text-[11px] font-mono uppercase tracking-wide text-signal-pin">
              Top Pick
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <article className={`rounded-lg border border-ink-600 p-4 ${categoryBgClass(article.category)}`}>
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={`mt-1 flex-shrink-0 h-3 w-3 rounded-full ${meta.dot}`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-ink-500">
            <span className={meta.text}>{meta.label}</span>
            {isDailyPick && (
              <span className="text-signal-pin">✦ Top Pick</span>
            )}
            <span aria-hidden>·</span>
            <span>{article.source}</span>
          </div>

          <h3 className="mt-2 font-serif text-base font-medium leading-snug" style={{ color: categoryTextColor }}>
            <a
              href={article.url}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:underline"
            >
              {article.title}
            </a>
          </h3>

          {article.tags.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2 font-mono text-[10px] text-ink-500">
              {article.tags.map((tag) => (
                <li key={tag} className="rounded border border-ink-600 px-1 py-0.5">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
```

Key changes:
- Line 14-19: Added safe fallback when category not found
- Line 34: Compact view now uses `categoryTextColor` (bright color for dark background) instead of `meta.text` (dark color)
- Line 63: Non-compact metadata changed from `text-paper-faint` to `text-ink-500` (dark gray for light background)
- Line 79: Tags list changed from `text-paper-faint` to `text-ink-500`

- [ ] **Step 4: Run tests to verify ArticleCard still passes**

Run: `npm test -- ArticleCard`

Expected: All ArticleCard tests pass (existing tests should work with new component)

- [ ] **Step 5: Verify build succeeds**

Run: `npm run build`

Expected: Build completes without errors

- [ ] **Step 6: Commit**

```bash
git add src/components/ArticleCard.tsx
git commit -m "fix: ArticleCard safety and contrast issues (category fallback, WCAG AA compliance)"
```

---

### Task 2: Fix useFiltering Hook SSR Compatibility

**Files:**
- Modify: `src/hooks/useFiltering.ts:1-42`
- Test: `__tests__/useFiltering.test.ts`

**Interfaces:**
- Consumes: `useSearchParams`, `useRouter`, `usePathname` from 'next/navigation'
- Produces: `useFiltering()` hook returning `{ filters, updateFilters, updateTags, toggleTag, clearFilters }`

**Context:**
Gemini found 2 instances of `window.location.pathname` in useFiltering hook. These cause SSR/static export errors. Replace with `usePathname()` hook.

- [ ] **Step 1: Read current useFiltering implementation**

Run: `cat src/hooks/useFiltering.ts`

Expected: Full hook code showing pathname usage in updateFilters and clearFilters

- [ ] **Step 2: Update useFiltering with usePathname**

Replace the hook:

```typescript
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { FilterState, parseFilterParams, serializeFilterParams } from '@/lib/filtering';

export function useFiltering() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = useMemo(() => {
    const params: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return parseFilterParams(params);
  }, [searchParams]);

  const updateFilters = (newFilters: FilterState) => {
    const params = serializeFilterParams(newFilters);
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl);
  };

  const updateTags = (tags: string[]) => {
    updateFilters({ ...filters, tags });
  };

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    updateTags(newTags);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  return { filters, updateFilters, updateTags, toggleTag, clearFilters };
}
```

Key changes:
- Line 3: Added `usePathname` import
- Line 10: Added `const pathname = usePathname();`
- Line 23: Changed `window.location.pathname` to `pathname`
- Line 39: Changed `window.location.pathname` to `pathname`

- [ ] **Step 3: Run filtering tests**

Run: `npm test -- useFiltering`

Expected: All useFiltering tests pass

- [ ] **Step 4: Verify build succeeds**

Run: `npm run build`

Expected: Build completes without errors (no "window is not defined" errors in static generation)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useFiltering.ts
git commit -m "fix: replace window.location.pathname with usePathname hook for SSR compatibility"
```

---

### Task 3: Fix StatsBar Timestamp

**Files:**
- Modify: `src/components/StatsBar.tsx:1-38`
- Test: `__tests__/StatsBar.test.tsx`

**Interfaces:**
- Consumes: None (component props)
- Produces: StatsBar component with static pipeline publish time (08:00 UTC)

**Context:**
Gemini flagged that StatsBar currently calculates and displays the user's current browser time as "Last update", which is misleading. It should show the actual pipeline schedule time (08:00 UTC when data is published daily).

- [ ] **Step 1: Read current StatsBar implementation**

Run: `cat src/components/StatsBar.tsx`

Expected: Component code showing useEffect that sets lastUpdate to current time

- [ ] **Step 2: Update StatsBar with static timestamp**

Replace the component:

```typescript
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function StatsBar() {
  const [showSampleData, setShowSampleData] = useState(false);

  useEffect(() => {
    // The curation pipeline runs daily and publishes at 08:00 UTC.
    // Set sample data indicator (can be determined by env or config)
    setShowSampleData(false);
  }, []);

  return (
    <div className="bg-ink-900 px-4 py-3 text-sm font-mono text-ink-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex-1">
          5 feeds · 1,110 articles scanned · 50 selected · Last update: 08:00 UTC
          {showSampleData && <span className="ml-2 text-ink-400">(sample data)</span>}
        </div>
        <Link href="/about" className="text-signal-info hover:underline">
          How it works →
        </Link>
      </div>
    </div>
  );
}
```

Key changes:
- Removed dynamic time calculation logic
- Line 11: Changed comment to clarify pipeline publishes at 08:00 UTC
- Line 19: Hardcoded "Last update: 08:00 UTC" to reflect actual schedule, not current browser time

- [ ] **Step 3: Run StatsBar tests**

Run: `npm test -- StatsBar`

Expected: All StatsBar tests pass

- [ ] **Step 4: Verify build succeeds**

Run: `npm run build`

Expected: Build completes without errors

- [ ] **Step 5: Commit**

```bash
git add src/components/StatsBar.tsx
git commit -m "fix: correct StatsBar to show actual pipeline publish time (08:00 UTC)"
```

---

### Task 4: Remove Unused CSS Class

**Files:**
- Modify: `src/app/globals.css:44-47`
- Test: Full build verification

**Interfaces:**
- Consumes: None
- Produces: Clean globals.css without unused .max-content class

**Context:**
Gemini flagged unused `.max-content` CSS class in globals.css. All components use Tailwind's `max-w-content` utility class instead. Removing it reduces CSS bloat.

- [ ] **Step 1: Verify .max-content is truly unused**

Run: `grep -r "max-content" src/ --include="*.tsx" --include="*.ts"`

Expected: Results show only Tailwind `max-w-content` usage, no `.max-content` class references

- [ ] **Step 2: Remove the unused CSS class from globals.css**

Open `src/app/globals.css` and remove lines:

```css
  .max-content {
    max-width: 52rem;
  }
```

The file should end at line 44 (right after `bg-ink-600`).

- [ ] **Step 3: Verify build succeeds**

Run: `npm run build`

Expected: Build completes successfully with smaller CSS output

- [ ] **Step 4: Run full test suite**

Run: `npm test`

Expected: All 6+ tests pass

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "chore: remove unused .max-content CSS class"
```

---

## Summary

**Total Tasks:** 4  
**Files Modified:** 4 (ArticleCard.tsx, useFiltering.ts, StatsBar.tsx, globals.css)  
**Estimated Effort:** 20-30 minutes per task  
**Quality Gates:** Per-task review + final whole-branch review

All fixes address Gemini's findings and maintain backward compatibility with existing tests.
