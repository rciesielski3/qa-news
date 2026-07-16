# Task 5: Add Publish Date Display to ArticleCard

**Context:** ArticleCard component shows category, source, and tags, but not the publish date. Users can't easily tell when an article was published. This task adds the `publishedAt` field display.

**Scope:** Modify `src/components/ArticleCard.tsx` to:
1. Display formatted publish date below category/source
2. Use readable format (e.g., "Jul 15, 2026")
3. Handle missing `publishedAt` gracefully (some older articles may not have it)
4. Match theme colors (dark/light mode support)

**Files:**
- Modify: `src/components/ArticleCard.tsx`

**Interfaces:**
- Consumes: Article type with `publishedAt: string` (ISO 8601)
- Produces: ArticleCard displays formatted publish date

---

## Steps

### Step 1: Read current ArticleCard and locate metadata section

```bash
cd /Users/rafalciesielski/Developer/qa-news
cat src/components/ArticleCard.tsx | head -40
```

Find the section that displays category and source. It should look like:
```typescript
<div className="flex items-center gap-2 text-xs text-text-2">
  <span className={`px-2 py-1 rounded ${categoryBgClass(article.category)}`}>
    {getCategoryLabel(article.category)}
  </span>
  <span>{article.source}</span>
</div>
```

### Step 2: Modify ArticleCard to add publish date

Replace the metadata section (category + source) with:

```typescript
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

**Explanation:**
- Wraps both elements in a flex column container with gap
- Category/source row stays on one line
- Publish date on second line (if present)
- Uses `.text-text-3` for slightly muted color (maintains hierarchy)
- Uses `toLocaleDateString` for consistent formatting
- Defensive: only renders if `publishedAt` exists

### Step 3: Run TypeScript check

```bash
cd /Users/rafalciesielski/Developer/qa-news && npx tsc --noEmit
```

Expected: No errors.

### Step 4: Test in dev server

```bash
npm run dev
# Open http://localhost:3000
# Inspect article cards:
# - Verify publish date displays (e.g., "Jul 15, 2026")
# - Verify date appears below category/source
# - Test dark/light theme toggle (gear icon)
# - Verify formatting looks good on mobile (375px)
```

### Step 5: Commit

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/components/ArticleCard.tsx
git commit -m "feat: display publish date on article cards"
```

---

## Success Criteria

✅ Publish dates displayed on all articles  
✅ Date format is readable (e.g., "Jul 15, 2026")  
✅ Gracefully handles missing dates (no crash)  
✅ Styling matches theme colors  
✅ TypeScript passes  
✅ Responsive on mobile  
✅ Commit created
