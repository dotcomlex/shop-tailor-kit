# Full-funnel QA pass — VitalWalk store

End-to-end verification of the live preview before declaring the store ship-ready. No code changes unless an issue surfaces; each failure becomes a follow-up edit.

## Scope

The full purchase path:
**Landing → bundle/color/size selection → Add to cart → Insole upsell → Socks upsell (decline path) → Shopify checkout** — across multiple countries/currencies and multiple shoe sizes (US W, US M, UK).

## Checks

### 1. Cold load & performance
- Fresh navigation to `/`. No console errors / warnings (other than the existing benign `RESET_BLANK_CHECK`).
- Initial Storefront fetch for `official-vitalwalk®` returns within reasonable time and is single-flight.
- LCP image (hero shoe) loads from Shopify CDN, no broken images, no layout shift after bundles render.

### 2. Currency / country switcher
Cycle US → CA → GB → AU → DE and confirm:
- Bundle prices, compare-at strikes, and "Save %" badges re-render in the new currency on the main page.
- Insole modal price re-renders.
- Socks modal price + compare-at re-render and "Save %" math stays correct.
- `createCheckoutForLines` carries the matching `countryCode` so checkout opens in the same Shopify Market / currency.

### 3. Variant matrix on the main product
For each pack tier (1, 2, 3 pairs):
- Every Color × Size combination resolves to a real variant via `findBundleVariant`.
- Picking a color updates the hero image; picking a size enables the CTA.
- Sold-out variants surface the existing "currently sold out" toast instead of silently failing.

### 4. Insole upsell
- Opens after Add to Cart, with size auto-matched from the first chosen shoe size (`pickInsoleVariantForSize`).
- Try US W 6, US W 9, UK 11 → confirm exact / nearest-neighbor logic picks the expected variant (debug log under `[insole-match]`).
- Accept → insole line is appended to checkout with correct variant id.
- Decline → moves to socks modal.

### 5. Socks upsell (decline-path)
- Opens with the lifestyle/benefits hero image (no color preselected visually).
- Size pill is auto-matched: US W ≤ 8 / US M ≤ 7.5 / UK ≤ 6.5 → S/M, otherwise L/XL.
- Tapping Black or White swaps the hero to the variant's color photo (with fade); price stays correct.
- Toggling S/M ↔ L/XL re-resolves the variant via `pickSocksVariant` without losing color.
- "Yes, add 3 pairs" → socks line appended to checkout, `AddToCart` pixel fires once.
- "No thanks" → checkout proceeds with shoes (+ insole if accepted).
- Header copy ("LAST-CHANCE OFFER · ENDS NOW") fits on one line at 360 / 390 / 414 px and the X button never overlaps the text.

### 6. Checkout handoff
For four representative paths (shoes-only, shoes+insole, shoes+socks, shoes+insole+socks):
- `createCheckoutForLines` returns a `checkoutUrl` containing `channel=online_store`.
- `window.open(checkoutUrl, '_blank')` opens Shopify checkout with the right currency, the right line items, and per-pair color/size attributes visible on each line (no password gate).
- Discount codes (if any are wired) attach correctly.

### 7. Pixels & analytics
- `PageView` fires once on landing.
- `ViewContent` fires once when each upsell opens (insole, socks).
- `AddToCart` fires once on each accept; no duplicate fires when toggling size/color inside the modals.
- `InitiateCheckout` fires on the final checkout open.

### 8. Responsive / a11y sanity
- 360 × 800, 390 × 844, 414 × 896, 768 × 1024, 1280 × 720 — no clipped text, all CTAs reachable, modals scroll on short viewports.
- ESC + outside-click on modals are blocked for the first 500ms (the existing `armed` guard) and work after.
- Tab order through size/color pills and CTAs is sensible.

## Method

Use the browser tool against the live preview. Network panel for FX + checkout payloads, console for pixel + match logs. Execute in this order:

1. `navigate_to_sandbox` → cold load + console scan.
2. Country cycle (5 countries) → screenshot prices, inspect network for the localized GraphQL responses.
3. Variant matrix (sample, not exhaustive: 1 pair × 2 colors × 3 sizes; 3 pairs × 1 combo).
4. Run the 4 checkout paths end to end, stopping just before payment so nothing real is charged.
5. Resize viewport for responsive sanity.

For each failure: capture the smallest reproducible step + screenshot, fix in code, re-verify only the affected check (don't restart the whole pass).

## Out of scope

- Actual payment capture in Shopify (we stop at the hosted checkout).
- Adding new functionality or A/B variants — this pass is verification only.
- EU sizing on the shoe product (not currently offered in Shopify).

## Technical details

- Files touched: none unless a failure forces a fix; in that case the fix is minimal and isolated to the failing component.
- All checks are read-only against the existing Storefront API + Shopify checkout.
