## Why prices are missing

The Quantity Step renders skeleton bars for the 2-Pair and 3-Pair cards because the Storefront API returns `null` for those two bundle products when queried with `@inContext(country: "US")`:

- `p1` (1-Pair) → returns data ✅
- `p2` (2-Pair Bundle) → `null` ❌
- `p3` (3-Pair Bundle) → `null` ❌

A direct query without `@inContext` returns the products, so they exist and are `active`. The `@inContext` directive enforces sales-channel publication — meaning the new bundle products were created but **not published to the "Headless / Online Store" sales channel** that the storefront token reads from. The 1-Pair product was published correctly, the new bundles were not.

In `QuantityStep.tsx`, `readLocalizedTotals(bundles?.[opt.qty], ...)` returns `null` whenever the product is null, so `totalFormatted` / `compareFormatted` are empty and the fallback skeleton placeholders render instead of prices.

## Fix

Republish the two new bundle products to the active sales channels via the Shopify admin tool, so the Storefront API can see them under `@inContext`.

1. Update `VitalWalk® Shoes — 2-Pair Bundle (75% OFF)` (id `10093966917918`) and republish it to all sales channels (online_store + headless).
2. Update `VitalWalk® Shoes — 3-Pair Bundle (80% OFF)` (id `10093967180062`) the same way.
3. Re-run the Storefront `AllBundles` query (with `@inContext(country: "US")`) and verify both `p2` and `p3` return non-null with their per-pair prices ($58.29 and $46.62).
4. Reload the order page — the 2-Pair and 3-Pair cards should display the strikethrough compare price, the bundle total, and the per-pair sub-line.

## Defensive code change

To prevent this kind of silent failure from looking like a "broken price" again, also add a small dev-only console warning in `fetchVitalWalkBundles` (in `src/lib/shopify.ts`) when any of `p1`/`p2`/`p3` come back as `null`. This makes future channel-publication issues immediately visible in the console instead of showing as a skeleton.

No other code changes are required — the pricing math in `QuantityStep.tsx` and the checkout wiring in `OrderPage.tsx` are correct; they're just being fed `null` for the bundle products.
