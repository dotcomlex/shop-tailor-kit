## Plan

I’ll restore the compare-price logic so the funnel uses the correct retail baseline again, then I’ll re-audit every pricing surface that depends on it.

### What I’ll change

1. Fix the 1-pair compare price source
- Update the quantity-step pricing logic so the 1-pair card uses the product’s real compare-at price from Shopify, not the live sale price as the strike-through baseline.
- This should restore the missing/incorrect struck-through value above the $69.95 option.

2. Fix bundle compare prices for 2-pair and 3-pair
- Change bundle compare calculations to derive from the 1-pair retail compare-at amount, multiplied by quantity.
- Keep the live bundle total based on the real Shopify bundle prices already used for checkout.
- This should replace the current too-low compare values like $139.90 with the higher retail values you had before.

3. Align all downstream pricing surfaces
- Update any shared order-summary/sticky-checkout calculations that currently use the wrong baseline so Step 1, Step 3, savings, and the sticky bar all agree.
- Make sure savings percentages are computed from the corrected compare totals.

4. Re-verify currency/localization behavior
- Keep localized sale prices coming from Shopify’s country-aware responses.
- Verify the compare-price logic uses the matching localized compare-at value when it exists.
- Preserve the existing fallback behavior for bundle products when a market-localized bundle is unavailable, while avoiding mismatched compare calculations.

5. Final QA pass
- Recheck:
  - 1-pair, 2-pair, 3-pair cards
  - compare price visibility
  - savings amounts/percentages
  - Step 3 order summary
  - sticky checkout bar
  - pre-checkout price sync behavior
- If I find any remaining drift between display and checkout, I’ll correct that too.

## Technical details

Files I expect to update:
- `src/components/order/QuantityStep.tsx`
- `src/components/order/OrderPage.tsx`
- possibly `src/hooks/useVitalWalkProduct.ts` if a shared retail baseline helper is cleaner

Core logic change:
- Current broken behavior:
  - bundle compare = 1-pair sale price × quantity
- Correct behavior:
  - 1-pair compare = 1-pair compare-at price
  - 2/3-pair compare = 1-pair compare-at price × quantity
  - bundle total remains the actual localized Shopify selling price

Expected outcome:
- 1 Pair shows the correct compare price above `$69.95`
- 2 Pair and 3 Pair show restored higher compare prices
- savings and totals remain consistent with checkout and country/currency handling