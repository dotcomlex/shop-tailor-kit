# Pricing audit + Step 2 image polish + Step 3 free-shipping line

## 1. Pricing flow — audit (no code changes expected)

Re-confirm the math you're seeing is what reaches Shopify. Current logic:

- **Step 1 (`QuantityStep`)** — Uses one inflated reference per-pair = `onePairSelling / (1 − 0.70)`. Strike = `reference × qty`. Save% = `round((1 − bundlePerPair / reference) × 100)`. So 1 pair always shows 70%, 2 pair and 3 pair show derived %.
- **Step 3 (`OrderPage.bundleCompare`)** — Same formula, so the strike-through total in the Order Summary matches Step 1 to the cent.
- **Checkout (`OrderPage.handleCheckout`)** — Cart lines use the **real Shopify variant prices** of the 2-pair / 3-pair bundle products (`bundleProduct`). The inflated "compare" number is display-only. Shopify charges exactly what's on the variant — strike-through never leaks into the order.

What the user is seeing right now (1 pair 70%, 2 pair ~75%, 3 pair ~77%) is the honest derived math, not a 15% / 23% bug. If you want bigger 2/3-pair Save% numbers to match the 1-pair anchor visually, that's a separate decision — flag in chat after plan approval and I can adjust the reference price.

**Action:** read-through audit only — confirm `QuantityStep.readLocalizedTotals` and `OrderPage.bundleCompare` reference prices match, and that `handleCheckout` does not pass any inflated value to Shopify. No edits.

## 2. Step 2 — bigger swatches + tap-to-zoom

**`ColorSwatch.tsx`**
- Bump base size: `h-[108px] w-[108px]` mobile, `h-[132px] w-[132px]` sm+.
- Keep the ring/check styling, just scale the inner image.
- Make the photo region act as the zoom trigger (the outer `<button>` still handles selection — a small icon overlay handles zoom).
- Add a small magnifier icon (top-right of the swatch) that opens a full-screen dialog with the high-res color image. Tapping the label/ring still selects the color.

**New `ColorZoomDialog.tsx`** (shadcn `Dialog`)
- Full-screen on mobile, centered max-w-2xl on desktop.
- Shows `imageForColor(color, 1200)` (request a larger size from the existing helper).
- Includes color name + a "Select this color" button that selects + closes.

**`ColorSizeStep.tsx`**
- Wire the new "Select this color" action through the existing `onUpdate(idx, { color })`.
- Tighten the grid to `grid-cols-3` on mobile so the bigger circles breathe (4 cols on sm+).

## 3. Step 3 — always-on free shipping line

**`OrderSummary.tsx`**
- Remove the `qty > 1` gate. Always render the "Shipping — FREE" row.
- Keeps the green `FREE` styling. No other layout changes.

## 4. Files touched

```text
src/components/order/ColorSwatch.tsx        (resize + zoom trigger)
src/components/order/ColorZoomDialog.tsx    (new)
src/components/order/ColorSizeStep.tsx      (grid cols + zoom wiring)
src/components/order/OrderSummary.tsx       (always show free shipping)
```

No changes to `OrderPage.tsx`, `QuantityStep.tsx`, Shopify cart, or checkout logic.
