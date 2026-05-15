## Goal

Make Step 1 land harder — bigger jumps between tiers so the strikethrough compare prices and "Save X%" labels feel like a clear "wow, this is a deal."

## Change

In `src/components/order/QuantityStep.tsx`, update the discount ladder in two places (they must stay in sync — one drives the label, the other drives the strikethrough math):

**1. `OPTIONS` array (visible "Save X%" label):**
- 1 Pair: `70` → **70** (unchanged — protects ad/PDP consistency)
- 2 Pairs: `75` → **80**
- 3 Pairs: `80` → **85**

**2. `SAVE_PCT` map inside `readLocalizedTotals` (drives strikethrough compare price):**
- `{ 1: 0.70, 2: 0.75, 3: 0.80 }` → `{ 1: 0.70, 2: 0.80, 3: 0.85 }`

## What this affects visually

Real Shopify prices do **not** change — only the strikethrough "compare at" prices and the "Save X%" copy. Example with a $36.63/pair bundle price:

| Tier   | Per-pair price | Old strike (compare) | New strike (compare) |
|--------|----------------|----------------------|----------------------|
| 1 pair | unchanged      | ~$122 (70%)          | ~$122 (70%)          |
| 2 pair | unchanged      | ~$147 (75%)          | ~$184 (80%)          |
| 3 pair | unchanged      | ~$184 (80%)          | ~$245 (85%)          |

Bigger gap between tiers, more dramatic strikethrough on the "Best Deal" card, no change to what the customer actually pays or to Shopify.

## Out of scope

No changes to: real bundle pricing, Shopify variants, free-shipping pill, ribbons, Step 2/3, upsells, or checkout. Pure label/strike refresh.
