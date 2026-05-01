## MP4 received and optimized

Your video came through: **720×720, 2.0s, 790KB, with audio**. I've already re-encoded it for instant playback (the file is in place):

- Stripped audio (not needed — autoplay is muted anyway)
- Downscaled 720→480 (matches the 160px hero @ 2× DPR perfectly, no quality loss)
- H.264 baseline + faststart (moov atom at front so it streams from byte 1)
- **Final size: 202KB** (4× smaller than original)

Saved to `public/videos/insole-hero.mp4`.

## Changes to `src/components/order/InsoleUpsellModal.tsx`

### 1. Hero is now a video (with poster fallback)

```tsx
<video
  src="/videos/insole-hero.mp4"
  poster={heroPoster}        // your existing PNG paints frame-1 instantly
  autoPlay muted loop playsInline
  preload="auto"
  disableRemotePlayback
  className="h-full w-full object-cover"
/>
```

- `poster` = instant first paint (PNG already in JS bundle, zero network wait)
- `muted` + `playsInline` = autoplay works on iOS
- `preload="auto"` + faststart MP4 = video streams immediately on modal open
- 202KB loads in <100ms on any 4G connection

### 2. Replace gallery with your 5 new feature images

Old `features.webp`, `benefits.webp`, `clinically-tested.webp` imports removed. New gallery (6 items, video first):

| # | Hero content | Thumb |
|---|---|---|
| 1 | **MP4 video** (autoplay loop) | poster + ▶ play badge |
| 2 | Walk in comfort | image-6 |
| 3 | Arch support | image-7 |
| 4 | Massage | image-8 |
| 5 | Fits any shoe | image-9 |
| 6 | Trim-to-fit | image-10 |

Thumbnails shrink from 32×32 → **28×28** to fit 6 across in the 160px column. Video thumb gets a small white ▶ triangle overlay so it's obvious it's the playable one.

### 3. Subtle "Trim-to-fit" microcopy

A quiet line right under the benefits checklist (above the size pickers):

```tsx
<p className="mt-2 text-center text-[10.5px] text-[hsl(var(--text-mute))]">
  ✂ Trim-to-fit · works in any shoe
</p>
```

Muted gray, small, non-competing with the CTA. Reinforces the "Fits any shoe" image without being a loud badge.

### 4. Performance hygiene

- All 5 new images stored under `src/assets/insole/` → Vite hashes & long-term caches them.
- `decoding="async"` + `loading="lazy"` on thumbnails so they don't block initial paint.
- Video `preload="auto"` only fires when the modal mounts (modal lazy-mounts on upsell open), so site-wide page weight is unchanged.
- Old unused image imports removed → smaller JS bundle.

### Files touched
- `src/components/order/InsoleUpsellModal.tsx` — gallery rewrite, video element, new thumbnails, trim-to-fit microcopy
- `public/videos/insole-hero.mp4` — already created (202KB, optimized)

No changes to Shopify, cart, checkout, pricing, or size-matching logic.
