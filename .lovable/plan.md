# Bigger swatches, tighter grid, instant loading

## 1. Bigger swatches — `ColorSwatch.tsx`
Bump diameter:
- Mobile: `h-[108px] w-[108px]` → `h-[140px] w-[140px]`
- Desktop (`sm:`): `h-[132px] w-[132px]` → `h-[160px] w-[160px]`

Slightly larger zoom-trigger icon (`h-7 w-7` → `h-8 w-8`) so it stays proportional.

## 2. Tighter 2×2 grid — `ColorSizeStep.tsx`
Drop the gap further on mobile: `gap-2 sm:gap-3` → `gap-1 sm:gap-2`. Combined with bigger circles, the white space between them collapses to a clean, dense block.

## 3. Kill the load lag

**Step 2 paint** — `ColorSwatch.tsx`:
- Switch swatch `<img>` from `loading="lazy"` to `loading="eager"` and add `fetchpriority="high"` so the four photos paint immediately when Step 2 mounts (they're tiny — 320px Shopify-resized JPGs).

**Zoom instant-open** — new tiny effect in `ColorSizeStep.tsx`:
- On mount, fire-and-forget preload of every color's 1200px zoom image via `new Image(); img.src = imageForColor(c, 1200)`. By the time the user taps the magnifier, the high-res file is in the browser cache → dialog opens with no flash.

No design changes elsewhere. No new deps.

## Files
- `src/components/order/ColorSwatch.tsx` — sizes + eager loading + larger zoom icon
- `src/components/order/ColorSizeStep.tsx` — tighter gap + preload effect for zoom-size images
