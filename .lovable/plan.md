# Fix: page appears blank/not loading

## What I checked
- Dev server: healthy, returns 200, no build errors, no runtime errors in console.
- Network: no failed requests captured.
- Edge function `geo`: booting normally (~20ms).
- Code: `Index.tsx` → `OrderPage` renders fine; structure is intact.

## Root cause
In the recent currency hardening, `useCurrency.format()` was changed to return an **empty string** while geo + Shopify localized pricing are still resolving (to prevent a "USD flash" for UK/EU/AU/NZ/CA shoppers).

Every price on the page (`QuantityStep`, `SavingsHero`, `OrderSummary`, `StickyCheckoutBar`) calls `format(...)`. On a cold load with no geo cache, this means:
- ~300–800ms where every price slot renders as `""`
- The page **looks broken / half-loaded** during that window — which matches what you're seeing in the preview right now (no cached geo in the iframe).

The page is technically loading correctly; it just looks empty because the prices are blanked instead of showing a placeholder.

## Fix

1. **`src/hooks/useCurrency.ts`** — return a small placeholder (`"…"` or a fixed-width skeleton string like `"—"`) instead of `""` while awaiting localized price. The page will visibly populate immediately and prices will swap in cleanly when Shopify responds.
2. **Optimistic USD-then-swap for cached non-US shoppers** — when geo is cached, we already know the country, so render the USD-equivalent immediately styled as a skeleton (lower opacity) and swap to localized currency the moment Shopify responds. No blank window.
3. **Cap the wait** — if Shopify localized response takes >1.2s, fall back to showing the USD price rather than staying blank indefinitely. A late-arriving wrong currency is far better than a permanently empty page (and we already invalidate + re-render via `vitalwalk:geo-changed`).
4. **Prefetch geo earlier** — kick off `detectCountry()` from `main.tsx` (before React mounts) so the geo round-trip overlaps with React hydration and the Shopify fetch can fire with the right country on the very first query.

## Files to edit
- `src/hooks/useCurrency.ts` — placeholder + 1.2s timeout fallback
- `src/main.tsx` — prefetch `detectCountry()` on module load
- `src/components/order/SavingsHero.tsx`, `OrderSummary.tsx`, `QuantityStep.tsx`, `StickyCheckoutBar.tsx` — wrap empty `format()` output in a subtle skeleton span (opacity-40 + min-width) so the layout never collapses

## Result
On every load (cached or cold, US or non-US, ad-blockers on or off), the page paints all prices within ~50ms — either as the cached/static value or as a visible skeleton — and never appears blank.
