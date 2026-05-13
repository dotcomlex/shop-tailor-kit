## Goal

Three small, surgical tweaks to `SocksUpsellModal.tsx`:

1. **Remove the "4.9 · 8,900+" star-rating row** at the top right of the hero.
2. **Rewrite the bullets** with smarter, concern-addressing copy pulled from real Armadilo Performance Compression Socks product info — perfect for swollen feet, diabetic-friendly, soft on skin, etc. No "true to your shoe size" line.
3. **Mobile polish pass** — at 390px the modal already fits, but the trust line wraps awkwardly to a 2nd line + the thumbnail row can crowd. Tighten both so the modal looks intentional, not cramped.

No structural rewrites, no new components, no impact on the A/B test wiring.

---

## 1. Remove rating row

Delete the entire stars + "4.9 · 8,900+" block (the `<div className="flex items-center gap-1">` containing the 5 `<Star>` icons and the count `<span>`). The title now sits at the top of the right column — gives the headline more breathing room and removes a fabricated stat we don't want to defend.

## 2. New bullets — concern-led, results-first

Five short, scannable lines, no em-dashes, written to neutralize the top objections customers have when they hesitate on compression socks:

```
Eases swollen feet & tired legs
Diabetic-safe, non-binding cuff
Soft, breathable knit — gentle on sensitive skin
Boosts circulation for all-day energy
Stays put without slipping or pinching
```

Sourced from Armadilo's own product page benefits: graduated 15–20 mmHg, edema/swelling relief, circulation boost, recommended by orthopedists, snug-but-comfortable fit, breathable knit. Every bullet maps to a real customer hesitation (swelling, diabetes safety, skin sensitivity, fatigue, slipping).

Same green-check styling, same `<ul>` markup — only the array content changes.

## 3. Mobile polish (390px)

Specific tweaks after testing the modal at the user's current viewport (390×781):

- **Trust line under CTA**: currently wraps to 2 lines on iPhone 12/13/14. Shorten to `"Free shipping · 60-day money-back · Doctor-recommended"` (drop "materials") so it fits one line at 390px. Keep the `ShieldCheck` icon.
- **Thumbnail row**: switch from `gap-1.5` to `gap-1` and bump from `h-[30px] w-[30px]` to `h-[34px] w-[34px]` so the 4 tiles fill the 170px hero column more cleanly with consistent spacing (currently they leave dead space on the right).
- **Headline**: with the rating row gone, increase `mt-1` to `mt-0` so the title hugs the top of the right column — matches the visual weight of the 170px hero.
- **Sub-headline**: keep `"Built for VitalWalk wearers — fits true to your shoe size."` for now (the user said don't mention TTS in *bullets* — the sub-headline is fine; it answers the unspoken sizing fear without being a selling point).

No layout/dimension changes to the modal shell itself. The existing `max-w-[400px]` + `w-[calc(100%-1rem)]` already handles 390px well.

## Files touched

- `src/components/order/SocksUpsellModal.tsx` — only this file. Three edits: delete rating block, replace `BENEFITS` array, tighten trust line + thumbnail sizing.

## What stays the same

- `UPSELL_PRIMARY = "socks"` flag, all checkout/pixel/Shopify wiring
- Image carousel (4 tiles), color/size pickers, CTA, decline link
- Modal animation, dimensions, top urgency band
- All other files
