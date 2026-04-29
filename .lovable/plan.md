# Lower price to $59.95 (70% off) — full funnel + Shopify resync

Single source-of-truth change: 1-pair USD price becomes **$59.95**, with **70% off** vs. a compare-at of **$199.83**. Bundle math is rebuilt around the same 70/75/80% savings ladder so every currency stays consistent (Shopify Markets handles FX, our funnel just multiplies USD × Shopify's localized rate).

## New price ladder (USD source of truth)

| Pack | Per pair | Total | Compare-at | Save |
|---|---|---|---|---|
| 1× | $59.95 | $59.95 | **$199.83** | 70% |
| 2× | $49.96 | $99.92 | $399.67 | 75% |
| 3× | $39.97 | $119.90 | $599.50 | 80% |

Math: 1× compare = 59.95 / 0.30. 2× per-pair = base × 0.8333… (75% off retail = same 16.67% bundle discount as today). 3× per-pair = base × 0.6667 (80% off retail = same 33.33% bundle discount). **Bundle discount percentages do not change**, so the existing `VITALWALK-2PACK` (16.67%) and `VITALWALK-3PACK` (33.33%) Shopify price rules continue to work unchanged in every currency.

## Changes in the funnel codebase

1. `src/components/order/QuantityStep.tsx` — replace `OPTIONS` numbers with the table above.
2. `src/hooks/useCurrency.ts` — `USD_BASE = 59.95` (so the FX rate is derived from Shopify's localized $59.95 equivalent).
3. `src/hooks/useVitalWalkProduct.ts` — update `STATIC_FALLBACK` to `price: "59.95"`, `compareAtPrice: "199.83"` (only used pre-API-response; not user-visible in normal flow).

No other files reference these constants. `OrderSummary`, `UpgradeStep`, `StickyCheckoutBar`, `SavingsHero` all derive from props, so they update automatically.

## Changes in Shopify

For the live product `the-original-vitalwalk®-shoes-copy`, for **every variant**:
- `price` → `59.95` (USD)
- `compare_at_price` → `199.83` (USD)

Shopify Markets will auto-convert both to GBP, AUD, CAD, EUR, etc. using the same FX rate the funnel reads via `@inContext`, so the 70% strike-through stays accurate in every currency.

**Bundle discount price rules: no change.** `VITALWALK-2PACK` (-16.67%) and `VITALWALK-3PACK` (-33.33%) remain percentage-based, so they scale cleanly to the new base in all currencies.

## Verification after implementation

- Pull the product via Storefront API for US / GB / AU / CA / DE and confirm localized prices match the funnel's displayed values within 1¢.
- Confirm 2-pack and 3-pack price rules still read as percentage type with the same values.
- Spot-check checkout total in at least one non-USD market matches the funnel's displayed bundle total.

## Out of scope

- No copy/wording changes outside the price chips ("Save 70/75/80%" labels are already present and remain correct).
- No changes to color/size variants, FB pixel, or geo logic.
