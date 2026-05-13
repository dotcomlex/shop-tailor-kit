## Goal

Two tweaks to the socks upsell modal — keep it the position #1 A/B test offer, just make it stronger:

1. **Punchier benefits** — kill the em-dashes, lead with results not specs.
2. **Image carousel** — same pattern as the insole modal (left-side hero + thumbnail row), using the 3 lifestyle/social-proof images you uploaded, plus the existing variant pack shots.

All assets compressed to WebP and lazy-loaded so nothing slows the funnel.

---

## 1. Bullet copy — results-first

Replace the current 5 long em-dashed lines with 5 short punchy ones:

```
Stops swelling fast
Safe for diabetics & sensitive skin
All-day comfort, zero pinching
Stays fresh, fights odor
True to your shoe size
```

Same green check styling, same list. No structural change.

## 2. Image carousel (mirrors insole modal)

In `SocksUpsellModal.tsx`, replace the single hero image with the same gallery pattern used in `InsoleUpsellModal.tsx`:

- Left-column **170×170 hero** image, swappable
- Row of **6 thumbnails** (~26×26) below it, click to swap
- Hero animates a soft fade on swap (same `animate-in fade-in-0` already in the file)

**Gallery sources (in order):**
1. Variant pack-shot — currently `socksImageForColor(product, color)` (the new 3-pairs Shopify image you just updated). Stays color-reactive: when user picks Black/White, this thumb + hero updates.
2. `lifestyle-feet.webp` — the white-socks-on-feet "compression / antimicrobial / soft" infographic
3. `lifestyle-reduces.webp` — the black-socks "Reduces swelling & discomfort" shot
4. `lifestyle-elle.webp` — the ELLE quote / "trusted by 50,000+ people" shot

That's a 4-tile gallery (1 product + 3 lifestyle), which fits the 170px column comfortably with the same thumb sizing as the insole modal — no layout overflow.

Color picker behavior unchanged. If the user taps a color swatch, hero jumps back to the matching variant pack-shot (keeps existing `colorTouched` logic).

## 3. Asset pipeline (fast loads)

The 3 uploaded PNGs are ~1024×1024 and unoptimized. Process once at build time, commit small WebPs:

- Copy the 3 uploads to `/tmp`, run sharp/imagemagick to produce `1000w` WebP at quality 75 (~60–90 KB each, down from ~1 MB)
- Save to `src/assets/socks/lifestyle-feet.webp`, `lifestyle-reduces.webp`, `lifestyle-elle.webp`
- Import as ES modules (Vite hashes + serves with long cache)
- Hero image: `loading="eager"` + `decoding="async"` (above-the-fold once modal opens)
- Thumbnails: `loading="lazy"` + `decoding="async"` (same as insole modal)

No runtime image processing, no new deps.

## 4. What stays the same

- Modal layout, dimensions, animation, CTA, trust line, decline link — untouched
- Size selector, color selector, price block, savings badge — untouched
- `UPSELL_PRIMARY = "socks"` flag in `OrderPage.tsx` — untouched
- Pixel events, checkout flow, Shopify wiring — untouched

## Files touched

- `src/components/order/SocksUpsellModal.tsx` — new BENEFITS copy + GALLERY array + thumbnail row JSX (copied pattern from `InsoleUpsellModal.tsx`)
- `src/assets/socks/lifestyle-feet.webp` (new, compressed from `image-11.png`)
- `src/assets/socks/lifestyle-reduces.webp` (new, compressed from `image-12.png`)
- `src/assets/socks/lifestyle-elle.webp` (new, compressed from `image-13.png`)

No other files. One-line revert path (flip `UPSELL_PRIMARY` back to `"insoles"`) still intact.
