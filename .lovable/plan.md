## What's actually broken

The 2-Pair and 3-Pair bundle prices on the Quantity Step show as gray skeleton bars because the Storefront API returns `null` for those two products when queried with `@inContext(country: "US")`. The 1-Pair product is in the US Market catalog so it works; the two new bundle products aren't, so `@inContext` filters them out.

I confirmed via direct API call:
- WITH `@inContext(country: US)` → `p2: null`, `p3: null`
- WITHOUT `@inContext` → both products return correctly with prices ($58.29, $46.62)

Cart/checkout still works because cart mutations don't apply the same Market filter.

## Fix (code only — no Shopify admin changes needed)

Edit `src/lib/shopify.ts`, function `fetchVitalWalkBundles`:

1. Run the existing `@inContext` query first (so localized currency keeps working when the product IS in the Market).
2. If any of `p1`/`p2`/`p3` come back `null`, run a second query WITHOUT `@inContext` and merge in the missing products. Those will be in the shop's base currency (USD), but the price will render correctly instead of a skeleton.
3. Remove the misleading dev-only "publish to Headless channel" warning I added — the real cause is Market catalog inclusion, not channel publication.

## Why this is safe

- 1-Pair product is unaffected — still localized via `@inContext`.
- Bundle products fall back to USD pricing (which is what they're priced at anyway).
- Checkout already works; only the display price was broken.
- No changes to `QuantityStep.tsx`, `OrderPage.tsx`, or any Shopify products required.

## Follow-up (optional, you can do later)

To get fully localized pricing on the bundles too, the 2-Pair and 3-Pair products need to be added to the same Market catalog as the 1-Pair product in Shopify admin (Settings → Markets → your active market → Catalog). Not urgent — the fallback handles it.
