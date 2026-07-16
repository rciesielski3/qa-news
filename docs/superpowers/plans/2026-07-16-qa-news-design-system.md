# QA-News Design System Implementation Plan

**Status:** Starting Task 2 (Task 1 complete)  
**Repo:** qa-news (rciesielski3/qa-news)  
**Branch:** main  
**Base commit:** 13310f3 (feat: add token-based design system)

---

## Global Constraints

**Architecture:**
- Single `.container` class (880px max-width, 0 24px padding)
- All pages use same layout: header → stats-bar → main (flex: 1) → footer
- No hardcoded colors in components; all use CSS variables from theme.css
- Token mapping: `[data-cat="category-slug"]` → `--cat` variable
- Two fonts only: Inter (sans, all UI) + JetBrains Mono (mono, meta/tags/stats)

**Color System:**
- Dark mode (default): #0B0D10 bg, #12151B surface, #262B35 borders
- Light mode: #FAFBFC bg, #FFFFFF surface, #E2E6EC borders
- Category tokens have dark variants (4.5:1 on light) and bright variants (4.5:1 on dark surface)
- No-flash theme script required in `<head>` before render

**Typography:**
- Title (article): 17–18px, weight 600
- Section header: 18px, weight 650
- Body: 15px, Inter, line-height 1.6
- Meta (stats, tags, categories): JetBrains Mono 11–13px, uppercase with letter-spacing

**Component Patterns:**
- Brief card: full border (1px), single column, grid at ≥1024px if items.length ≥ 4
- Article card: left 3px accent (category color), subtle surface, no bright bg
- Filters: category chips (dot + label, colored) + tag chips (neutral, accent when active)
- Stats bar: one line, link inline right, meta badges as needed

**Accessibility:**
- Active navigation: `aria-current="page"`
- Active filters: `aria-pressed="true"` / `false`
- Focus ring: 2px solid var(--accent)
- Reduce motion: `@media (prefers-reduced-motion: reduce)` applies to all transitions
- WCAG AA 4.5:1 on text, AAA where possible on interactive elements

---

## Task Breakdown

### Task 1: Design System Tokens + CSS ✅ COMPLETE
**Status:** DONE (commit 13310f3)
**Deliverable:** `src/app/theme.css` with all tokens, base styles, and component classes

### Task 2: Light Theme Refinement + Theme Toggle
**Focus:** Fix light theme contrast; implement theme switcher UI + no-flash logic

**Deliverables:**
1. **theme.css refinement:** Boost light theme --border-strong, --text-2 contrast (add light gray/gray accents where needed for better visual hierarchy)
2. **ThemeToggle.tsx:** Sun/moon icon button, toggles data-theme, saves to localStorage
3. **layout.tsx updates:**
   - Import fonts (Inter + JetBrains Mono via next/font, attach .variable to <html>)
   - Add no-flash script in <head> with suppressHydrationWarning on <html>
   - Remove Tailwind's default fonts (use theme.css --font-sans/--font-mono only)

**Spec reference:** Guidelines section 2 (Karty artykułów), section 3 (System tokenów + theme switcher), section 4 (Typografia)

**Definition of Done:**
- Light theme readable: category labels, text, borders all meet WCAG AA
- Theme toggle renders in header next to nav
- No flash on reload (light-theme users see correct theme on first paint)
- Fonts loaded from next/font with CSS variable fallback
- suppressHydrationWarning on <html>

---

### Task 3: Page Skeleton (Header, Nav, Footer, Stats Bar)
**Focus:** Wire header/nav/footer layout; place stats-bar between header and main

**Deliverables:**
1. **app/layout.tsx:** Update with global page structure (flex column, footer anchored)
2. **components/Header.tsx:** Logo + nav (Daily/Weekly/Monthly/About) + ThemeToggle
3. **components/StatsBar.tsx:** One-line stats + "How it works →" link inline right
4. **components/Footer.tsx:** Border-top, left-aligned, quiet text
5. **Update all pages:** (daily/page.tsx, weekly/page.tsx, monthly/page.tsx, about/page.tsx)
   - Wrap content in .page > main > .container
   - Use consistent layout structure

**Spec reference:** Guidelines section 1 (Layout), section 6 (Stats bar i footer)

**Definition of Done:**
- Header on every page with nav items + theme toggle
- Stats bar shows placeholder data (5 feeds, 1110 articles, 50 selected, updated 08:00 UTC)
- Footer sits at bottom even with 3 articles (flex: 1 on main)
- All pages use same width (880px container)
- aria-current="page" on active nav link

---

### Task 4: Brief Card Component
**Focus:** Daily/Weekly/Monthly brief card (top picks list)

**Deliverables:**
1. **components/BriefCard.tsx:**
   - Props: title (string), items (array of {id, title, category, source, isTopPick})
   - Renders single column by default; add .brief-list--grid class if items.length >= 4
   - Grid only active at ≥1024px (CSS handles it)
   - Each item has colored dot (category), link, meta (category label, "★ Top Pick" if applies)

**Spec reference:** Guidelines section 5 (Nagłówki sekcji per okres), Brief Card definition

