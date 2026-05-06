## Goal
Sync only the **color variant images** (Beige, Gray, Black, Blue) from the 1-pair VitalWalk product onto the 2-pair and 3-pair bundle products. No lifestyle/feature shots.

## Source images (from 1-pair product `10083237298462`)
1. `vitalwalk_color_1_compressed.jpg` — Beige
2. `vitalwalk_color_2_compressed.jpg` — Gray
3. `vitalwalk_color_3_compressed.jpg` — Black
4. `vitalwalk_color_4_compressed.jpg` — Blue

## Steps
1. **Resolve image source.** The Shopify CDN URLs are not directly fetchable by `update_product` (returned `GIT_FILE_UNREADABLE`). Approach: download each of the 4 color JPGs into the project (e.g. `public/shopify-bundle-images/`) via `curl`, then pass those local paths into `shopify--update_product`.
2. **Update 2-Pair bundle (`10093966917918`)** — call `shopify--update_product` with exactly the 4 color images (alts: Beige / Gray / Black / Blue). This replaces the current empty/default media set.
3. **Update 3-Pair bundle (`10093967180062`)** — same 4 images, same alts.
4. **Verify** with `shopify--get_product` on both bundle IDs that exactly 4 images are present and the primary image is the Beige color shot.
5. **Clean up** the temporary `public/shopify-bundle-images/` folder after Shopify has the assets, so they don't ship in the frontend bundle.

## Important note on checkout thumbnail behavior
Bundle variants are generic `Pair #1 / #2 / #3` (no Color option on the variant), so Shopify cannot auto-swap the line-item thumbnail to the customer's chosen color. The thumbnail at checkout will show the bundle product's primary image (Beige). The actual color + size chosen for each pair is already passed as **line-item properties** and in the **order note**, so you and your supplier see the correct selections per pair.

If you later want the thumbnail itself to match the chosen color, we'd need to restructure the bundles so each variant is per-color (e.g. `Beige / Gray / Black / Blue` as the variant option) — a separate, larger change.

## Files / surfaces touched
- Shopify product `10093966917918` (2-Pair Bundle) — images replaced
- Shopify product `10093967180062` (3-Pair Bundle) — images replaced
- No app code changes
