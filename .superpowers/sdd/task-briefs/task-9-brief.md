# Task 9: Optimize FilterBar Height (Collapsible Tags)

**Context:** FilterBar shows category chips and tag chips. On mobile (375px/390px), the tags row causes overflow because there are many tags. This task adds a "Show more/Show less" toggle to collapse tags initially.

**Scope:** Modify `src/components/FilterBar.tsx` to:
1. Add state for tag visibility toggle
2. Show only first 3 tags by default
3. Add "Show X more" button to expand all tags
4. Collapse when "Show less" clicked
5. For ≤3 tags, show all (no toggle needed)

**Files:**
- Modify: `src/components/FilterBar.tsx`

**Interfaces:**
- Consumes: `availableTags` array, `onTagChange` callback (existing props)
- Produces: FilterBar with collapsible tags section

---

## Steps

### Step 1: Add state and render logic

In FilterBar component, after existing state, add:

```typescript
const [showAllTags, setShowAllTags] = useState(false);
const displayedTags = showAllTags ? availableTags : availableTags.slice(0, 3);

// In JSX, replace tags section with:
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

{availableTags.length <= 3 && (
  <div className="flex flex-wrap gap-2">
    {availableTags.map((tag) => (
      <button key={tag} className="tag-chip" onClick={() => onTagChange(tag, !activeFilters.tags?.includes(tag))}>
        {tag}
      </button>
    ))}
  </div>
)}
```

### Step 2: Run TypeScript check

```bash
cd /Users/rafalciesielski/Developer/qa-news && npx tsc --noEmit
```

### Step 3: Test on mobile

```bash
npm run dev
# Open at 375px width
# Verify: Shows 3 tags + "Show X more" button
# Verify: Clicking expands all tags
# Verify: "Show less" collapses
# Verify: Filters work correctly
```

### Step 4: Commit

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/components/FilterBar.tsx
git commit -m "ux: add collapsible tags in FilterBar for mobile"
```

---

## Success Criteria

✅ Tags collapse to 3 items + "Show more" button  
✅ "Show more" expands all tags  
✅ "Show less" collapses  
✅ No overflow at 375px  
✅ Filters work correctly  
✅ Commit created
