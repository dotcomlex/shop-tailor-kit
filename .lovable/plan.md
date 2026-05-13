# Socks modal — image default, header overflow, size matching

## 1. Default hero = the benefits/lifestyle image, swap on color tap

Right now the modal opens with a color preselected (Black), so `socksImageForColor` immediately picks the plain Black product photo instead of the original lifestyle/benefits hero.

Fix in `SocksUpsellModal.tsx`:
- Add a `colorTouched` boolean state, reset to `false` every time the modal opens.
- Set it to `true` in the color-pill click handler.
- Hero image source:
  - `colorTouched === false` → `product.images[0]` (the benefits/lifestyle shot, same as before).
  - `colorTouched === true`  → `socksImageForColor(product, color)`.
- Cart variant logic stays unchanged — `pickSocksVariant` still uses the preselected color so the Yes button works on first tap.
- Keep the `key={color}`-driven fade so the swap still feels intentional.

## 2. Header getting cut off

The close `X` is absolutely positioned over a single-line, wide-tracked headline, which clips on 360–390px viewports.

Fix in the cream top band:
- Wrap headline in a flex container with `pr-8` so text never reaches under the `X`.
- Allow the headline to wrap to 2 lines on narrow screens (`whitespace-normal text-center leading-tight`).
- Tighten copy slightly to keep one line on most phones: **"LAST-CHANCE OFFER · ENDS NOW"** (drops the long "Won't be shown again" tail; same urgency, half the width).
- Reduce tracking from `0.14em` → `0.1em` for breathing room.

## 3. Will sizes match for UK / EU customers?

Quick audit:
- The **main shoe selector** only exposes sizes formatted like `"US W 9 / US M 8 / UK 7"` — there is no EU axis on the product in Shopify, so EU never enters the funnel.
- `socksBucketFromShoeSize` already parses **US W**, **US M**, and **UK** tokens (`parseSizeTokens` in `shopify.ts`) and buckets them with the correct thresholds matching Shopify's variant labels:
  - S/M = US W ≤ 8 | US M ≤ 7.5 | UK ≤ 6.5
  - L/XL = above those
- So **UK shoppers are auto-matched correctly** as long as they pick a size on the shoe step (which is required before reaching the upsell).
- **EU is N/A today** because the shoe product itself doesn't offer EU sizing. If you want EU shown to customers later, that's a change on the main product variants in Shopify (and we'd add an `eu` token to `parseSizeTokens` + thresholds in `socksBucketFromShoeSize`). Out of scope unless you ask.

No code change needed for #3 — flagging it as verified.

## Technical details

- Files touched: `src/components/order/SocksUpsellModal.tsx` only.
- No Shopify queries change. No insole/main flow change.
- After edits: visual check at 360px, 390px, 414px viewports + click through Black ↔ White to confirm the hero swaps only after the first color tap.
