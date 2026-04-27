# Fix: Country & flag not appearing in shipping line

## Root cause

The Shopify request in your current session is going out with `"country":"US"` — meaning `useGeo()` is returning `null`. The shipping line in `IncludedChecklist.tsx` then falls back to "Fast & free shipping to your door" instead of "...to United Kingdom 🇬🇧".

The geo lookup in `src/lib/geo.ts` only calls `https://ipapi.co/json/`. That endpoint is:
- Rate-limited aggressively on the free tier (1k/day per IP, often blocks bursts)
- Frequently blocked by ad-blockers / privacy extensions
- Returns errors silently in this session (no network entry, no console error)

Once it fails, we cache `null` for 24 hours in `localStorage` (`vitalwalk_geo`), so the user keeps seeing the generic fallback even after the network recovers.

## Fix plan

### 1. `src/lib/geo.ts` — multi-provider detection with fast failover
- Try providers in order, return on first success (each with ~1.5s timeout):
  1. `https://ipwho.is/` (free, no key, generous limits, returns `country_code` + `country`)
  2. `https://get.geojs.io/v1/ip/country.json` (free, no key, very reliable)
  3. `https://ipapi.co/json/` (current — kept as last resort)
- Only cache **successful** lookups for 24h. Cache failures for just **5 minutes** (instead of 24h) so a transient block doesn't lock the user into the fallback all day.
- Add a one-time `console.warn` when all providers fail (so we can see it in logs next time).

### 2. `src/hooks/useGeo.ts` — expose a manual override for testing
- Read `?country=GB` from the URL on mount; if present, set it as the detected country (and skip the network call). Lets you verify the UK copy on the live site by visiting `/?country=GB` without waiting on IP detection.
- Also persist that override in `localStorage` so it sticks across reloads during testing.

### 3. Clear the stale negative cache automatically
- Bump the cache key from `vitalwalk_geo` → `vitalwalk_geo_v2` so every existing visitor (including you) gets a fresh lookup against the new provider chain on next load. Old cached `null` values are abandoned.

### 4. No UI changes
- `IncludedChecklist.tsx` and `SavingsHero.tsx` already render `Fast & free shipping to {country.name} {country.flag}` correctly — they just need `useGeo()` to actually return a country. No changes needed there.
- Currency/price formatting via `useCurrency` is already wired through the same `useGeo` → so fixing detection also fixes any cases where prices were stuck in USD for non-US visitors.

## Verification after deploy
- Visit live site → shipping line should read e.g. "Fast & free shipping to the United Kingdom 🇬🇧" and prices should render in GBP.
- For quick QA: append `?country=GB`, `?country=DE`, `?country=AU` to the URL to force-test each region without leaving home.
