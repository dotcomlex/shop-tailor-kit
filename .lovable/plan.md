## Problem

On mobile (390px), the Size Chart modal:
- Stretches nearly full-screen with no max-height or scrollable body
- Renders ~20 rows of a 4-column table that's cramped and visually noisy
- Uses a center-positioned dialog that feels heavy on phones
- Region tabs + 2 columns + dense rows = overwhelming

## Goal

A premium, compact size chart that:
- Slides up as a **bottom sheet on mobile** (native-feeling, easy to dismiss)
- Stays as a centered dialog on desktop
- Has a **scrollable body** with sticky header + footer so it never overflows the viewport
- Shows a **cleaner row layout** that's wider per cell and easier to scan
- Highlights the user's selected size prominently

---

## Implementation

### 1. `src/components/order/SizingDialogs.tsx` — full rewrite of Size Chart

**Responsive shell**: Use `useIsMobile()` hook (already present at `src/hooks/use-mobile.tsx`) to conditionally render either `Sheet` (mobile, side="bottom") or `Dialog` (desktop). Both wrap the same shared body component to avoid duplication.

**Layout structure** (shared body):
```
┌─────────────────────────────────┐
│ Drag handle (mobile only)       │
│ Title + close                   │  ← sticky top
│ Region tabs (4 pills)           │
├─────────────────────────────────┤
│ Scrollable size rows            │  ← max-h: 60vh on mobile,
│   ┌──────────────────────────┐  │     auto on desktop
│   │ Women  │ Men   │ ← my size│  │
│   │  US 8  │ US 6.5│  ✓       │  │
│   └──────────────────────────┘  │
│   ...                           │
├─────────────────────────────────┤
│ Tip footer (cm → EU)            │  ← sticky bottom
└─────────────────────────────────┘
```

**New row design** (replaces the cramped table):
- Each size = a **card row**, not a table cell — `flex items-center justify-between` with comfortable padding (`py-3 px-4`)
- Left: two stacked labels — "Women" small caps + big number, "Men" small caps + big number (side-by-side `flex gap-6`)
- Right: when this row matches `selectedSize`, show a blue pill `Your size ✓`
- Selected row: blue tinted background + left border accent (`border-l-4 border-[hsl(var(--order-blue))]`)
- Other rows: alternating subtle stripe, hairline divider between
- Numbers use `tabular-nums` and `font-extrabold` for the active region, `font-semibold text-mute` for the secondary

**Region tabs**: Keep the current 4-pill segmented control but make it sticky directly under the title. Active region drives which two numbers appear large; the other region's number shows as muted secondary below (e.g., active=UK shows "UK 5.5" big, "EU 38.5 · US W 8" small underneath). This collapses the 4-column table into a single readable column.

**Auto-scroll to selected**: On open, `scrollIntoView({ block: "center" })` the row matching `selectedSize` so the user instantly sees their size.

### 2. Sheet component reuse

Use existing `src/components/ui/sheet.tsx` with `side="bottom"`. Add classes:
- `rounded-t-2xl`
- `max-h-[85vh]`
- `flex flex-col` so the inner scroll area can flex-grow
- Drag handle bar at top (`h-1.5 w-10 rounded-full bg-muted mx-auto mt-2`)

### 3. Sizing Tips dialog

Apply the same mobile sheet / desktop dialog pattern for consistency. Keep the 3 bullet tips but wrap them in the same shell so both modals feel like a matched pair.

### 4. Small polish

- Title size: `text-[17px]` mobile / `text-[19px]` desktop (current 18px is awkward)
- Add a subtle "Recommended for you" note above the auto-detected region tab when geo detection succeeded (uses existing `useGeo` data already wired in)
- Footer tip card: lighter background, smaller icon, single-line on mobile

---

## Files

- **Edit** `src/components/order/SizingDialogs.tsx` — responsive Sheet/Dialog shell, redesigned row layout, scroll-to-selected, sticky header/footer

No new files, no data changes. Pure UI refinement of one component.
