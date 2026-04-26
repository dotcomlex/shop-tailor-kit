## Goal
Push the bundle savings ladder to be more aggressive and incentivize multi-pair purchases, while keeping the math internally consistent (per-pair × qty = total, and total vs compare-at = displayed savings %).

## New pricing ladder

Anchor MSRP: **$233.17/pair** (unchanged — drives the "Save 70%+" anchor)

| Qty | Per-pair | Total | Compare-at | Save % |
|-----|----------|-------|------------|--------|
| 1   | $69.95   | $69.95   | $233.17 | **70%** |
| 2   | $58.29   | $116.58  | $466.33 | **75%** |
| 3   | $46.63   | $139.90  | $699.50 | **80%** |

Math check:
- 1 pair: 1 − (69.95 / 233.17) = 70.0% ✓
- 2 pairs: 1 − (116.58 / 466.33) = 75.0% ✓
- 3 pairs: 1 − (139.90 / 699.50) = 80.0% ✓

The per-pair drops feel meaningful (≈$11 cheaper at 2-pack, another ≈$12 at 3-pack) without breaking the .X9 / .9X price ending convention.

## File to edit

**`src/components/order/QuantityStep.tsx`** — update the `OPTIONS` array (lines 19–46):

- 2-pair option: `perPair: 58.29`, `total: 116.58`, `savePct: 75` (keep "MOST POPULAR" ribbon)
- 3-pair option: `perPair: 46.63`, `total: 139.90`, `savePct: 80` (keep "BEST DEAL" ribbon)
- 1-pair stays unchanged

`compare` values stay the same (233.17 × qty) since the MSRP anchor is unchanged.

## Notes / no-changes-needed

- `OrderSummary.tsx` already reads `total` from the selected bundle option, so it'll pick up the new prices automatically.
- `StickyCheckoutBar.tsx` reads from the same source — also automatic.
- Shopify variant pricing on the actual checkout: the live price from Shopify is for 1 pair ($69.95). The displayed bundle "totals" on this order page are marketing prices. **Open question:** does the user want the Shopify cart to actually charge $116.58 for 2 pairs and $139.90 for 3 pairs? Currently checkout multiplies the single-pair Shopify price ($69.95) by quantity, so 2 pairs would charge $139.90 and 3 pairs would charge $209.85 — a mismatch with what the order page advertises. If a true bundle discount is required, we'd need to either (a) create separate Shopify variants/products for the 2-pack and 3-pack at the bundled price, or (b) apply an automatic Shopify discount code at cart creation. Flagging for follow-up — this change only touches the order-page display.

No new dependencies, no schema changes, single-file edit.