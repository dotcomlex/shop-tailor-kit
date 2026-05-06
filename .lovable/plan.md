# Code changes to wire up the new Pair-based bundles

## What's already done in Shopify ✅

- **Old 2-Pair Bundle deleted** (had 80 color/size variants).
- **New 2-Pair Bundle created** — handle `vitalwalk®-shoes-2-pair-bundle-75-off`, variants:
  - `Pair #1` — $58.29
  - `Pair #2` — $58.29
- **Old 3-Pair Bundle deleted** (had 80 color/size variants).
- **New 3-Pair Bundle created** — handle `vitalwalk®-shoes-3-pair-bundle-80-off`, variants:
  - `Pair #1` — $46.62
  - `Pair #2` — $46.62
  - `Pair #3` — $46.62
- 1-Pair product untouched (still drives color/size picker).

## What I need to change in code

### 1. `src/lib/shopify.ts` — point to the new bundle handles
Update `VITALWALK_PRODUCT_HANDLES`:
- `2: "vitalwalk®-shoes-2-pair-bundle-75-off"`
- `3: "vitalwalk®-shoes-3-pair-bundle-80-off"`

### 2. `src/lib/shopify.ts` — add a `findPairVariant` helper
Looks up `Pair #N` by index on a bundle product (since bundles no longer have color/size options).

### 3. `src/components/order/OrderPage.tsx` — rebuild cart lines
For a 2-pair or 3-pair order, send **one line per pair**:

```ts
Line 1: bundleProduct → "Pair #1" variant, qty 1
        attributes: Color = Black, Size = US W 9 / US M 8 / UK 7
Line 2: bundleProduct → "Pair #2" variant, qty 1
        attributes: Color = Sand,  Size = US W 8 / US M 7 / UK 6
[Line 3 if 3-pair]
```

For a 1-pair order: unchanged (still uses the 1-pair color/size variant directly).

### 4. Pricing math — bundle total = per-pair × quantity
Bundle products' `priceRange.minVariantPrice` is now per-pair, not the full bundle total. Change the total calc in:
- `OrderPage.tsx` `bundleTotal` — `perPair × quantity`
- `OrderPage.tsx` price-sync guard — same formula
- `QuantityStep.tsx` `readLocalizedTotals` — same formula

Compare-at: per your call, **no compare-at on the Pair variants** (no strikethrough at checkout). For the funnel-side strike-through (Step 1 cards, savings hero, order summary), use the 1-pair product's price × quantity as the "retail" reference (e.g., 2 × $69.95 = $139.90 vs bundle total $116.58).

### 5. Pixel events
Pair 1's variant ID now points at the new `Pair #1` variant — already handled by passing `pair1Variant.id` through. No code change needed beyond #3.

## Verification after deploy

1. Reload the funnel — Step 1 should show:
   - 1-Pair: $69.95
   - 2-Pair: $116.58 (split as $58.29 × 2)
   - 3-Pair: $139.86 (split as $46.62 × 3)
2. Place a test 2-pair order with **different** colors/sizes per pair → Shopify order shows two `Pair #` lines, each with the right Color + Size properties, total $116.58.
3. Same for 3-pair.
