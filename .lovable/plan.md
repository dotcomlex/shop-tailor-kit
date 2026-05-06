## Goal

Migrate the funnel from 3 pack-products to your **single live product** — verified just now:

- **Title:** VitalWalk® Shoes
- **ID:** `10094360756510`
- **Handle:** `official-vitalwalk®` ✅ (updated)
- **Options:** `Bundle Deal` × `Color:` × `Size:` (240 variants)
- **Live per-pair prices in Shopify (no edits needed):**
  - 1x Pair – 70% OFF → **$59.95**
  - 2x Pairs – 75% OFF → **$54.95**
  - 3x Pairs – 80% OFF → **$49.95**
- **Compare-at:** $199.83 already set on variants
- **Per-color images** already synced to variants → checkout will show the right photo per pair automatically.

**Zero Shopify writes.** No products created, deleted, edited, repriced, or renamed. Frontend code only.

## Frontend changes

### 1. `src/lib/shopify.ts`
- Replace the 3-handle map with a single constant: `VITALWALK_PRODUCT_HANDLE = "official-vitalwalk®"`.
- Drop `fetchVitalWalkBundles`, `findPairVariant`, the no-context fallback, and the `BundleProducts` type.
- `fetchVitalWalkProduct(country)` becomes the only product fetch (already localized via `@inContext`).
- New `findBundleVariant(product, tier, color, size)` — matches on `Bundle Deal` + `Color`/`Color:` + `Size`/`Size:` (tolerant of trailing colons).
- New `getTierPerPairPrice(product, tier)` — reads the localized per-pair price + currency from the first variant of that tier (so Markets FX still drives the displayed total).
- Insole helpers untouched.

### 2. `src/hooks/useVitalWalkProduct.ts`
- `useVitalWalkProduct()` → single localized fetch (replaces `useVitalWalkBundles`).
- `useDisplayPrice()` keeps showing the 1-pair price + $199.83 compare-at as today.
- New `useTierPrice(quantity)` returning `{ perPair, currency }` for the active tier — used by Step 3 totals and the sticky bar.

### 3. `src/components/order/OrderPage.tsx`
- `bundleTotal = tierPerPair × quantity` (live, localized).
- `bundleCompare` keeps your synthesized strikethrough (`total / (1 − SAVE_PCT[quantity])`) so the % OFF on Step 1 always agrees with the savings on Step 3.
- Pre-checkout price-sync guard: refetch the single product, recompute `freshTotal`, same drift tolerance — currency converter behavior preserved.
- Cart line construction:
  - For every pair `i`, look up `findBundleVariant(product, tier, selections[i].color, selections[i].size)`.
  - Push **one line per pair** (`quantity: 1`) with `attributes: [Pair: i+1]` so the supplier can read the pair order.
  - Identical color+size pairs are merged into one line with bumped `quantity` (cleaner cart).
- Order note kept (`Bundle: N Pairs / Pair 1: …`) as a backup for the supplier.
- Insole upsell flow, FB pixel events (ViewContent / AddToCart / InitiateCheckout), and `channel=online_store` checkout redirect — all unchanged.

### 4. Cleanup
- Delete dead exports/types from `shopify.ts`.
- No UI component edits (QuantityStep / ColorSizeStep / UpgradeStep / InsoleUpsellModal / sticky bar all stay).

## What the supplier sees in Shopify

```text
VitalWalk® Shoes
  2x Pairs - 75% OFF / Black / US W 9 / US M 8 / UK 7    × 1   $54.95   [black photo]
  2x Pairs - 75% OFF / Beige / US W 8 / US M 7 / UK 6    × 1   $54.95   [beige photo]
                                              Subtotal:  $109.90
```

Real variant lines, real SKUs, real per-color images — nothing to interpret.

## End-to-end smoke test (before declaring done)

1. Step 1 → pick **2 Pairs**, badge reads "75% OFF".
2. Step 2 → pick different colors/sizes for each pair.
3. Step 3 → total = `$54.95 × 2 = $109.90`, strike-through ≈ `$439.60`.
4. Click Complete Order → insole upsell modal opens with size matched.
5. Decline / accept → Shopify checkout opens in same tab with `channel=online_store`, totals match exactly, each pair shows its color image.
6. Repeat for 1-pair and 3-pair flows. Confirm currency-converter path (e.g. CA / GB) still localizes via `@inContext`.

## Safety checklist (paid traffic is live)

- ✅ Read-only Storefront API; no Admin API writes.
- ✅ No Shopify product/variant/price/handle edits.
- ✅ Existing checkout URL flow + `channel=online_store` preserved.
- ✅ Pixel events keep firing with valid numeric variant IDs.
- ✅ Pre-checkout price-sync guard preserved against FX drift.

Approve and I'll implement + smoke-test.