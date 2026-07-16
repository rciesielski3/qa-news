# QA-News Design System Implementation Progress

**Plan:** `docs/superpowers/plans/2026-07-16-qa-news-design-system.md`  
**Status:** In progress (Task 1 complete, Task 2 starting)  
**Base commit:** 13310f3

## Task Status

### Task 1: Design System Tokens + CSS ✅ COMPLETE
- **Commit:** 13310f3
- **Deliverable:** theme.css with tokens, base styles, component classes
- **Review:** Spec ✅, Quality ✅

### Task 2: Light Theme Refinement + Theme Toggle ✅ COMPLETE
- **Commits:** 8eb2db0 (initial) + 6523921 (fix font class)
- **Deliverables:**
  1. ✅ theme.css light theme contrast fixes (--border-strong 1.82:1 → 3.32:1, --text-2 5.66:1 → 7.37:1; removed hardcoded --font-sans/--font-mono)
  2. ✅ ThemeToggle.tsx component (sun/moon, inline SVG, localStorage "qa-news-theme") — not wired to Header (Task 3)
  3. ✅ layout.tsx: Inter + JetBrains Mono via next/font/google, no-flash script (verbatim), suppressHydrationWarning
  4. ✅ Removed `className="font-sans"` from `<body>` (CSS specificity fix)
  5. ✅ Cleaned unused @fontsource dependencies
- **Notable findings:**
  - theme.css imported as second stylesheet from layout.tsx (not inline @import) — prevents Tailwind @layer base collision
  - Font network dependency: next/font/google needs outbound access at build time (check deploy workflow)
- **Review:** Spec ✅, Quality ✅ (after fix verification)
- **Report:** `/Users/rafalciesielski/Developer/ChiefofStaff/.superpowers/sdd/task-2-report.md`

### Task 3: Page Skeleton (Header, Nav, Footer, Stats) ✅ COMPLETE
- **Commit:** c5a9419
- **Deliverables:**
  1. ✅ globals.css: Removed conflicting @layer base, cleaned old colors
  2. ✅ layout.tsx: .page flex wrapper, .container structure, preserved fonts + script
  3. ✅ Header.tsx: Theme.css classes, ThemeToggle wired
  4. ✅ StatsBar.tsx: Theme.css classes, inline link, static placeholder
  5. ✅ Footer.tsx: Theme.css classes, 2-sentence copy
  6. ✅ Pages: Removed redundant padding
- **Review:** Spec ✅, Quality ✅, Ready to merge

### Task 4: Brief Card Component ✅ COMPLETE
- **Commits:** e9484e5 (component) + c0f0cda (fix: hover state)
- **Deliverables:** ✅ BriefCard.tsx with title per period, single/grid layout logic, hover state
- **Review:** Spec ✅, Quality ✅, Ready to merge

### Task 5: Filter Chips (Categories + Tags)
- **Status:** IN PROGRESS
- **Implementer:** [launching now]
- **Deliverables:** FilterBar.tsx with category + tag chips, aria-pressed states
- **Commits:** [pending]

### Task 6: Article Feed + Article Card
- **Status:** STAGED (brief + context ready)
- **Deliverables:** ArticleCard.tsx + ArticleList.tsx with theme.css styling

### Task 7: Integration, Polish & Verification
- **Status:** QUEUED
- **Deliverables:** Wire all components, final verification (theme switching, contrast, mobile, build)

---

## Progress Summary

**Completed:** 1/7 tasks  
**In Progress:** Task 2  
**Next:** Code review after Task 2 completion
