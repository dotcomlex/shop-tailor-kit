## Goal
Add half-size variants to the **VitalWalk Orthopedic Massage Insoles** product in Shopify so the upsell modal can match the shopper's exact shoe size (e.g. US M 10.5) instead of rounding down to the nearest whole size.

## Why
Today the insole product only carries whole sizes. The matcher in `pickInsoleVariantForSize` (src/lib/shopify.ts) falls back to nearest-neighbor and rounds DOWN on ties, so a shopper selecting **US M 10.5** sees a **US M 10** insole in the modal. Adding the half sizes makes the displayed size match the selection 1:1.

## Steps

1. **Inspect current insole variants** — pull the `insoles` product from Shopify to confirm the existing size labels and the exact label format (e.g. `US W 10 / US M 9 / UK 8 / EU 41`). This becomes the template for the new half-size labels.

2. **Cross-reference shoe size chart** — check `src/data/sizeChart.ts` and the shoe product's size option values to get the canonical set of half-size labels we need to mirror (every half size that exists on the shoe product but not on the insole).

3. **Create the missing half-size variants in Shopify** via `shopify--create_product_variant`, one per missing size, using:
   - Same price as the existing whole-size variants ($7.95)
   - Same compare-at price ($19.99)
   - Same inventory policy / fulfillment as existing variants
   - Size label following the exact format of the existing variants (just with the .5 sizes filled in)

4. **Verify the matcher picks them correctly** — no code change should be required, because `pickInsoleVariantForSize` already does exact-token matching first (US W / US M / UK). Once the .5 variants exist, exact match wins and rounding is no longer triggered. I'll spot-check by re-reading the matcher logic against the new variant labels.

5. **Quick smoke test** — confirm in the live preview that selecting US M 10.5 on the shoe step now shows a 10.5 insole in the upsell modal at $7.95.

## Technical notes
- No frontend code changes expected — the matcher is already half-size aware (it parses floats).
- No migration / no Lovable Cloud changes.
- Pricing/compare-at is managed entirely in Shopify; the modal reads it live via the Storefront API with `@inContext(country:)` so multi-currency stays intact.
- If any existing whole-size variant is set up with `inventory_management: "shopify"`, new variants will start at 0 stock — I'll flag this so you can bulk-set inventory in Shopify admin if needed.

## Open question
Before I create the variants I'll list the exact set of new sizes (e.g. "US M 7.5, 8.5, 9.5, 10.5, 11.5, 12.5") so you can confirm the range before I push them to your live store.