# Restore per-pair as the headline price on Step 1

## What went wrong

In the last pass I changed `QuantityStep.tsx` to show the **bundle total** as the big headline price (e.g. "£74.67" for 2 pairs), with per-pair as a small secondary line. That broke the funnel psychology — the whole point of Step 1 is to anchor on the low **per-pair** number ("£37.34/ea") so the upgrade from 1→2→3 pairs feels like a no-brainer. The total belongs on Step 3 (Order Summary), not Step 1.

## What to change

### `src/components/order/QuantityStep.tsx` — flip the price column back

Restore the original layout per card:

```text
£74.69    ← compareAtPriceRange per-pair (struck)
£37.34    ← per-pair price (BIG headline)
/pair     ← small label underneath
```

Per-pair = `priceRange.minVariantPrice.amount / qty`, formatted via `useCurrency().format()` — same as before the recent change. Compare-at also divided by qty so the strike-through reads as a per-pair "was" price.

No bundle total shown on Step 1. The customer sees the total for the first time on Step 3 (`OrderSummary`), which already pulls the exact Shopify total — unchanged.

## What stays (do NOT touch)

These are the sync/parity fixes from the last pass — they all live **outside** the visual price column and must remain:

1. **`OrderPage.tsx` — pre-checkout re-fetch + drift toast.** Still re-fetches `vitalwalk-bundles` right before `createCheckoutForLines` and shows the "Price updated — tap Checkout again" toast if Shopify's number moved.
2. **`OrderPage.tsx` — `visibilitychange` listener.** Still invalidates the bundles query when the tab regains focus.
3. **`useVitalWalkProduct.ts` — staleTime/refetch behavior.** Unchanged from the last pass.
4. **`OrderSummary.tsx` / `StickyCheckoutBar.tsx` / `SavingsHero.tsx`.** Already use the live Shopify bundle total directly — no changes.
5. **Geo + `buyerIdentity.countryCode` handoff to Shopify checkout.** Unchanged.
6. **Parity verification report** at `.lovable/price-parity-report.txt` — kept as-is.

## Why the "37.34 × 2 ≠ 74.67" optical issue is fine here

The customer never sees both numbers side-by-side on Step 1 (no total displayed). They see the per-pair anchor on Step 1, then the **exact Shopify total** on Step 3 / sticky bar / checkout button — all of which already pull the authoritative Shopify number. So the 1p rounding artifact is invisible to the customer in the actual flow.

## Files touched

- `src/components/order/QuantityStep.tsx` — revert price column to per-pair-as-headline.
- `.lovable/plan.md` — replace with this plan.

## Out of scope

- Any change to OrderSummary, StickyCheckoutBar, OrderPage sync logic, geo, or checkout handoff.
