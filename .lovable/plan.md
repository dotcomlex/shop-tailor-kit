## Goal

Polish the upsell modal footer and answer the user's QA questions in one pass. No other features change.

## Visual changes (`src/components/order/InsoleUpsellModal.tsx`)

1. **Move "You save $X on insoles" above the CTA**
   - Render the savings line directly above the yellow CTA, styled as a small uppercase green badge-style line so it reads as an emphasis cue, not body copy.
   - Remove it from below the CTA.

2. **Trust line copy fix**
   - Change `Same shipping · 60-day money-back guarantee` → `Free shipping · 60-day money-back guarantee`.
   - Keep the muted, subtle styling (no other restyling).

3. **Decline link gets a right arrow**
   - Add a small `ArrowRight` icon (lucide) after `No thanks, continue without insoles`, same muted color, h-3.
   - Switch the button to `flex items-center justify-center gap-1` so the icon sits inline with the text.
   - Import `ArrowRight` alongside the existing lucide imports.

## QA verification (no code changes — confirming current behavior)

- **X button → checkout?** ✅ Already correct. The X button in the red banner calls `handleDecline`, which calls `onDecline` → `OrderPage.handleUpsellDecline` → `handleCheckout()` with no insole lines. So X = same outcome as "No thanks": customer continues to Shopify checkout with just their shoes. (Same as clicking the link, dismissing via Esc, or clicking the overlay.)

- **Currency converter on the page** ✅ Working. `useGeo` detects the visitor's country (cached + edge function `geo`), and every Shopify query (`fetchVitalWalkBundles`, `fetchVitalWalkProduct`, `fetchInsoleProduct`) is wrapped with `@inContext(country: $country)`. Shopify returns prices already converted to the local currency using the same FX as checkout.

- **Currency at Shopify checkout** ✅ Working. `createCheckoutForLines` sets `buyerIdentity.countryCode` on the cart, so checkout opens in the matching Shopify Market and currency for both the shoes line and the insole upsell line.

- **Insole upsell synced to Shopify** ✅ Working. The modal pulls every insole variant straight from `fetchInsoleProduct`, so price, compare-at, availability, and titles all reflect Shopify in real time. After the recent variant updates, all 12 sizes are now $14.95 / $29.95 compare-at. There's also a pre-checkout price-sync guard that re-fetches bundle prices and aborts with a "Price updated" toast if the cached UI total no longer matches Shopify.

- **Insoles show correctly in Shopify checkout** ✅ Working. Each insole row is sent as its own Shopify cart line with attributes (`Add-on`, `Insole Pairs`, `Pair Match: Pair 1, Pair 2…`), so checkout, the order in Shopify Admin, and the packing slip all show which shoe pair each insole maps to.

- **Auto-match to shoe size** ✅ Working. Per-pair: `OrderPage` passes `shoeSelections` to the modal, which calls `pickInsoleVariantForSize` for each pair using a 3-step strategy (exact US W/M/UK token match → round up to next whole insole size → fall back to largest available). The customer can also tap "Change" to manually override any row.

## Files to change

- `src/components/order/InsoleUpsellModal.tsx` only.
