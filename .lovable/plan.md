## Goal

Make every price on the order page match the Shopify checkout to the cent, in the customer's local currency, with no "≈ USD" disclaimer and no rate drift.

Today: we use `open.er-api.com` rates client-side. Shopify Markets uses its own rates at checkout, so the displayed price and the checkout price can differ slightly. We'll fix that by asking Shopify itself for the localized prices via the `@inContext(country:)` directive on the Storefront API.

## Approach

Use Shopify's Storefront API `@inContext(country: $country)` directive. When the query is run with a country code, Shopify returns `priceRange`, `compareAtPriceRange`, and each variant's `price` / `compareAtPrice` already converted into that market's currency (using Shopify's own FX rates — the same ones used at checkout).

We'll detect the customer's country (already done via `useGeo`), pass it to the product query, and render the localized amounts Shopify returns. The same country code is also passed to `cartCreate` via `buyerIdentity.countryCode` so the checkout opens in the matching market.

## Changes

### 1. `src/lib/shopify.ts`
- Add `@inContext(country: $country)` to `PRODUCT_BY_HANDLE_QUERY`, with `$country: CountryCode!`.
- Update `fetchVitalWalkProduct(country: string)` to take a country code and pass it as a variable. Default to `"US"` when none is detected.
- Add `buyerIdentity: { countryCode }` to the `CART_CREATE_MUTATION` input and to `createCheckoutForLines(lines, discountCodes, country)`.
- Keep `formatMoney` but make it currency-aware (use `Intl.NumberFormat` with the `currencyCode` Shopify returns).

### 2. `src/hooks/useVitalWalkProduct.ts`
- Take the detected country from `useGeo()` and include it in the React Query key, e.g. `["vitalwalk-product", country]`.
- Pass it through to `fetchVitalWalkProduct`.
- Update `useDisplayPrice` to format using the Shopify-returned `currencyCode` (no manual FX math).

### 3. New helper: `src/lib/money.ts` (small)
- Export `formatMoney(amount: number | string, currencyCode: string)` using `Intl.NumberFormat` — single source of truth used by all components.

### 4. Bundle pricing (the tricky part)
`QuantityStep` currently hard-codes USD bundle totals (`69.95`, `116.58`, `139.90`, etc.). To stay accurate per market we'll derive bundle totals from Shopify's localized single-pair price:

- Read `product.priceRange.minVariantPrice` (now localized) and `compareAtPriceRange.minVariantPrice` from the query.
- Compute each bundle's localized totals using the same per-pair multipliers we already use today, but applied to the localized base price:
  - 1 pair: `1 × price`, compare `1 × compareAt`
  - 2 pair: `2 × price × (116.58 / (2 × 69.95))` → i.e. apply the same effective bundle discount ratio to the localized price
  - 3 pair: same idea with the 3-pack ratio
- Or, simpler and more accurate: keep the discount **percentages** (Save 0% / 17% off pair-of-2 / 33% off pair-of-3 vs single-pair price) constant, derived from the existing USD figures, and apply them to the localized per-pair price. That keeps the maths consistent across markets and matches what the Shopify discount codes (`VITALWALK-2PACK`, `VITALWALK-3PACK`) actually deduct at checkout — they're fixed-amount USD codes, but Shopify Markets converts them automatically.
- Pass the localized `BUNDLE_OPTIONS` down as data instead of being a module-level constant. We'll move `BUNDLE_OPTIONS` into a hook (`useBundleOptions`) that derives them from the live product query.

### 5. `OrderPage.tsx`
- Read bundle totals from the new `useBundleOptions()` hook instead of the static export.
- Pass `country` through to `createCheckoutForLines(...)`.

### 6. Cleanup
- `src/hooks/useCurrency.ts` and `src/lib/currency.ts` are no longer needed for pricing — delete them, plus the FX disclaimer in `OrderSummary`.
- Keep the country-flag + currency badge in `SiteHeader`, but source the currency code from the Shopify-returned `currencyCode` instead of the FX library.

## Verification (after the switch)
1. Load the page from a US IP → see USD prices that match the existing checkout.
2. Use a UK / AU / CA / EU VPN (or override `useGeo`) → see GBP / AUD / CAD / EUR.
3. Click **Complete Order** in each market → confirm the Shopify checkout opens in the same currency and the totals match the on-page totals.
4. Confirm the bundle discount codes (`VITALWALK-2PACK`, `VITALWALK-3PACK`) still bring the cart to the advertised localized total.

## Risks / notes
- The bundle discount codes are fixed-amount USD. Shopify Markets converts them to the buyer's currency at checkout. There may still be ±1 cent rounding on bundle totals between page and checkout — acceptable, and far better than the current setup.
- Countries Shopify Markets isn't configured to ship to will fall back to the shop's primary currency (USD). That's the correct behaviour.
- No new dependencies required.
