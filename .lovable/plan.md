## Two bugs to fix

### Bug 1 — Wrong size pre-selected in the upsell

**Root cause** (verified against live Shopify data):

- Shoes are sold in **half sizes** (e.g. `US W 11 / US M 10 / UK 9` AND `US W 11.5 / US M 10.5 / UK 9.5`).
- Insoles are sold in **whole sizes only** (UK 4, 5, 6, 7, 8, 9, 10, 11, 12, 13).
- Current matcher in `src/lib/shopify.ts` → `pickInsoleVariantForSize` works in two steps:
  1. Exact match on US W / US M / UK token (OR'd) — works for whole-size shoes.
  2. **Fallback for half-sizes**: round **up** to the next whole insole size, ranking only by `US W` token.

For a shoe selection of `US W 11.5 / US M 10.5 / UK 9.5`:
- target US W = 11.5 → rounds up to insole `US W 12 / US M 11 / UK 10`.
- That's exactly what you saw: pre-selected UK 10 instead of UK 9.

It also fails another way: it ignores `US M` and `UK` tokens entirely in the fallback path, so a shopper who entered the size in UK or US-Men won't get the closest UK/US-M neighbor — the round-up is always biased to US-Women's grid.

**Fix** — replace step 2 with a true **nearest-neighbor** match across all three numbering systems, with a tie-break that prefers rounding **down** for half-sizes (industry-correct for trim-to-fit insoles: a UK 9.5 foot fits inside a UK 9 insole shell better than getting a too-large UK 10 that bunches at the toe; the user can trim if needed).

Algorithm (all in `pickInsoleVariantForSize`):

```text
For each insole variant:
  parse {w, m, uk}
  diff = min(
    |t.w  - target.w |  (if both finite),
    |t.m  - target.m |  (if both finite),
    |t.uk - target.uk|  (if both finite),
  )
Pick the variant with the smallest diff.
Tie-break (when two candidates are equally close, e.g. UK 9.5 → UK 9 vs UK 10
  are both 0.5 away): prefer the SMALLER variant (round down).
Filter to availableForSale first; if none available, fall back to all.
```

This guarantees:
- UK 9 shoe → UK 9 insole (exact).
- UK 9.5 shoe → UK 9 insole (nearest, ties go down).
- US W 11.5 shoe → UK 9 insole (still matches via US-M = 10.5 → 10 wins by 0.5 vs US-W = 11.5 → 12 by 0.5; tie → smaller).
- US M 10 shoe → US M 10 insole (exact via M token).

### Verification plan
After the fix, mentally walk through all shoe variants and assert the predicted insole match. Add a small dev-only console log inside `pickInsoleVariantForSize` (gated on `import.meta.env.DEV`) so any future mismatch is visible during QA.

---

### Bug 2 — Modal causes horizontal page shift on mobile

**Root cause** (from the screenshot you sent):
- Right column of the hero contains `$14.95 $29.95 / pair` on one line. With the larger 160×160 hero we just shipped, the right column is tighter, so `$14.95 $29.95` plus `/ pair` overflows the column. The price `<div>` uses `flex items-baseline gap-1.5` with no `flex-wrap` and no `min-w-0`, so children push out and force horizontal scroll on the whole modal/page.
- Title `Orthopedic Massage Insoles` is also fine wrapping but combined with the strikethrough price block, the column blows past its allotted width.

**Fix** in `src/components/order/InsoleUpsellModal.tsx`:

1. **Lock the modal against horizontal overflow** — add `overflow-x-hidden` to the `DialogPrimitive.Content` (alongside the existing `overflow-y-auto`) so nothing inside can ever push the page sideways.
2. **Make the price row wrap safely**:
   - Add `flex-wrap` to the price `<div>` so `/ pair` drops below if needed.
   - Add `min-w-0` to the right column wrapper.
3. **Tighten typography only on the narrowest hero**: drop the price from `text-[24px]` to `text-[22px]` on the smallest screens (still bold and dominant), and keep the strikethrough at `text-[12px]`. This prevents wrapping on 360-wide phones while staying punchy on 390+.
4. **Trim the title to one balanced line where possible**: keep `text-[16px]` but add `text-balance` so "Orthopedic Massage Insoles" wraps as `Orthopedic Massage / Insoles` rather than `Orthopedic / Massage Insoles` — looks cleaner alongside the hero.
5. **Constrain the page itself** as a belt-and-suspenders: add `overflow-x-hidden` to `<body>` via `index.css` so no future modal/component can ever introduce a horizontal scroll. (Vertical scrolling untouched.)

### Files touched
- `src/lib/shopify.ts` — rewrite step 2 of `pickInsoleVariantForSize` with nearest-neighbor + round-down tie-break, dev-only log.
- `src/components/order/InsoleUpsellModal.tsx` — `overflow-x-hidden`, `flex-wrap`, `min-w-0`, slightly smaller price on small viewports, `text-balance` on title.
- `src/index.css` — add `body { overflow-x: hidden; }`.

No Shopify cart, checkout, currency, or pricing logic changes.
