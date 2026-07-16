# Task 8: Trim Brief Cards to 3-4 Items

**Context:** BriefCard components on daily/weekly/monthly pages already receive `.slice(0, 4)` from their parent pages (Tasks 2-4), so BriefCard itself accepts any number of items. This task verifies BriefCard renders variable-length items correctly (not hardcoded for 6 slots).

**Scope:** Verify or update `src/components/BriefCard.tsx`:
1. Confirm component accepts `items` array of any length (via props)
2. If hardcoded for 6 slots, replace with `.map()` over array
3. Ensure CSS spacing/layout works for 3-4 items

**Files:**
- Modify: `src/components/BriefCard.tsx` (if needed)

**Interfaces:**
- Consumes: `items: Array<{ id, title, category, url, isTopPick }>` (variable length)
- Produces: BriefCard renders 3-4 items cleanly

---

## Steps

### Step 1: Review current BriefCard implementation

```bash
cd /Users/rafalciesielski/Developer/qa-news
cat src/components/BriefCard.tsx | head -50
```

**Expected patterns:**
- If flexible: `.map((item) => <BriefItem key={item.id} item={item} />)` ✅
- If hardcoded: `{items[0] && <BriefItem item={items[0]} />} ... {items[5] && ...}` ❌

### Step 2: If hardcoded, replace with flexible render

If you find hardcoded indexing, replace with:

```typescript
{items.map((item) => (
  <BriefItem key={item.id} item={item} />
))}
```

### Step 3: Run TypeScript check

```bash
cd /Users/rafalciesielski/Developer/qa-news && npx tsc --noEmit
```

### Step 4: Test locally

```bash
npm run dev
# Open /daily, /weekly, /monthly
# Verify: Each shows 3-4 items in brief (not 6)
# Verify: Spacing looks good
# Verify: All links clickable
```

### Step 5: Commit (if changes made)

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/components/BriefCard.tsx
git commit -m "fix: trim brief cards to 3-4 items for better UX"
```

---

## Success Criteria

✅ BriefCard accepts variable-length items  
✅ Renders 3-4 items (not hardcoded for 6)  
✅ Layout/spacing works for 3-4 items  
✅ TypeScript passes  
✅ Commit created (if changes made)

**Note:** If BriefCard is already flexible, this task completes with no changes (and no commit).
