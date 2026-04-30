# Make displayed prices byte-identical to Shopify checkout

## The actual bug (confirmed against live Shopify)

I just queried Shopify for UK (`GB`) prices. Here's the truth vs. what the page shows:

| Bundle | Shopify charges | Page shows `/ea` | Customer's mental math | Drift |
|---|---|---|---|---|
| 1 pair | **£44.80** | £44.80 | £44.80 | ✓ |
| 2 pairs | **£74.67** | £37.34/ea | £37.34 × 2 = £74.68 | **+1p** |
| 3 pairs | **£89.60** | £29.87/ea | £29.87 × 3 = £89.61 | **+1p** |

### Root cause

In `QuantityStep.tsx` we read the bundle total from Shopify (correct), then **divide by qty** to get a per-pair price, then `Intl.NumberFormat` rounds that to 2 decimals. £74.67 ÷ 2 = £37.335 → rounds to £37.34. The customer multiplies back and sees a different number than what Shopify charges. The "£45.13 vs £45.16" report is the same pattern in a different Market.

A second contributing factor: when a Shopify Market repriced between the customer's first visit and checkout (Shopify Markets can adjust FX rates intra-day), the page never re-fetches, so the cached price flashes stale.

## The fix

### 1. Stop dividing — show the total, not the per-pair (`src/components/order/QuantityStep.tsx`)

Each card will display **the exact Shopify total for that bundle** as the headline price, with `/ea` shown as a smaller secondary label that's also computed from Shopify (not from division — see step 2). This way the headline number = the checkout number, period.

Layout per card (right-side price column):

```text
£149.34   ← compareAtPriceRange.minVariantPrice (struck)
£74.67    ← priceRange.minVariantPrice (BIG, exact)
2× £37.34 ← derived for context only, prefixed so customer
            never expects "× 2 = total"
```

The `2×` prefix makes it obvious the per-pair is informational. No more "37.34 × 2 ≠ 74.67" confusion.

### 2. Add a tiny "exact total" line wherever per-pair appears

Same treatment in any place we currently divide. Audit confirms only `QuantityStep.tsx` divides — `OrderPage.tsx`, `StickyCheckoutBar.tsx`, `OrderSummary.tsx`, `SavingsHero.tsx` already use the live bundle total directly.

### 3. Re-fetch prices right before checkout (`src/components/order/OrderPage.tsx`)

Before calling `createCheckoutForLines`, invalidate the `vitalwalk-bundles` query and `await` a fresh fetch in the user's country. If the new total differs from what's currently displayed by more than 0p, show a one-tap toast: *"Price updated to £X.XX — tap Checkout again to continue."* This guarantees the number on the button is the number on Shopify's checkout page, even if Shopify Markets revalued in the meantime.

### 4. Re-fetch when the tab regains focus

Add a `visibilitychange` listener that invalidates `vitalwalk-bundles` when the user returns to the tab after >2 minutes. Catches the case where someone leaves the tab open overnight and Shopify FX has moved.

### 5. Re-fetch when geo changes (already done) — verify

`useGeo.ts` already invalidates `["vitalwalk-bundles"]` on `GEO_CHANGE_EVENT`. ✓ No change needed; just confirming during implementation.

### 6. Pass the same country to checkout (already done) — verify

`OrderPage.handleCheckout` already passes `country?.code ?? "US"` to `createCheckoutForLines`, which sets `buyerIdentity.countryCode` so Shopify's checkout opens in the matching Market and currency. ✓ No change needed.

### 7. Verification harness (dev-only script)

Add `scripts/verify-price-parity.ts` that, for every Market we have enabled (US, GB, CA, AU, DE, FR, IT, ES, NL, IE, NZ, JP, SG, AE, SE, NO, DK, CH, MX, BR — pulled from existing `geo.ts`), does:

1. Fetches the 3 bundle products via the same `@inContext` query the page uses.
2. Calls `cartCreate` with each bundle's first variant + `buyerIdentity.countryCode`.
3. Reads `cart.cost.totalAmount` from the response.
4. Asserts `priceRange.minVariantPrice.amount === cart.cost.totalAmount` to the cent.
5. Prints a green check or a red diff for every (country, qty).

Run it once after the fix lands; commit the output to `.lovable/price-parity-report.txt` so it's auditable.

## What this fixes

- **45.13 vs 45.16** and the **74.67 vs 74.68** family of bugs disappear because nothing on the page is derived by division+rounding anymore — the headline price *is* the Shopify total.
- **Stale-FX flashes** disappear because we re-fetch on tab focus and again right before checkout.
- **Market mismatches** disappear because checkout already opens in the same `countryCode` we used for the displayed price.

## Files touched

- `src/components/order/QuantityStep.tsx` — restructure price column; remove division-as-headline.
- `src/components/order/OrderPage.tsx` — pre-checkout re-fetch + drift toast.
- `src/hooks/useVitalWalkProduct.ts` — add `staleTime: 0` for the visibility-triggered refetch path; keep 5-min cache for normal browsing.
- `src/App.tsx` (or a new `useBundlePriceSync` hook) — `visibilitychange` listener.
- `scripts/verify-price-parity.ts` — new, dev-only verification script.
- `.lovable/plan.md` — replaced with this plan for posterity.

## Out of scope

- Norway/Mexico/Brazil falling back to USD when those Markets aren't enabled in Shopify Admin → Settings → Markets (separate, already-known issue).
- Adding new Markets — that's a Shopify Admin task, not code.
