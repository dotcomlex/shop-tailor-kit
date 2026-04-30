## Audit results — currency auto-switching

I traced the full path: **geo detection → Shopify `@inContext` query → `useCurrency.format()` → every visible price**. The architecture is correct, but I found **3 real risks** that can cause a visitor to see the wrong currency. Fixing them is fast.

### What's working ✅

- Server-side geo (Supabase edge function) reads `cf-ipcountry` first, then falls back to a server-to-server IP lookup — bypasses ad-blockers.
- Client geo has a 4-provider chain (server geo → ipwho.is → geojs → ipapi) + 6h cache + background re-validation that re-fires `geo-changed` and re-renders prices if the cached country was wrong.
- Shopify Storefront query uses `@inContext(country:)` so prices come back already converted by Shopify (same FX rate as checkout).
- `?country=GB` URL override works for testing.
- Live Shopify check (just ran): **US, CA, GB, AU, DE, FR, NL, IE, NZ, SE, CH, DK, JP all return correct localized currency.** Bundle prices are perfectly proportional too (e.g. GB: £45.13 / £75.21 / £90.25).

### Issues found ❌

**1. Some markets are NOT enabled in Shopify and silently fall back to USD.**
Live API test results:
```text
NO (Norway)  → 59.95 USD   ← should be NOK
MX (Mexico)  → 59.95 USD   ← should be MXN
BR (Brazil)  → 59.95 USD   ← should be BRL
```
A Norwegian visitor today sees `$59.95` with a 🇳🇴 flag chip — confusing, and almost certainly killing conversions for those visitors. **This must be fixed in Shopify Admin → Markets** (I cannot enable markets via the API tools available). I'll list exactly which markets to enable.

**2. USD price flash for non-US visitors on cold load.**
`useCurrency.format()` falls back to USD while Shopify's localized response is in flight (~200–600ms). A French visitor sees `$59.95` for a moment, then `52,16 €`. That flash erodes trust on the most price-sensitive part of the page. The hook even comments "to avoid showing a USD price flash… returns ''" — but the implementation actually returns USD, contradicting the comment. **Fix:** return `""` (skeleton) until Shopify's localized response is in, exactly as the comment promises. The page will show a brief shimmer instead of a wrong-currency flash.

**3. Background re-validation only invalidates the 1-pair query key.**
`useGeo` calls `queryClient.invalidateQueries({ queryKey: ["vitalwalk-product"] })`, but the actual query key is `["vitalwalk-bundles", code]`. So if a VPN user's real country is detected late, **prices never re-fetch**. **Fix:** invalidate `["vitalwalk-bundles"]`.

### Plan

**Code fixes** (small, surgical):

1. **`src/hooks/useCurrency.ts`** — return `""` from `format()` while geo is loading or Shopify hasn't returned localized data yet. Keeps US visitors unchanged (their localized response = USD).
2. **`src/hooks/useGeo.ts`** — fix the stale query key so background re-validation actually re-fetches prices: `["vitalwalk-bundles"]`.
3. **`src/components/order/QuantityStep.tsx`** & any other price renderers — confirm they handle the empty-string skeleton case gracefully (the `tabular-nums` blocks already collapse cleanly; I'll add a min-height so the layout doesn't jump).
4. **Add a tiny dev-only currency assertion** in `useCurrency`: if `currency !== "USD"` and rate is exactly 1 after product load, log a warning so we catch silent fallbacks early.

**Verification** (I'll run after the edits):

- Re-run the multi-country Storefront API check and print a clean pass/fail table.
- Open the preview with `?country=GB`, `?country=DE`, `?country=AU`, `?country=JP`, `?country=NO` and confirm the displayed prices match Shopify's `@inContext` response to the cent.
- Confirm checkout opens in the matching currency (`buyerIdentity.countryCode` is already wired through `createCheckoutForLines`).

**Manual action required from you (Shopify Admin):**

Go to **Settings → Markets** and enable these markets (or add them to an existing International market) so Shopify returns localized prices instead of USD:
- 🇳🇴 Norway (NOK)
- 🇲🇽 Mexico (MXN)
- 🇧🇷 Brazil (BRL)
- Optional but recommended for completeness: 🇨🇿, 🇵🇱, 🇭🇺, 🇿🇦, 🇸🇬, 🇦🇪, 🇮🇳, 🇰🇷

Until those markets are enabled, visitors from those countries will see USD with their flag — there is no way around that on the API side.

### Out of scope

- Changing pricing logic (already correct).
- Touching checkout flow (already passes `countryCode` correctly).
- Adding a manual currency switcher in the header (can do later if you want, but auto-detection should be the primary path).
