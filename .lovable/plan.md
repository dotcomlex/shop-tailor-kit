# Fix: 2-Pair & 3-Pair Bundles Skipping Shipping at Checkout

## The Problem (Confirmed)

Checkout skips the shipping step for the 2-pair and 3-pair bundles because every variant on those bundle products has **"This is a physical product"** turned **OFF** (`requires_shipping = false`). When no line on a Shopify cart requires shipping, Shopify treats the order as digital and removes the entire shipping step.

Affected products:

| Product | Shopify ID | Variants |
|---|---|---|
| VitalWalk® Shoes — 2-Pair Bundle (75% OFF) | 10087556088094 | 80 |
| VitalWalk® Shoes — 3-Pair Bundle (80% OFF) | 10087556284702 | 80 |

The 1-pair product (`VitalWalk®`, ID 9839297102110) is correctly configured — that's why single-pair checkouts show shipping fine.

## What I Cannot Do (Important)

The Shopify tools available to me (`update_product_variant`, `update_product`) do **not expose** the `requires_shipping` field. There is no programmatic way for me to flip this flag from inside Lovable for the 160 affected variants. I tried — the schema has no parameter for it.

So this needs **two minutes of clicking in your Shopify admin**. I'll give you the exact steps and verify the fix afterwards.

## Fix Steps (Shopify Admin)

For **each** of the two bundle products:

1. Open Shopify Admin → Products
2. Open **VitalWalk® Shoes — 2-Pair Bundle (75% OFF)**
3. Scroll to the **Shipping** section (it's a product-level setting on Shopify's new variant model, not per-variant — one toggle covers all 80 variants)
4. Check **"This is a physical product"**
5. Set a weight (e.g. `1.4 kg` for 2 pairs, `2.1 kg` for 3 pairs — adjust to your actual ship weight)
6. Save
7. Repeat for **VitalWalk® Shoes — 3-Pair Bundle (80% OFF)**

If your store still uses the legacy per-variant shipping toggle, the checkbox lives on each variant under "Shipping" — but on the 2024+ product model, the single product-level toggle propagates to all variants.

## Verification (I'll Do This)

Once you've toggled both, tell me and I'll:

1. Re-fetch both bundle products via the Shopify API and confirm `requiresShipping: true` on every variant
2. Run a test checkout for the 2-pair bundle to confirm the shipping step now appears
3. Run a test checkout for the 3-pair bundle to confirm the same

## Why Not Recreate the Products?

I considered deleting and recreating the bundles via `create_product` (which defaults `requires_shipping` to true). Rejected because:
- It would break the existing variant IDs hardcoded into pixel events, abandoned-cart links, and any in-flight orders
- It would reset compare-at prices and the inventory configuration you've already dialed in
- The handles `vitalwalk®-shoes-2-pair-bundle` and `vitalwalk®-shoes-3-pair-bundle` are referenced in `src/lib/shopify.ts` — recreating could change them

A 30-second toggle in admin is safer than a recreate.

## No App Code Changes Needed

This is purely a Shopify product-configuration issue. `OrderPage.tsx`, `shopify.ts`, and the cart flow are all correct — they're sending the right variant IDs with the right buyer country. The fix is upstream in Shopify itself.
