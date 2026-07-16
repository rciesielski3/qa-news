# Task 7: Add Responsive Breakpoints for Mobile (375px/390px)

**Context:** The pipeline grid on /about page is 4 columns by default with responsive breakpoints only at 900px and 520px. On 375px/390px mobile viewports, the layout doesn't adapt, causing horizontal overflow and text clipping.

**Scope:** Modify `src/app/theme.css` to add 375px breakpoint:
1. Add `@media (max-width: 375px)` rule for pipeline grid
2. Reduce columns and adjust spacing for small screens
3. Ensure no horizontal overflow at 375px/390px

**Files:**
- Modify: `src/app/theme.css` (lines 525-531)

**Interfaces:**
- Consumes: Existing `.pipeline` grid styles
- Produces: Responsive layout at 375px/390px viewports

---

## Steps

### Step 1: Review current pipeline breakpoints in theme.css

```bash
cd /Users/rafalciesielski/Developer/qa-news
sed -n '525,531p' src/app/theme.css
```

Expected: Shows `.pipeline` grid with breakpoints at 900px and 520px.

### Step 2: Add 375px breakpoint

Replace lines 525-531 with:

```css
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

**Explanation:**
- Desktop (4-col): repeats 4 columns
- 900px breakpoint: switches to 2 columns
- 640px breakpoint: switches to 1 column
- 375px breakpoint: reduces gap (12px → 8px) and padding (16px → 12px)
- Prevents overflow and ensures readability on small screens

### Step 3: Test responsiveness at multiple breakpoints

```bash
npm run dev
# Open DevTools, toggle device toolbar
# Test widths:
#   - 375px: no horizontal scroll, readable text
#   - 390px: same
#   - 520px: correct grid layout
#   - 640px: correct grid layout
#   - 900px: correct grid layout
#   - 1024px: 4-column grid
```

### Step 4: Commit

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/app/theme.css
git commit -m "fix: add responsive breakpoints for 375px/390px mobile viewports"
```

---

## Success Criteria

✅ 375px breakpoint added  
✅ No horizontal overflow at 375px/390px  
✅ Text readable on small screens  
✅ Responsive layout works at all breakpoints  
✅ Commit created
