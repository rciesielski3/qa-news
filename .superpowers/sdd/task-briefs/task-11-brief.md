# Task 11: Responsive Test Suite

**Context:** After all component fixes are in place, verify the app works correctly at all target breakpoints.

**Scope:** Manual testing across all responsive breakpoints:
1. 375px (small phone)
2. 390px (phone)
3. 520px (tablet breakpoint)
4. 640px (tablet breakpoint)
5. 768px (tablet)
6. 900px (desktop small)
7. 1024px+ (desktop)

**Files:**
- Test: All pages (/, /weekly, /monthly, /about)

**Interfaces:**
- Consumes: All fixes from Tasks 1-10
- Produces: Verification report of responsive behavior

---

## Steps

### Step 1: Start dev server

```bash
cd /Users/rafalciesielski/Developer/qa-news
npm run dev
```

### Step 2: Test each breakpoint

Open DevTools, toggle device toolbar. For each width, test:

#### All Pages (/, /weekly, /monthly, /about)
- **375px:**
  - No horizontal scroll
  - Text readable
  - FilterBar doesn't overflow
  - Brief cards display correctly
  - Navigation accessible
  
- **390px:** Same as 375px
  
- **520px:**
  - Pipeline grid responsive (correct columns)
  - Spacing appropriate
  - Links clickable
  
- **640px:**
  - Same as 520px
  
- **768px:**
  - Tablet layout correct
  - Grid responsive
  
- **900px:**
  - Desktop layout correct
  - 2-column pipeline grid
  
- **1024px+:**
  - Full desktop layout
  - 4-column pipeline grid

### Step 3: Test dark/light theme at each breakpoint

```bash
# Use header gear icon to toggle theme
# At 375px, 768px, 1024px verify:
# - Text readable in both modes
# - Colors have sufficient contrast
# - No layout shifts on toggle
```

### Step 4: Test filters and functionality at mobile

```bash
# At 375px:
# - Category filter works
# - Tag filter works (collapse/expand)
# - Clear filters works
# - Article links clickable
# - Brief cards display correctly
```

### Step 5: Create test report

Document results in `/Users/rafalciesielski/Developer/qa-news/.superpowers/sdd/task-briefs/task-11-report.md`:

```markdown
# Task 11: Responsive Testing Report

**Date:** [date]
**Status:** COMPLETE ✅

## Test Results

### 375px Breakpoint
- ✅ No horizontal overflow
- ✅ Text readable
- ✅ FilterBar accessible
- ✅ Brief cards display
- ✅ All functions work

### 390px Breakpoint
- ✅ [same as 375px]

### 520px Breakpoint
- ✅ Grid responsive
- ✅ Spacing appropriate

### 640px, 768px, 900px, 1024px
- ✅ [verified]

## Theme Testing
- ✅ Dark/light toggle works at all breakpoints
- ✅ Colors readable in both modes
- ✅ No layout shifts on toggle

## Filter Testing
- ✅ Categories work at mobile
- ✅ Tags collapse/expand works
- ✅ Clear filters works
- ✅ Links clickable

## Overall
✅ All responsive tests pass. App ready for mobile/tablet/desktop.
```

### Step 6: Commit

```bash
cd /Users/rafalciesielski/Developer/qa-news
git add .superpowers/sdd/task-briefs/task-11-report.md
git commit -m "test: verify responsive design at all breakpoints"
```

---

## Success Criteria

✅ No overflow at 375px/390px  
✅ Readable at all breakpoints  
✅ Filters work on mobile  
✅ Theme toggle works  
✅ All features accessible  
✅ Test report created
