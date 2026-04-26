
# Cleaner Size Selection — Region Picker + Single-Number Tiles

You're right — cramming `W 8` and `M 6.5` into every tile at 390px wide is visually noisy. The fix is to **let the shopper pick their sizing system once**, then show **one big, clean number per tile**. This is exactly how Allbirds, Nike, and On Running handle unisex sizing.

## The new flow

```
Size                                    [Unisex Fit · Men & Women]

How do you usually size?
┌────────────┬───────────┬──────┬──────┐
│ Women's US │  Men's US │  UK  │  EU  │   ← segmented selector
└────────────┴───────────┴──────┴──────┘
   (auto-selected based on geo: US → Women's US, GB → UK, etc.)

┌─────┬─────┬─────┬─────┐
│  6  │  7  │  8  │  9  │   ← ONE big number per tile
├─────┼─────┼─────┼─────┤      clean, scannable, premium
│ 10  │ 11  │ 12  │ 13  │
└─────┴─────┴─────┴─────┘

✓ Women's US 8  =  Men's US 6.5 · UK 6 · EU 38.5
```

One decision up front → uncluttered tiles → confirmation strip still shows the cross-mapping for confidence.

## 1. `src/components/order/SizeTileGrid.tsx` — full rewrite

### Region picker (segmented control on top)
- Four options: **Women's US · Men's US · UK · EU**
- Compact segmented control: rounded pill container, active segment gets the forest-blue fill + white text, inactive segments are muted.
- Default selection driven by geo:
  - `US`/`CA`/fallback → **Women's US** (most common shopper here is female)
  - `GB` → **UK**
  - EU codes → **EU**
  - `AU`/`NZ` → keep AU mapping but display under "Women's US" label as fallback (AU is too small a slice to warrant a 5th segment; the confirmation strip covers it)
- Persist the user's manual choice in `localStorage` (`vitalwalk_size_system`) so a returning shopper or a man on a US IP who switches to "Men's US" doesn't have to reselect.
- Tiny helper line under the picker, only shown until first selection: `"Pick how you usually shop — we'll show those numbers."`

### Single-number tiles
- One number per tile, centered. `text-[22px] sm:text-[24px]`, extrabold, tabular-nums, tight tracking.
- Aspect ratio back to `aspect-[1/1]` (square) — clean grid rhythm.
- Grid: `grid-cols-4 sm:grid-cols-5`, `gap-2 sm:gap-2.5`.
- Selected: forest-blue border (`--order-blue`), soft fill, number turns blue, corner check badge (existing pattern).
- Out-of-stock: diagonal strikethrough + opacity 55% (existing pattern).
- Hover: subtle border darken + `active:scale-[0.97]`.
- No labels inside tiles — the segmented control above is the single source of truth for "what system am I looking at."

### Confirmation strip (kept, slightly refined)
- After selection, show all four mappings so every shopper feels confident:
  `✓ Women's US 8  =  Men's US 6.5 · UK 6 · EU 38.5`
- Same forest-blue soft chip styling, same animate-fade-in.

### Accessibility
- Segmented control: `role="radiogroup"` with arrow-key nav between segments.
- Tile grid: existing `role="radiogroup"` + arrow-key nav preserved.
- `aria-label` on each tile reads the **full mapping** (e.g., "Women's US 8, also Men's 6.5, UK 6, EU 38.5") so screen-reader users get the cross-info even though only one number is visible.

## 2. `src/components/order/ColorSizeStep.tsx` — minor tidy

- Keep the **"Unisex Fit · Men & Women"** pill on the right of the "Size" header — that's the *fit* signal (one shoe fits everyone), separate from the *numbering* signal (which the picker handles).
- No other changes here.

## 3. `src/lib/geo.ts` — add a "size system" type

Add a small helper:
```ts
export type SizeSystem = "usW" | "usM" | "uk" | "eu";
export function defaultSizeSystem(region: Region): SizeSystem {
  if (region === "UK") return "uk";
  if (region === "EU") return "eu";
  return "usW"; // US/AU/fallback default to Women's US
}
```
Used by `SizeTileGrid` to seed the segmented control.

## Why this is cleaner

| Before | After |
|---|---|
| 2 labels + 2 numbers per tile (4 elements) | 1 number per tile (1 element) |
| Same visual weight on W and M forces eye to pick | Picker decision happens once, up front |
| Cramped at 390px | Breathing room, premium feel |
| UK/EU users saw a redundant single-number variant — inconsistent | Every region gets the same clean grid |

Men explicitly select "Men's US" → tiles show 6, 7, 8, 9, 10… in their own system. Zero conversion math. The confirmation strip reassures them they picked the right shoe.

## Files changed
- `src/components/order/SizeTileGrid.tsx` — replace dual-label layout with region picker + single-number tiles
- `src/components/order/ColorSizeStep.tsx` — no functional change (pill stays, helper text already removed)
- `src/lib/geo.ts` — add `SizeSystem` type + `defaultSizeSystem()` helper
