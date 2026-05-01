# Insole modal polish + full funnel QA

## 1. Spacing fixes (`src/components/order/InsoleUpsellModal.tsx`)

The trim-to-fit microcopy is hugging the benefits list, and the benefits list sits too tight to the gallery row above.

- Increase the **benefits `<ul>`** top margin from `mt-3` → `mt-4` so the checklist breathes away from the hero/gallery block.
- Increase **trim-to-fit line** top margin from `mt-2` → `mt-3` and add a touch of letter-spacing so it reads as a separate reassurance line, not a 4th bullet.
- Bump the **per-pair size block** from `mt-3` → `mt-4` so it doesn't crowd the trim-to-fit line.

## 2. Make the hero image and title bigger

Right column currently feels under-weighted vs. the orange hero. Goal: make the product clearly the star without breaking the 400px max-width modal.

- Hero column: `w-[150px]` → `w-[170px]`, image `aspect-square` stays, container becomes `w-[170px]`.
- Thumbnails: bump from `h-[22px] w-[22px]` → `h-[26px] w-[26px]` (6 thumbs × 26 + 5 gaps fits ~170px with `justify-between`). Adjust play-icon triangle to `border-y-[4px] border-l-[6px]`.
- Title (`<h2>`): `text-[16px]` → `text-[17.5px]`, keep `font-extrabold leading-[1.15]`. Should still wrap to 2 lines comfortably.
- Subtitle ("Slip them in…"): `text-[11.5px]` → `text-[13px]`, `mt-0.5` → `mt-1`, change color from `--text-mute` → `--text-body` so it actually reads as supporting copy, not fine print.
- Price stays the same size — it's already the dominant element and we don't want to compete with the bigger title.

## 3. Full funnel QA pass

Walk the entire flow at the live preview to verify currency + upsell behavior end-to-end. For each viewport (mobile 390px and desktop), run through:

1. **Geo + currency detection** — confirm `useGeo` resolves, `useCurrency` returns the right ISO code, and the main product price on the order page matches what Shopify returns for that country.
2. **Color/size step** — pick a size in the user's local size system, advance to quantity step.
3. **Quantity step** — verify per-pair pricing math (unit × qty, savings line, totals all in the detected currency, no `$` hardcoded anywhere).
4. **Insole upsell modal** — opens on continue, hero video autoplays muted, thumbnails switch the hero between video + 5 images, and:
   - Unit price, compare-at, "Save X% today" badge all use `formatMoney(amount, currency)` from the Shopify variant's actual `currencyCode` (not hardcoded USD).
   - Per-pair size rows show the correct size in the user's chosen size system.
   - "You save {amount} on insoles" totals across all pairs in the right currency.
   - CTA label `Yes, Add for {totalPrice}` formats with the live currency.
   - Decline link works after the 500ms arm delay.
5. **Sticky checkout bar / order summary** — totals (shoes + insoles) match the modal's currency.
6. **Shopify checkout handoff** — open the generated checkout URL and confirm the **same currency and same numeric prices** appear on the Shopify-hosted checkout (this is the parity check the user keeps asking for).

QA tools used: `browser--set_viewport_size`, `browser--observe`, `browser--act`, `browser--screenshot`, `browser--read_console_logs`, `browser--list_network_requests` to inspect the Shopify Storefront API responses and confirm `currencyCode` matches across product fetch, cart, and checkout.

If parity breaks anywhere (e.g. modal shows EUR but Shopify checkout falls back to USD), I'll trace it through `src/lib/shopify.ts` / `useInsoleProduct` and fix the `@inContext` country code being passed.

## Files touched

- `src/components/order/InsoleUpsellModal.tsx` (spacing + sizing only)

No DB, no new assets, no new dependencies.
