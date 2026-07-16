# Task 6: Fix Footer Layout Issue

**Context:** On pages with short content (e.g., /about), there's a large gap between the page content and the footer. This is because `.page { flex: 1 }` on main forces it to stretch to full viewport height, pushing footer down.

**Scope:** Modify `src/app/theme.css` to fix footer layout:
1. Verify `.page` container has `display: flex; flex-direction: column`
2. Change `.page > main { flex: 1 }` to work correctly without gaps
3. Ensure footer always appears at bottom, no gap on short pages

**Files:**
- Modify: `src/app/theme.css` (lines 122-127)

**Interfaces:**
- Consumes: Existing `.page` flex layout
- Produces: Footer properly positioned at bottom, no gap on short pages

---

## Steps

### Step 1: Review current footer layout in theme.css

```bash
cd /Users/rafalciesielski/Developer/qa-news
sed -n '122,127p' src/app/theme.css
```

Expected output shows `.page` flex container and `.page > main` with flex: 1.

### Step 2: Fix layout

Replace lines 122-127 with:

```css
/* Page is a flex column so the footer never floats mid-void. */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}
.page > main {
  flex: 1;
}
```

**Explanation:**
- `display: flex; flex-direction: column` creates flex column container
- `min-height: 100dvh` ensures page is at least viewport height
- `main { flex: 1 }` stretches main to fill available space (correct)
- Footer stays at bottom, no gap when content is short

### Step 3: Test on /about page (minimal content)

```bash
npm run dev
# Open http://localhost:3000/about
# Verify: Footer is at bottom with no large gap
# Verify: No horizontal scroll
# Test on mobile (375px width)
```

### Step 4: Commit

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/app/theme.css
git commit -m "fix: remove footer spacing gap on short pages"
```

---

## Success Criteria

✅ Footer spacing gap eliminated  
✅ Footer positioned at bottom  
✅ No gaps on pages with short content  
✅ Layout works on mobile  
✅ Commit created
