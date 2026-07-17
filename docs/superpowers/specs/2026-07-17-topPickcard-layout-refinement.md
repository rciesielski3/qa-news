# QA-News Daily Page UI Refinements

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve QA-News daily page by (1) refining TopPickCard layout for consistency with variable content, (2) enhancing Load More button interaction design.

**Architecture:** 
- TopPickCard: three-zone layout (pinned header, flexible middle, pinned footer) for visual alignment
- Load More button: enhanced hover/active states with scale effect and color feedback

**Tech Stack:** React, TypeScript, Tailwind CSS (flexbox, flex-grow, line-clamp utilities)

## Global Constraints

- Star icon: Use `★` (Unicode U+2605) or emoji `⭐`
- Title: Always show full text, never truncate
- Summary/subtitle: Truncate to 2-3 lines with ellipsis (line-clamp-2 or line-clamp-3)
- Header: Rank badge + Category label + Star icon (fixed height, always visible)
- Footer: Read Article button (fixed height h-8, always at bottom)
- Card height: `h-auto` (grows naturally with content), minimum 280px to prevent sparse appearance
- Dark/light theme colors unchanged; only layout restructured
- All 45 existing tests must pass

---

## Design Sections

### 1. Visual Layout

TopPickCard becomes a flex column with three zones:

```
┌─────────────────────────────────┐
│ [1] [TEST AUTOMATION] ★         │  ← Header (pinned, h-12)
├─────────────────────────────────┤
│                                 │
│ Title (full text)               │  ← Flexible middle
│                                 │  ← (grows/shrinks)
│ Summary (2-3 lines, ellipsis)   │
│                                 │
├─────────────────────────────────┤
│ [READ ARTICLE →]                │  ← Footer (pinned, h-8)
└─────────────────────────────────┘
```

**Layout properties:**
- Outer container: `flex flex-col` with `justify-between` (space header/footer apart)
- Header zone: `flex-shrink-0` (never compresses)
- Middle zone: `flex-grow` (expands to fill available space)
- Footer zone: `flex-shrink-0` (fixed h-8)
- Card: `h-auto` with `min-h-[280px]` to prevent sparse appearance

### 2. Star Icon Implementation

Replace "Top Pick" text badge with inline star icon.

**Current (lines 20-22):**
```tsx
<span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border border-orange-300 dark:border-orange-700">
  Top Pick
</span>
```

**New:**
- Remove badge styling (border, bg, px/py)
- Replace "Top Pick" text with `★` (or `⭐` emoji)
- Apply orange color directly to star: `text-orange-600 dark:text-orange-400`
- Smaller size than category label to maintain hierarchy

### 3. Content Truncation

**Title:** Keep as-is, no truncation.

**Summary/subtitle:** Apply line-clamp to prevent overflow.
- If article has both subtitle + summary: show subtitle (line-clamp-2), omit summary to save space
- If article has only summary: show summary (line-clamp-3 for more content)
- Truncation: `line-clamp-2` or `line-clamp-3` Tailwind utility
- Fallback for browsers without line-clamp: manual max-height + overflow-hidden

### 4. Responsive Behavior

- Mobile (375px): Card takes full container width, middle zone minimum 200px
- Tablet (768px): 2-column grid, each card 350px
- Desktop (1024px+): 3-column grid, each card 380px
- All breakpoints: header/footer stay pinned, middle zone adjusts

### 6. Load More Button Styling

Enhance Load More button interaction design on daily page article list.

**Current state:**
- Basic button styling, minimal hover feedback
- Border-top line above button (remove)

**New interactive states:**

1. **Default:** Standard button appearance (existing colors/sizing OK, just remove line above)
2. **Hover:** 
   - Background color: lighter tint (category color at 100-level or similar)
   - Scale effect: `scale-105` on hover
   - Transition: smooth 150ms
3. **Active/After-click:** 
   - Background: darker tint (category color at 600-level) for feedback
   - Text color: lighter text for contrast

**Implementation:**
- Remove `border-t` or line-above CSS
- Add Tailwind hover classes: `hover:scale-105 hover:bg-{color}-100`
- Add `active:bg-{color}-600` for click feedback
- Transition: `transition-all duration-150`

### 5. Testing

- TopPickCard tests: 45 existing tests, update snapshots if layout changes visually
- New TopPickCard cases:
  - Card with long title + long summary: verify truncation
  - Card with short summary: verify min-height doesn't create sparse space
  - Dark theme: verify star color visibility
  - Mobile: verify header/footer alignment
- Load More button tests:
  - Hover state: verify scale and color change
  - Active state: verify click feedback
  - Line removed: verify no border-top above button
  - Dark/light themes: verify colors work both ways

---

## Success Criteria

**TopPickCard:**
1. ✓ Star icon visible in header, orange colored
2. ✓ Cards align horizontally by header and footer (no drift from content variation)
3. ✓ Title always fully visible
4. ✓ Summary truncated gracefully at 2-3 lines
5. ✓ Read button always at card bottom
6. ✓ Dark/light themes work correctly

**Load More Button:**
7. ✓ Line (border-top) above button removed
8. ✓ Hover state: scale 105% + lighter bg color
9. ✓ Active state: darker bg color for click feedback
10. ✓ Transition smooth (150ms)
11. ✓ Dark/light themes: colors work both ways

**Testing:**
12. ✓ All 45 existing tests pass (update snapshots if needed)
13. ✓ New test cases for TopPickCard truncation + Load More states
