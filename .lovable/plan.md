# Make currency auto-detection bulletproof

## Verified working (live test against Shopify just now)

I queried the Storefront API with `@inContext(country:)` for every target market. Shopify is correctly configured:

| Country | Returns |
|---|---|
| US | `69.95 USD` |
| UK (GB) | `52.47 GBP` |
| Canada | `96.80 CAD` |
| Australia | `98.80 AUD` |
| New Zealand | `120.17 NZD` |
| Germany / France / EU | `60.57 EUR` |

The Shopify side and the React code that consumes it (`useDisplayPrice`, `useCurrency`, header currency pill, checkout `buyerIdentity.countryCode`) are all wired correctly. **The weak link is country detection itself.**

## The 3 real risks (and the fix for each)

### 1. Ad-blockers / firewalls block all 3 IP providers → defaults to US

`src/lib/geo.ts` calls `ipwho.is`, `get.geojs.io`, then `ipapi.co`. uBlock Origin, Brave Shields, corporate networks, and several mobile carriers block these. When all three fail, `detectCountry()` returns `null` and the product query falls back to `"US"` → **a UK shopper sees `$69.95 USD`.** This is almost certainly what you saw on the other site.

**Fix:** add a tiny Supabase Edge Function `geo` that returns `{ country }` from the request's edge geo header (`x-vercel-ip-country` / Deno's `request.headers` / `cf-ipcountry` depending on platform — Lovable Cloud edge runtime exposes this). Make it the **first** provider in the chain. Server-side detection is invisible to ad-blockers and works on every browser.

### 2. Stale 24h localStorage cache locks the wrong currency

A visitor whose first hit was from the US (or via VPN/airport WiFi) has `US` cached for 24h. Returning from London the next day → still USD.

**Fix:**
- Drop cache TTL from 24h to 6h.
- On every page load, re-detect in the background (using the new server-side endpoint, which is fast + free), and if the detected country differs from the cached one, update + invalidate the React Query cache so prices re-render.
- Keep the `?country=XX` URL override (useful for QA + ad campaigns targeting specific geos).

### 3. USD flash before Shopify responds (~150-400ms)

`STATIC_FALLBACK` in `useVitalWalkProduct.ts` hardcodes `$69.95 USD`. Non-US visitors briefly see USD before the localized price arrives.

**Fix:** when geo detection has resolved to a non-US country but the Shopify product query is still in flight, render a small price skeleton (`▢▢▢`) instead of the USD fallback. US visitors keep the instant render (no regression).

## Files changed

- **New** `supabase/functions/geo/index.ts` — reads edge geo header, returns `{ country: "GB" }`. No auth, public, ~10 lines.
- **Edit** `src/lib/geo.ts` — add `tryServerGeo()` as first provider, drop cache TTL to 6h, add background re-validation.
- **Edit** `src/hooks/useGeo.ts` — expose a way to invalidate when detected country changes mid-session.
- **Edit** `src/hooks/useVitalWalkProduct.ts` — expose `isLoading` so price components can show a skeleton instead of the USD fallback for non-US shoppers.
- **Edit** the 4 price-displaying components (`SavingsHero`, `OrderSummary`, `QuantityStep`, `StickyCheckoutBar`) — render skeleton when `geoLoading || (isLoading && country?.code !== "US")`.

## QA after build

I'll verify by hitting the new `/geo` endpoint directly, then spoofing 5 markets via `?country=GB`, `?country=AU`, `?country=NZ`, `?country=CA`, `?country=DE` in the preview and confirming:
- Header pill shows the right flag + currency code
- Hero, bundle prices, sticky bar, and order summary all render in the local currency
- Cart checkout URL opens in the matching Shopify Market

No changes needed to Shopify config — it's already perfect.