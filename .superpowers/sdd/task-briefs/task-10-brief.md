# Task 10: Add Aria-Label to Theme Toggle

**Context:** Header has a gear icon button to toggle dark/light theme. It currently has no aria-label or title, making it inaccessible to screen readers and lacks a tooltip.

**Scope:** Modify `src/app/layout.tsx` to add accessibility attributes to the theme toggle button:
1. Add `aria-label="Toggle dark/light theme"`
2. Add `title="Toggle dark/light theme"` (shows tooltip on hover)

**Files:**
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: Existing theme toggle button
- Produces: Button with accessible label and tooltip

---

## Steps

### Step 1: Find theme toggle button in layout.tsx

```bash
cd /Users/rafalciesielski/Developer/qa-news
grep -n "toggleTheme\|theme.*button" src/app/layout.tsx
```

Expected: Returns line number of theme toggle button.

### Step 2: Add accessibility attributes

Find the button (likely near header/nav) and update:

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

### Step 3: Run TypeScript check

```bash
cd /Users/rafalciesielski/Developer/qa-news && npx tsc --noEmit
```

### Step 4: Test accessibility

```bash
npm run dev
# Open DevTools > Accessibility tree
# Verify button has accessible name "Toggle dark/light theme"
# Hover over gear icon and verify tooltip appears
# Verify clicking button toggles theme
```

### Step 5: Commit

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add src/app/layout.tsx
git commit -m "a11y: add aria-label to theme toggle button"
```

---

## Success Criteria

✅ aria-label present on button  
✅ title attribute present (tooltip)  
✅ Screen readers announce label correctly  
✅ Tooltip shows on hover  
✅ Theme toggle still works  
✅ TypeScript passes  
✅ Commit created
