## The Bug

User in UK sees **£45.13** for the 1-pair card, but Shopify checkout shows **£45.16** — a 3p mismatch that erodes trust right at the buy moment.

### Root cause

Today, `useCurrency.format()` derives every displayed price from a USD constant:

```
display = usdAmount × (localizedBase / 59.95)
```

Where `localizedBase` is the **1-pair product's** `priceRange.minVariantPrice` from Shopify Markets.

This breaks because Shopify Markets applies **per-product, per-variant rounding rules** independently (e.g. "round to nearest 0.05", "psychological .99 endings", currency-specific rules). So:

- The **1-pair** product's localized base may round to £45.13
- The **2-pair bundle** product's variants may round to a slightly different per-pair figure
- The **3-pair bundle** product's variants again to another
- Multiplying a USD ratio across all three products compounds the rounding drift

At checkout, Shopify uses the **actual variant's** localized price — which is the authoritative number. Our derived number is only an approximation.

For the 1-pair case specifically, the displayed `format(59.95)` rounds the FX product down (e.g. `59.95 × 0.7528 = 45.1303 → £45.13`), while Shopify's variant has its own rounding rule producing £45.16.

## The Fix

Stop deriving prices from USD. **Read each price directly from the corresponding Shopify bundle product's localized response** — the same product/variant we send to checkout. This makes display = checkout by construction.

### Changes

**1. `src/components/order/QuantityStep.tsx`**
- Remove the hard-coded USD `total` / `compare` / `perPair` numbers from `OPTIONS`. Keep only `qty`, `name`, `savePct`, `ribbon`.
- Pull `bundles` from `useVitalWalkBundles()`.
- For each option, read the **actual** localized numbers from Shopify:
  - `total` = `bundles[qty].priceRange.minVariantPrice.amount`
  - `compare` = `bundles[qty].compareAtPriceRange.minVariantPrice.amount`
  - `perPair` = `total / qty`
- Format with `formatMoney(amount, currencyCode)` directly (no FX math).
- While `bundles` is loading, render skeleton placeholders for the price column.

**2. `src/components/order/OrderPage.tsx`**
- Replace the `BUNDLE_OPTIONS` lookup in `bundleTotal` / `bundleCompare` (currently a USD constant) with the live `bundles[quantity]` localized totals. These flow into `UpgradeStep` and `StickyCheckoutBar`, so checkout summary shows the **same number** the user will pay.
- Update the `fbTrack` calls to use the localized currency + value (already partly done; ensure `value` uses the live total, not `opt.total`).

**3. `src/hooks/useCurrency.ts`**
- Deprecate the `format(usdAmount)` derivation path (still used by a few cosmetic spots if any). Replace its callers with direct `formatMoney(amount, currency)` from product data.
- Keep `currency`, `countryFlag`, `loading`, `isConverted` for UI badges.
- Remove the `USD_BASE = 59.95` constant and the rate calculation entirely.

**4. Audit other callers of `format()`** and switch each to read from product data:
- `src/components/order/StickyCheckoutBar.tsx`
- `src/components/order/OrderSummary.tsx`
- `src/components/order/SavingsHero.tsx`
- `src/components/order/ProductPanel.tsx`
- `src/components/order/SizeTileGrid.tsx` (if it shows prices)
- Anywhere else `useCurrency().format` appears.

`useDisplayPrice()` in `useVitalWalkProduct.ts` already does the right thing (reads localized amount directly) — leave it alone, possibly extend for the bundle products.

**5. Verification step**
After implementation, run a script (in build mode) that:
- Fetches `cartCreate` for each of the 3 bundles in `?country=GB`, `?country=DE`, `?country=AU`, etc.
- Fetches the localized product prices via the same query the page uses
- Asserts that for every (country, qty) pair, `pageDisplayed === checkoutTotal` to the cent.

## Why this fixes 45.13 vs 45.16

After the change, the 1-pair card reads £45.16 directly from `bundles[1].priceRange.minVariantPrice.amount` — the exact same field Shopify uses to charge the customer. No multiplication, no division, no rounding drift, no "USD source of truth."

## Out of scope (separate issues already known)

- Norway / Mexico / Brazil falling back to USD — still requires you to enable those Markets in Shopify Admin → Settings → Markets.
- The price-flash skeleton behavior is preserved (we still wait for the localized response before showing prices).
