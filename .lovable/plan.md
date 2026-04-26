# Cleaner Size Selection — Remove Helper Line & Refine Tile Design

The "order ~1.5 sizes down" line is redundant now that every tile shows both `W` and `M`. We'll remove it and refine the tile design so the dual-gender info reads instantly without feeling busy.

## 1. `src/components/order/ColorSizeStep.tsx`

**Remove the redundant helper sentence** below the size header:
- Delete the `<p>` containing `"Each tile shows Women's on top and Men's below. Men: order ~1.5 sizes down…"`.
- Keep the **"Unisex Fit · Men & Women"** pill — that alone is enough context.

The header row stays clean: title on the left, unisex pill on the right, tiles directly below.

## 2. `src/components/order/SizeTileGrid.tsx` — Cleaner tile design

The current tile is a 3-row sandwich (W label + number / divider / M label + number) which feels cramped at mobile sizes. Replace with a **single-line, side-by-side layout** that reads more like a clean spec card:

**New tile structure (per tile):**
```
┌──────────────────┐
│   W      M       │   ← tiny uppercase labels, muted
│   8     6.5      │   ← large numbers, equal weight, side-by-side
└──────────────────┘
```

Specifics:
- **Single horizontal split** (no divider line): two flex columns side-by-side, separated by generous whitespace instead of a hairline.
- **Labels** (`W`, `M`): `text-[10px]`, uppercase, tracking-wide, muted color. Sit directly above their number.
- **Numbers**: `text-[18px] sm:text-[19px]`, extrabold, tabular-nums, same color/weight for both genders (no hierarchy bias).
- **Aspect ratio**: change from `aspect-[1/1.05]` (tall) to `aspect-[1.35/1]` (slightly wide) — better fits the side-by-side layout and makes the grid feel less cramped on mobile.
- **Selected state**: keep the forest-blue border + soft fill + corner check badge. Numbers shift to `--order-blue` color.
- **Out-of-stock**: keep the diagonal strikethrough, opacity 55%.
- **Region adaptation**: when region is UK or EU (where numbering is unisex and identical for W/M), collapse to a **single centered number** with a small `UK` or `EU` label above it — no need for two identical numbers. AU and US keep the dual W/M layout.

**Confirmation strip below the grid**: keep as-is (already clear: `Women's 8 = Men's 6.5 · EU 38.5 · UK 6`).

## Result

- Cleaner visual rhythm — tiles read like a small bilingual spec card, not a stacked sandwich.
- One source of truth for unisex info: the pill + the dual-number tile + the confirmation strip. No prose helper needed.
- Region-smart: UK/EU shoppers see one number; US/AU shoppers see W/M.

## Files changed
- `src/components/order/ColorSizeStep.tsx` — remove helper paragraph
- `src/components/order/SizeTileGrid.tsx` — restructure tile layout, add region collapse logic
