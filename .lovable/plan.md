# Socks upsell — polish + full funnel QA

## 1. Subtler selection color (replace harsh red)

In `src/components/order/SocksUpsellModal.tsx`, swap the `--save-red` selected styling on the **Size** and **Color** pills for a calm, neutral dark token that matches the rest of the modal:

- Selected pill: `border-[hsl(var(--text-strong))] bg-[hsl(var(--text-strong))] text-white`
- Hover (unselected): `hover:border-[hsl(var(--text-strong))]` (instead of red)
- Sub-label color when selected: `text-white/80`

Keep the green Save % badge and green checks as-is — only the selectable pills change.

## 2. Urgent / scarce headline

Replace the cream top-band copy `A little gift for your feet` with a more urgent, scarcity-driven line:

- New headline: **"LAST-CHANCE OFFER · WON'T BE SHOWN AGAIN"**
- Keep the same cream band + sparkle icon (visual stays calm; copy carries the urgency).
- Also tighten the sub-headline under the title from `Soothes swollen feet, all-day relief.` to **`One-time bonus — added to this order only.`**

## 3. Selected color must update the hero image

Currently the hero image is picked by alt-text matching, which is unreliable. Switch to using each variant's own image from Shopify (Black variants and White variants point to different `image_id`s in the store).

**`src/lib/shopify.ts`**
- Extend `ShopifyVariant` with `image: ShopifyImage | null`.
- Add `image { url altText }` to the variant selection inside `PRODUCT_FIELDS`.
- Add a helper `socksImageForColor(product, color)` that:
  1. Finds the first variant whose `Color` option equals the requested color and returns its `variant.image`.
  2. Falls back to alt-text match on `product.images`.
  3. Falls back to `product.images[0]`.

**`SocksUpsellModal.tsx`**
- Replace the `heroImage` lookup with `socksImageForColor(product, color)`.
- Wrap the `<img>` in a keyed crossfade (`key={color}` + `transition-opacity`) so the swap feels intentional, not a flash.

(Insole/main product flows are unaffected — the new variant `image` field is additive.)

## 4. Full end-to-end QA pass

After the three changes above, verify the entire funnel works on the live preview before declaring done. No code changes here unless an issue surfaces.

Checks (in order):

1. **Cold load** — open `/`, confirm initial fetch of the VitalWalk product is single-flight, no console errors, LCP image loads from Shopify CDN.
2. **Currency / country** — switch country (US → CA → GB → AU → DE) and confirm:
   - Bundle prices on the main page re-render in the new currency.
   - Insole modal price re-renders.
   - Socks modal price + compare-at re-render.
   - The `Save %` math on the socks badge stays correct after FX (computed from variant.price + compareAtPrice, both already localized by `@inContext`).
3. **Variants** — pick each color × size combo on the main product, confirm the hero image swaps and the chosen variant's price updates.
4. **Upsell chain**
   - Decline insole → socks modal opens with size auto-matched to the chosen shoe size and color defaulted to Black.
   - Toggle S/M ↔ L/XL and Black ↔ White → hero image updates, variant id resolves, price stays correct.
   - Accept socks → confirm `AddToCart` pixel fires once and Shopify cart includes shoe lines + insole-decline state + socks line with the correct variant id.
   - Decline socks → cart contains only shoe lines.
5. **Checkout handoff** — for both accept and decline paths:
   - `createCheckoutForLines` is called with `countryCode` matching the selected country.
   - Returned `checkoutUrl` carries `channel=online_store`.
   - `window.open(checkoutUrl, '_blank')` lands on a Shopify checkout in the right currency, with all expected lines (no password gate, no missing pairs).
6. **Buttons / a11y** — yellow CTA disables only while pending, decline link is reachable, ESC/outside-click are blocked for the first 500ms (existing `armed` behavior preserved), close `X` works.
7. **Pixel sanity** — `ViewContent` fires once when the socks modal opens; `AddToCart` fires once on accept; no duplicate fires when toggling size/color.

Any failure here gets fixed in a follow-up edit; otherwise we close out the task.

## Technical details

- Files touched: `src/lib/shopify.ts`, `src/components/order/SocksUpsellModal.tsx` only.
- No schema changes, no new dependencies, no changes to insole modal or main product page logic.
- `ShopifyVariant.image` is optional (`| null`) so existing consumers (`findVariant`, `findBundleVariant`, `pickInsoleVariantForSize`) keep compiling without changes.
- The headline string lives inline in `SocksUpsellModal.tsx` — easy to A/B later.
- QA is performed by interacting with the live preview (network panel for FX + checkout payloads, console for pixel events). No automated tests added.