**Definition of Done:**
- Title changes per page (Daily: "Daily Brief — Top Picks", Weekly: "Weekly Brief — Top Picks", Monthly: "Monthly Highlights")
- Colored dots render correctly based on article.category
- Top picks marked with ★ toppick color
- Single column on narrow, grid at ≥1024px with ≥4 items
- Hover state darkens background

---

### Task 5: Filter Chips (Categories + Tags)
**Focus:** Clickable category and tag chips with active states

**Deliverables:**
1. **components/FilterBar.tsx:**
   - Two sections: "Filter by category" + "Filter by tags"
   - Category chips: circular dot + label, colored by category
   - Tag chips: neutral border, mono font
   - Active state: aria-pressed="true", border + light background tint
   - Show/hide "Showing X of Y" + "Reset filters" when filters active
2. **lib/useFiltering.ts:** Hook for filter state (if not already done)

**Spec reference:** Guidelines section 6 (Pusta przestrzeń pod listą, Filters)

**Definition of Done:**
- Category chips render with data-cat attribute and correct colors
- Tag chips use mono font, neutral appearance
- aria-pressed toggles on click
- Active chips show subtle background color (color-mix with 12% opacity)
- Reset button clears all filters
- Filter status text shows count

---

### Task 6: Article Feed + Article Card
**Focus:** Article list and individual article card styling

**Deliverables:**
1. **components/ArticleCard.tsx:**
   - Props: article {title, category, source, isTopPick, tags, url}
   - Renders: meta row (category label + source) → title (link) → tags
   - Dark card with 3px left accent (category color)
   - Hover darkens background
   - Category via data-cat attribute
2. **components/ArticleFeed.tsx:**
   - List of ArticleCards
   - Empty state if no articles (dashed border, centered text, reset link)
3. **Update daily/page.tsx, weekly/page.tsx, monthly/page.tsx:**
   - Import ArticleFeed, pass filtered articles
   - Add FilterBar above feed

**Spec reference:** Guidelines section 7 (ARTICLE FEED), section 6 (Filters)

**Definition of Done:**
- Article cards match dark surface + 3px left border style
- Category label and toppick icon display correctly
- Tags appear below title
- Hover state changes background and border color
- Empty state triggers when feed is empty
- All components use CSS variables, never hardcoded hex

---

### Task 7: Integration, Polish & Final Verification
**Focus:** Wire all components together; test theme switching, responsiveness, contrast

**Deliverables:**
1. **Integrate all components** into daily/weekly/monthly/about pages
2. **Test checklist:**
   - [ ] Theme toggle works; light theme loads without flash
   - [ ] Light theme: all text readable, 4.5:1+ contrast
   - [ ] 3-article page: footer at bottom (no void)
   - [ ] Page titles match spec (Daily Brief — Top Picks, etc.)
   - [ ] Keyboard navigation: Tab reaches all interactive elements
   - [ ] Focus ring visible on all buttons/links
   - [ ] Mobile: containers responsive, no horizontal scroll
   - [ ] Reduced motion: transitions disabled when prefersReducedMotion
3. **Build check:** `npm run build` succeeds
4. **Commit:** Record all integration work

**Spec reference:** Guidelines section 9 (Quick checklist), Accessibility notes

**Definition of Done:**
- All pages render without errors
- Theme switching works (dark ↔ light)
- No console warnings or broken layouts
- All Lighthouse checks pass (or documented deviations)
- Build succeeds (`npm run build`)
- Ready for final code review

---

## Implementation Notes

**Task ordering rationale:**
- Task 2 first (theme toggle + no-flash) is a blocker for all pages
- Task 3 (layout) establishes page structure used by all following tasks
- Tasks 4–6 build components independently (filters, brief, feed can be done in parallel conceptually, but sequential for simpler review)
- Task 7 wires everything and verifies the full system

**Component dependencies:**
- ThemeToggle needed before Header
- Header/Footer needed before pages import them
- BriefCard, FilterBar, ArticleFeed used on Daily/Weekly/Monthly
- All pages share layout from layout.tsx

**Testing approach:**
- Each task uses TDD: write what tests would check, implement to pass
- Manual verification: navigate pages, toggle theme, filter articles
- Final verification: full page screenshots (light/dark, all pages)

---

## Success Criteria

**All tasks complete when:**
1. ✅ Task 1: theme.css with tokens and base component styles (DONE)
2. ✅ Task 2: ThemeToggle wired, no-flash script in place, light theme contrast fixed
3. ✅ Task 3: Header, nav, stats bar, footer on all pages; consistent layout
4. ✅ Task 4: Brief card renders on Daily/Weekly/Monthly with correct titles
5. ✅ Task 5: Filter chips interactive, active states work, reset button clears
6. ✅ Task 6: Article feed + cards render, empty state works
7. ✅ Task 7: All integrated, theme switching works, build succeeds, ready for review

**Final deliverable:** Production-ready design system integrated into qa-news frontend, dark-first with light theme support, accessible (WCAG AA), responsive, no flash on load.
