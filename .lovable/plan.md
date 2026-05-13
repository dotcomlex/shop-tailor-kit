## Goal

Four small fixes to `SocksUpsellModal.tsx` (+ two compressed assets):

1. **Show the new 3-pair variant images** (Black + White) you just uploaded.
2. **Simplify size hints to men's-only** (US M) — no awkward W/UK mix.
3. **Remove** the "Built for VitalWalk wearers — fits true to your shoe size." sub-headline.
4. **Remove** the "🦶 Best paired with your VitalWalks · One-time bonus" reassurance line.

---

## 1. Use the new 3-pair pack shots locally (no Shopify edit)

The Shopify product currently has 2-pair photos assigned to the variants (`128.jpg` for Black, `130_*.jpg` for White), and there's no Shopify image-upload tool wired into this workspace. Cleanest path: override the variant pack shot **at the modal layer** with the two images you just uploaded.

- Compress and commit:
  - `src/assets/socks/pack-black.webp` (from `hf_…6fa39398-…-2.png`)
  - `src/assets/socks/pack-white.webp` (from `hf_…3e7b0013-…-2.png`)
  - WebP, ~1000px wide, q75 → ~50–80 KB each
- In `SocksUpsellModal.tsx`, replace the `socksImageForColor(product, color)` lookup that builds the gallery's first slide with a small local map keyed by color:
  ```ts
  const PACK_IMAGE: Record<string, string> = {
    Black: packBlack,
    White: packWhite,
  };
  ```
  Fall back to the existing `socksImageForColor(...)?.url` if a future color (e.g. Nude) shows up that we haven't shipped a local shot for.
- The thumbnail + hero already react to `color` and `colorTouched` via `setActiveImg(0)` — no other wiring changes.
- No Shopify product mutation. Cart/checkout still pulls the right variant by ID; only the visual is local.

Note: the Shopify product title already says "3 Pairs - Wide Compression Socks" and the CTA already reads "Yes, Add 3 Pairs for $X" — both stay.

## 2. Men's-only size hints

In `SIZE_HINTS`:
```ts
const SIZE_HINTS: Record<SocksSizeBucket, string> = {
  "S/M": "US M 5–7.5",
  "L/XL": "US M 8–14",
};
```
Also update the small caption next to the "Size" label from `"Matched to your shoe size"` to `"Men's US"` so the system label is unambiguous. Bucket selection logic (`pickSocksVariant`, `socksBucketFromShoeSize`) is unchanged — it's just the display text.

## 3. Remove sub-headline

Delete the `<p>` immediately under the title:
```
Built for VitalWalk wearers — fits true to your shoe size.
```
Title sits cleanly above the price block. No spacing tweaks needed — the price already has `mt-1.5`.

## 4. Remove "Best paired" reassurance line

Delete the centered `<p>` between the color picker and the savings line:
```
🦶 Best paired with your VitalWalks · One-time bonus
```
The savings line + CTA naturally take its place; gives more vertical breathing room on mobile.

---

## Files touched

- `src/components/order/SocksUpsellModal.tsx` — local image map for first gallery slide, simplified `SIZE_HINTS`, two text deletions
- `src/assets/socks/pack-black.webp` (new)
- `src/assets/socks/pack-white.webp` (new)

## What stays the same

- A/B test flag (`UPSELL_PRIMARY = "socks"`), checkout/Shopify wiring, pixel events
- 4-tile gallery (3-pair pack shot + 3 lifestyle images), color/size pickers, CTA, decline link, trust line, modal animation/dimensions
