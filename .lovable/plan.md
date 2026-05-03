## What I verified (working correctly)

End-to-end Storefront API check across every step of the funnel:

| Country | 1-pair | 2-pair | 3-pair | Insole |
|---|---|---|---|---|
| US 🇺🇸 | $69.95 | $116.58 | $139.86 | $7.95 |
| UK 🇬🇧 | £44.82 | £74.70 | £89.64 | £5.94 |
| AU 🇦🇺 | A$84.50 | A$140.84 | A$169.00 | A$11.21 |
| CA 🇨🇦 | C$82.68 | C$137.80 | C$165.35 | C$10.96 |

- US shows your override ($69.95 / strike $232.83) — matches the funnel and what Shopify will actually charge at checkout.
- UK/AU/CA convert from the original $59.95 base via Shopify Markets — same FX as checkout.
- Compare-at prices (strike-throughs) preserve the 70/75/80% savings math everywhere.
- Insole upsell stays at the base price for all non-US markets, as you intended.
- `OrderPage.tsx` has a pre-checkout price-sync guard that re-fetches the live total right before redirecting and refuses to send the user to checkout if the on-screen total drifted — so there's no "saw $X, charged $Y" risk.
- `buyerIdentity.countryCode` is passed into `cartCreate`, so Shopify checkout opens in the matching market + currency automatically.

## The issue I found: Rest of World falls back to US prices

When I queried as a shopper from Germany, France, Sweden (and by extension every country not in your four markets), Shopify returns:

```
1-pair: 69.95 USD   (compare 232.83)
2-pair: 116.58 USD
3-pair: 139.86 USD
```

That's the **US-overridden price in USD** — not the original $59.95 base, not converted to local currency. This happens because your "international" market only includes UK/AU/CA, so any visitor from outside those 4 countries has no market assigned and Shopify falls back to the US market.

Net effect today: a shopper in Germany / Netherlands / Ireland / Mexico / Japan / etc. sees `$69.95 USD` on the page and gets charged `$69.95 USD` at checkout — the higher US price, in a foreign currency, with no local conversion. Functionally "not broken" (price on page = price at checkout), but it's the awkward situation you wanted to avoid.

## Recommended fix (no code changes — Shopify Admin only)

In **Settings → Markets** in your Shopify admin, expand your "International" (UK/AU/CA) market to also include **"All other countries / regions"** (or create a separate catch-all market for Rest of World). The result:

- US shoppers → US market → $69.95 USD (unchanged)
- UK/AU/CA shoppers → International market → local currency (unchanged)
- Everyone else → International market → original $59.95 base, auto-converted to their local currency by Shopify

Then I'll re-run the verification across DE/FR/SE/JP/etc. to confirm they now show the lower base price in local currency.

## Alternative if you only want to ship to UK/AU/CA/US

If shipping outside those four countries isn't something you want, the cleaner option is to leave Markets as-is but disable shipping to the rest of the world in **Settings → Shipping and delivery**, so checkout outright blocks unsupported regions instead of charging them the US price.

## Code-side: nothing to change

- `src/lib/shopify.ts` — `@inContext(country:)` on every product query ✅
- `src/hooks/useCurrency.ts` — formats whatever currency Shopify returns, no client-side FX ✅
- `src/components/order/QuantityStep.tsx` / `OrderSummary` / `StickyCheckoutBar` — all read totals straight from the localized bundle product ✅
- `src/components/order/OrderPage.tsx` — pre-checkout price-sync guard + `buyerIdentity.countryCode` on `cartCreate` ✅
- Visibility-change refetch keeps prices fresh after long idle ✅

After you tell me which option you want (extend International market vs. block shipping), I'll switch to build mode only if any code adjustment is needed — otherwise I'll just re-verify all regions and confirm the funnel is clean.