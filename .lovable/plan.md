## Goal

Match the classic Funnelish pattern: stop relying on Shopify discount codes for bundles. Instead, create **three separate Shopify products** — one per bundle size — each with the bundle price already baked into the variant price. Checkout then shows the real, attractive bundle price instead of "Subtotal $199.85, Discount -$80" which makes the saving look small.

## New Shopify product structure

Create two new products in Shopify (the existing 1-pair product stays as-is):

| Product | Title | Variant pricing | Variants | Compare-at |
|---|---|---|---|---|
| Existing | The Original VitalWalk® Shoes | $59.95 | 80 (color × size) | $199.83 |
| **New** | VitalWalk® Shoes — 2-Pair Bundle | **$99.92** (whole bundle) | 80 (color × size, representing Pair 1; Pair 2 selection passed as line-item property) | $399.67 |
| **New** | VitalWalk® Shoes — 3-Pair Bundle | **$119.90** (whole bundle) | 80 | $599.50 |

Each bundle product = one line item at checkout = the customer sees a single clean price like "VitalWalk 2-Pair Bundle — $99.92" with the full $399.67 strike-through. No more "$80 off" line.

### How multi-pair color/size selection is preserved

The bundle product's variants represent **Pair 1's color + size**. For Pair 2 (and Pair 3), the selections are attached to the cart line as `attributes` (line-item properties). These show up to the user, on the order in Shopify admin, and on the packing slip — the warehouse sees exactly what to pick.

Example for the 2-pack:
- Variant chosen: `Black / US M9` (Pair 1)
- Line attributes: `Pair 2 Color: White`, `Pair 2 Size: US M10`

This is the same pattern Funnelish/ClickFunnels uses and is fully supported by Shopify's `cartCreate` mutation via `attributes`.

## Funnel code changes

1. **`src/lib/shopify.ts`**
   - Add two new product handles: `vitalwalk-2-pair-bundle`, `vitalwalk-3-pair-bundle`.
   - Add `fetchVitalWalkBundleProducts(country)` that fetches all three products in one GraphQL call (so we can pull localized prices for each).
   - Update `createCheckoutForLines` to accept `attributes` on each line, and **drop the `discountCodes` parameter usage** for bundles (the bundle product is already discounted).

2. **`src/hooks/useVitalWalkProduct.ts`**
   - Return all three products keyed by qty: `{ 1: product, 2: product, 3: product }`.
   - The 1-pair product remains the source for color/size options (identical option list across all three).

3. **`src/components/order/OrderPage.tsx`**
   - On checkout, pick the product matching the chosen `quantity`.
   - Resolve **only Pair 1's** color+size to a variant on that bundle product.
   - Pass Pair 2 / Pair 3 selections as `attributes` on that single line.
   - Cart line is always `quantity: 1` (the bundle itself is the unit).
   - Remove the `VITALWALK-2PACK` / `VITALWALK-3PACK` discount-code branch.

4. **`src/components/order/QuantityStep.tsx`** — no math changes; the displayed prices already match the new bundle product prices ($59.95 / $99.92 / $119.90).

5. **`src/components/order/ColorSizeStep.tsx`** — no changes; still shows N pair pickers.

## Shopify changes (executed via tools after approval)

1. **Create** `VitalWalk® Shoes — 2-Pair Bundle`
   - Same 80 color × size variant grid as the original
   - All variants priced at **$99.92**, compare-at **$399.67**
   - Same product description, images, vendor, tags as original
   - Inventory: untracked (or duplicate the original's inventory policy — confirm preference)

2. **Create** `VitalWalk® Shoes — 3-Pair Bundle`
   - Same 80-variant grid
   - All variants priced at **$119.90**, compare-at **$599.50**

3. **Delete** the now-unused `VITALWALK-2PACK` and `VITALWALK-3PACK` price rules (so they can't be misapplied later).

4. Shopify Markets will auto-localize the bundle prices into GBP / AUD / CAD / EUR using the same FX rates as the 1-pair product, so the UI stays in sync everywhere.

## Verification after implementation

- Add to cart at 2× and 3× → confirm checkout shows a single line `VitalWalk 2-Pair Bundle — $99.92` (or localized) with `$399.67` strike-through, **no discount line**.
- Confirm Pair 2 / Pair 3 color+size appear under the line item in checkout and in the Shopify order detail.
- Spot-check GBP and EUR markets show correctly converted bundle totals.

## Open questions before I build

1. **Inventory tracking on the bundle products** — track separately, or leave untracked and rely on the 1-pair product as the inventory source of truth? (Funnelish stores typically leave bundles untracked to avoid double-decrement issues.)
2. **Product visibility** — should the two new bundle products be **hidden from the online storefront / search** (only purchasable via the funnel), or visible everywhere? Hidden is the standard funnel setup.
