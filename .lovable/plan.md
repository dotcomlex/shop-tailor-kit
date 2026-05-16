# Plan

## Changes

### 1. More engaging bundle names
- `1 Pair` → `Get 1 Pair`
- `2 Pairs` → `Get 2 Pairs`
- `3 Pairs` → `Get 3 Pairs`

(Applied in the Step 1 quantity cards. Step 3 order summary keeps its existing label format.)

### 2. Hybrid bundle savings logic
- **1 Pair:** keep the current promotional 70% off. Strike-through stays as today (`perPair / 0.30`) since the 1-pair product has no real compare-at-price set in Shopify and this preserves the "regular retail" framing customers already see.
- **2 Pairs / 3 Pairs:** switch to competitor-style math.
  - Strike-through (compare) = `1-pair perPair × qty` (what they'd pay buying singles).
  - Save % = `round((1 − bundlePerPair / onePairPerPair) × 100)` — computed from real prices, not hardcoded.

This makes the 2/3-pair offer feel more honest and grounded ("$59.97 ea vs $69.99 ea retail × 2 = $139.98") and matches the WideComfortShoes pattern the user referenced.

### 3. Keep downstream totals in sync
- `OrderPage.tsx` derives `bundleCompare` from a hardcoded `SAVE_PCT` map. Update it to the same hybrid logic so Step 3's order summary, savings line, and the sticky checkout bar all match Step 1 to the cent.
- Save % shown on Step 1 cards becomes dynamic for 2/3 pair (derived from live Shopify prices) instead of the static `80` / `85`.

## Will this look more engaging?
Yes — for two reasons:
1. "Get 2 Pairs" reads as an action/offer instead of a quantity label.
2. The strike-through becomes a believable number tied to the real single-pair price, so the savings feel real rather than marketing-inflated. The Save % may drop slightly on 2/3 pair vs today (e.g. ~57% instead of 80%), but it will be defensible and consistent with what competitors show.

## Files to edit
- `src/components/order/QuantityStep.tsx` — names, hybrid `readLocalizedTotals`, dynamic Save % per row.
- `src/components/order/OrderPage.tsx` — replace hardcoded `SAVE_PCT` in the `bundleCompare` memo with the same hybrid logic so Step 3 stays aligned.

No Shopify/checkout/business-logic changes beyond display math.