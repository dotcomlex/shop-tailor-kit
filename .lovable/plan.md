## Goal

Polish the two new Shopify bundle products (2-pack & 3-pack) so checkout looks professional and shipping/currency works correctly across all markets.

Bundle products identified:
- **2-Pair Bundle** — Product ID `10087556088094` ($99.92, 80 variants)
- **3-Pair Bundle** — Product ID `10087556284702` ($119.90, 80 variants)
- **Source 1-Pair product** (image source) — `10083237298462` (handle `the-original-vitalwalk®-shoes-copy`)

## Step 1 — Rename bundle products with discount %

Use `shopify--update_product` to rename:
- 2-Pair → **"VitalWalk® Shoes — 2-Pair Bundle (75% OFF)"**
- 3-Pair → **"VitalWalk® Shoes — 3-Pair Bundle (80% OFF)"**

This way, customers see the discount baked into the product title at checkout.

## Step 2 — Add product images to bundles

The two bundle products were created without images, so checkout currently shows a blank thumbnail. Approach:

1. Fetch the source 1-Pair product's images via Storefront API (already public CDN URLs).
2. Download each image to `/tmp/`.
3. Call `shopify--update_product` on each bundle with the downloaded images via the `images[].file_path` parameter.

Note: `update_product` replaces ALL existing images, which is fine since the bundles currently have none.

## Step 3 — Ensure bundles are physical / require shipping

Variants on Shopify default to `requires_shipping: true` when created without explicit `weight`, but the user reported wanting to confirm. I'll:

1. Run a verification script via Storefront API checking `requiresShipping` on a sample variant of each bundle.
2. If `false`, set a small weight (`0.5 lb`) on each variant via `shopify--update_product_variant` to force `requires_shipping: true`. (160 variants — done in parallel batches.)

Most likely already true since they were created without overrides; this step is a verification + conditional fix.

## Step 4 — Verify multi-currency parity at checkout

Run a verification script that, for each market (**US, CA, GB, AU, DE, FR**):

1. Fetches the 2-pack and 3-pack variant prices via Storefront API with `@inContext(country: XX)` — this is the price the funnel displays.
2. Creates a real test cart with `cartCreate` `@inContext(country: XX)` for that variant.
3. Compares cart `cost.totalAmount` against the displayed variant price.
4. Reports a pass/fail table.

Since both display + checkout pull from the same Shopify-localized source, all markets should match exactly. The script confirms it and surfaces any rounding rule discrepancies.

## Files / tools used

- `shopify--update_product` (rename + add images, called twice)
- `shopify--update_product_variant` (only if shipping flag is wrong)
- `code--exec` (download images, run verification scripts)
- No frontend code changes required — funnel already pulls localized prices from Shopify.

## Out of scope

- Changing pricing logic (already correct from last session)
- Frontend UI changes
- Discount code creation (bundles use baked-in pricing, no codes needed)
