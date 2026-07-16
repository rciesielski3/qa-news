# Task 13: Build and Final Verification

**Context:** After all tasks complete and tests pass, build the static export and verify all features work in production build.

**Scope:** Build static export and test:
1. Build succeeds with no errors
2. Test built output locally
3. Verify all fixes are present
4. Final integration check

**Files:**
- Build: `npm run build` → `out/` directory

**Interfaces:**
- Consumes: All changes from Tasks 1-12
- Produces: Verified static build ready for deployment

---

## Steps

### Step 1: Build static export

```bash
cd /Users/rafalciesielski/Developer/qa-news
npm run build
```

**Expected:** Build succeeds with no errors or warnings.

### Step 2: Test built output

```bash
npx http-server out -p 3000
# Open http://localhost:3000 in browser
```

### Step 3: Verify each fix is in place

Test each of the 12 issues:

1. **Date Filtering:** Daily ≠ Weekly ≠ Monthly
   - Compare article counts and dates across pages
   - Daily shows today only
   - Weekly shows 7-day window
   - Monthly shows 30-day window

2. **Top Pick Badges:** Only on first 3-4 from date-scoped set
   - Check daily/weekly/monthly briefs
   - Count badges in full article list (should be only those in brief)

3. **Publish Dates:** Displayed on all article cards
   - Each article shows date (e.g., "Jul 15, 2026")

4. **Footer:** No gap on short pages
   - Check /about page
   - Footer should be at bottom

5. **Responsive:** No overflow at 375px/390px
   - Open DevTools, set width to 375px
   - No horizontal scroll
   - Text readable

6. **Brief Cards:** Show 3-4 items (not 6)
   - Check daily/weekly/monthly briefs
   - Count items (should be 3-4)

7. **FilterBar:** Doesn't overflow on mobile
   - At 375px, tags show 3 + "Show more" button

8. **Theme Toggle:** Has aria-label
   - Inspect gear icon in header
   - Should have `aria-label="Toggle dark/light theme"`

9-12. **Additional features:** Verify working

### Step 4: Test all core functionality

```bash
# At http://localhost:3000 (built output):
# - Filter by category (check filters work)
# - Filter by tag (check tag visibility)
# - Click articles (check links work)
# - Toggle theme (check dark/light mode)
# - Navigate to /weekly, /monthly (check each works)
# - Test at 375px, 768px, 1024px (responsive)
```

### Step 5: Create final report

Write to `/Users/rafalciesielski/Developer/qa-news/.superpowers/sdd/task-briefs/task-13-report.md`:

```markdown
# Task 13: Build and Final Verification Report

**Date:** [date]
**Status:** COMPLETE ✅

## Build Results

```bash
$ npm run build
[build output]
```

**Result:** ✅ Build succeeds with no errors

## Feature Verification Checklist

### Critical Fixes
- ✅ Issue #1: Date filtering (Daily ≠ Weekly ≠ Monthly)
- ✅ Issue #2: Top Pick badges only on date-scoped briefs
- ✅ Issue #3: Footer gap removed
- ✅ Issue #4: Responsive at 375px/390px
- ✅ Issue #5: Publish dates displayed

### Polish Fixes
- ✅ Issue #6: Brief cards trimmed to 3-4
- ✅ Issue #7: FilterBar accessible on mobile
- ✅ Issue #8: Theme toggle labeled

### Functionality Testing
- ✅ Filtering works (categories, tags)
- ✅ All links clickable
- ✅ Theme toggle works
- ✅ Navigation works
- ✅ No console errors

## Overall Assessment

✅ All 12 issues resolved and verified in production build
✅ Build size: [note size]
✅ Ready for deployment

```

### Step 6: Final commit

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add .superpowers/sdd/task-briefs/task-13-report.md
git commit -m "build: all QA-News bug fixes complete and verified"
```

---

## Success Criteria

✅ Build succeeds with no errors  
✅ All 12 fixes verified in production build  
✅ All features work correctly  
✅ No console errors  
✅ Responsive at all breakpoints  
✅ Final report created
