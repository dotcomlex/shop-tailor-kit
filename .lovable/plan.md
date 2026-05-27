# Triple-Check Currency Sync — All Markets

## Goal
Verify that the price shown on the order page exactly matches what Shopify charges at checkout, for every supported market — with zero client-side FX math.

## How sync works today (no code changes needed unless we find a bug)
1. `useGeo` detects buyer country
2. `fetchVitalWalkProduct(country)` calls Storefront API with `@inContext(country: $country)` — Shopify returns prices already localized
3. UI formats those localized amounts with `Intl.NumberFormat` (`src/lib/money.ts`) — no conversion
4. `createCheckoutForLines(..., country)` sets `buyerIdentity.countryCode` on cart → checkout opens in matching Shopify Market + currency
5. Dev warning fires if Shopify silently returns USD for a non-US country (= Market not enabled in Shopify Admin)

## Verification plan (browser, 1 pass per market)
For each country, navigate to `https://order.vitalwalk.store/?country=<CC>`, select 2-Pair Black UK6 (or local equiv), click checkout, and confirm in the Shopify-hosted checkout:
- Currency code matches order page
- Per-pair × qty math matches (no rounding drift)
- `buyerIdentity.countryCode` reflected (country selector on checkout)
- Variant = correct color/size

Markets to check:
- US (USD) — baseline
- GB (GBP)
- AU (AUD)
- CA (CAD)
- DE (EUR)
- FR (EUR)
- JP (JPY) — zero-decimal currency, extra risk

## What I'm looking for
- Any market where Shopify falls back to USD (→ console warn from `useCurrency`) = needs Market enabled in Shopify Admin → Settings → Markets (not a code fix)
- Any drift between order page subtotal and Shopify checkout subtotal
- JPY formatting (must show no decimals — already handled in `formatMoney`)
- `buyerIdentity.countryCode` propagation

## Deliverable
A short per-market report:
```
US  ✅ $X.XX  → checkout $X.XX  USD
GB  ✅ £X.XX  → checkout £X.XX  GBP
AU  ✅ A$X.XX → checkout A$X.XX AUD
CA  …
DE  …
FR  …
JP  …
```
Plus any anomalies and whether they're a code issue (I'll fix) or a Shopify Markets config issue (you'll need to toggle in Shopify Admin).

No code changes planned unless verification turns up a real bug.
