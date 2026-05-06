## Problem

Step 3 "You save" shows **73% OFF** for the 2-pair and **75% OFF** for the 3-pair, but Step 1 advertises **75% OFF** and **80% OFF**. The badge and the math don't agree.

## Cause

In `OrderPage.tsx`, `bundleCompare` is computed as `1-pair compare-at × pack size` ($199.83 × N). With the new bundle prices ($54.95/pair and $49.99/pair), that formula yields ~73% and ~75% — not the advertised 75%/80%.

`OrderSummary` then derives `savedPct = saved / compare`, so the displayed % is wrong.

## Fix

In `src/components/order/OrderPage.tsx`, derive `bundleCompare` from the advertised save percentage so the strike-through, the savings amount, and the badge always match:

```ts
const SAVE_PCT: Record<number, number> = { 1: 0.70, 2: 0.75, 3: 0.80 };
const pct = SAVE_PCT[quantity] ?? 0;
const compare = pct > 0 && total > 0 ? total / (1 - pct) : total;
```

Resulting Step 3 numbers (US):

| Qty | Total | Compare | Saved | % shown |
|---|---|---|---|---|
| 1 | $59.95 | $199.83 | $139.88 | 70% OFF |
| 2 | $109.90 | $439.60 | $329.70 | 75% OFF |
| 3 | $149.97 | $749.85 | $599.88 | 80% OFF |

This also keeps Step 1 cards consistent — I'll apply the same derivation to `QuantityStep.tsx` `readLocalizedTotals` so the strike on the bundle cards matches Step 3 to the cent.

## Files

- `src/components/order/OrderPage.tsx` — replace `bundleCompare` calc with SAVE_PCT-driven formula.
- `src/components/order/QuantityStep.tsx` — same change in `readLocalizedTotals` (use SAVE_PCT lookup instead of `onePairRetail × qty`).

No Shopify changes. No other components touched.