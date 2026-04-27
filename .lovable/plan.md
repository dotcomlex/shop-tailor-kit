## Goal
Make every "shipping" mention country-specific with the user's flag, and confirm all prices are currency-localized.

## Changes

### 1. `src/components/order/IncludedChecklist.tsx` — add flag, drop "worldwide"
Currently the geo fallback says "Fast & free worldwide shipping". Update so:
- When `country` is detected: `Fast & free shipping to {country.name} {country.flag}` (e.g. "Fast & free shipping to United Kingdom 🇬🇧").
- When detection fails: fall back to `Fast & free shipping to your door` (no "worldwide" wording, no flag).
- Render the flag as a separate inline span with `aria-hidden` so screen readers skip the emoji.

### 2. `src/components/order/SavingsHero.tsx` — keep, already correct
Already shows: `FREE & fast shipping to {country.name} {country.flag}`. Tighten the fallback line the same way (`FREE & fast shipping to your door` instead of "FREE worldwide shipping included") for consistency.

### 3. Currency conversion — verified, no changes needed
Audit confirms every price on the page already runs through `useCurrency().format(usdAmount)`, which multiplies by the Shopify-derived FX `rate` and formats via `Intl.NumberFormat` with the live `currencyCode`:
- `QuantityStep` bundle prices (`format(opt.compare)`, `format(opt.perPair)`)
- `SavingsHero` savings + retail (`format(saved)`, `format(comparePrice)`)
- `OrderSummary` subtotal, compare, savings, total
- `StickyCheckoutBar` total + compare price

No hard-coded `$` strings remain on the order flow, so a UK visitor sees £, an EU visitor sees €, etc., automatically.

## Out of scope
No layout, spacing, or component-structure changes. Only the shipping-line copy in two files is touched.