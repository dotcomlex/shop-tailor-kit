## Why the current size selection feels choppy

The current `SizeSelect` uses the generic Radix dropdown:
- Each row shows the **full Shopify string** (`"US W 8 / US M 6.5 / UK 5.5"`) — cramped on a 390px viewport.
- Default `SelectItem` styling adds a left checkmark indent (`pl-8`), tiny `text-sm` rows, no real visual hierarchy.
- Opens as a popover that overlays content, with a hard scroll inside a small box → feels list-like and clunky.
- No region awareness — the user sees all conversions at once even though they only care about their own.

## New approach: tactile **tile grid** + smart region display

Replace the dropdown with a responsive grid of size tiles — the same pattern shoe brands like Nike, Allbirds, and Hoka use. It's faster to scan, easier to tap, and visually matches the existing color swatch grid right above it.

### 1. New component: `src/components/order/SizeTileGrid.tsx`

- **Layout**: `grid-cols-4 sm:grid-cols-5` of square-ish tiles (`aspect-[1.15/1]`, ~64px tall on mobile).
- **Tile content** (region-aware, using existing `useGeo` + `parseShopifySize`):
  - Big primary number (e.g. `8` for US Women) — `text-[18px] font-extrabold tabular-nums`.
  - Tiny secondary label below (e.g. `M 6.5` or `UK 5.5`) — `text-[10px] text-mute`.
  - This collapses the cramped one-line string into a clean two-tier tile.
- **States**:
  - Default: `border-2 border-border bg-background`.
  - Hover: `border-[hsl(var(--text-body))]` + subtle `bg-secondary/40`.
  - Selected: `border-[hsl(var(--order-blue))] bg-[hsl(var(--order-blue-soft))] text-[hsl(var(--order-blue))]` + small check badge in the top-right corner.
  - Disabled / out of stock: diagonal strikethrough line via a pseudo-gradient, `opacity-60`, `cursor-not-allowed`, `aria-disabled`.
  - Focus: `ring-2 ring-[hsl(var(--ring))] ring-offset-2` for keyboard users.
- **Animation**: `transition-all duration-150` on border/bg; selected tile gets a soft `animate-scale-in` on first selection.
- **A11y**: rendered as a `role="radiogroup"`, each tile is a `button` with `role="radio"` and `aria-checked`. Keyboard arrow navigation handled with a small `onKeyDown` (Left/Right/Up/Down).

### 2. Selected-size confirmation strip

Below the grid, when a size is picked, a thin confirmation row fades in:
> ✓ Selected: **US W 8** · EU 38.5 · UK 5.5

This gives reassurance + cross-region info without forcing the user to open the size chart. Uses `animate-fade-in`.

### 3. Wire-up in `ColorSizeStep.tsx`

- Swap `<SizeSelect …/>` for `<SizeTileGrid …/>` (same props: `sizes`, `value`, `onChange`, optional `disabledSizes`).
- Keep `SizingDialogs` (size chart + tips) right below — unchanged.
- Tighten label spacing (`mt-5` → `mt-6`) so the new grid breathes.

### 4. Cleanup

- Delete `src/components/order/SizeSelect.tsx` (no longer referenced anywhere — it's only used in `ColorSizeStep`).

### What stays the same

- `parseShopifySize` and the size chart dialog are untouched — the tile grid reuses `parseShopifySize` to get clean per-region values.
- No changes to the checkout/variant resolution logic — the tile still emits the original raw Shopify size string via `onChange`.
- Brand colors (forest green `#0F483A`), typography, and the existing card layout remain consistent.

## Files

**New**
- `src/components/order/SizeTileGrid.tsx`

**Modified**
- `src/components/order/ColorSizeStep.tsx` (swap component, minor spacing)

**Deleted**
- `src/components/order/SizeSelect.tsx`

## Result

A clean, tap-friendly grid that mirrors the color swatches above it — no more tiny dropdown rows with overflowing text. Scanning sizes becomes a glance instead of a scroll, which is exactly what's missing today.