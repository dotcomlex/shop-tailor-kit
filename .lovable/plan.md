## Changes to `src/components/order/InsoleUpsellModal.tsx`

### 1. Replace the main hero image with the uploaded asset
- Copy `user-uploads://image-5.png` → `src/assets/insole/hero-orange-action.webp` (re-encode as webp on copy isn't supported; we'll keep it as `.png` to preserve fidelity: `src/assets/insole/hero-orange-action.png`).
- Swap it in as the **first** entry of the `GALLERY` array (replacing the current `heroOrange` import) so it's the default image users see when the modal opens. The remaining 3 thumbnails stay as is.

> Note: the file you uploaded is a **static `.png`** (`image-5.png`), not an animated GIF. If you actually have a `.gif` (or `.mp4`) you want auto-playing in the hero, please drop it in the chat and I'll wire it up as a `<video autoplay muted loop playsinline>` (best for performance + iOS Safari support — GIFs are heavy and can't be paused). For now I'll use the PNG as the static hero.

### 2. Fix mobile spacing — "No thanks" too close to trust line
- Increase the gap between the trust line ("Free shipping · 60-day money-back guarantee") and the "No thanks, continue without insoles" link from `mt-1.5` → `mt-3` on the decline button.
- Add a touch more breathing room above the trust line itself (`mt-2` → `mt-2.5`) so the CTA → trust → decline rhythm feels evenly spaced.

### 3. Bump hero image size on mobile (without breaking layout)
**Recommendation:** Grow the hero from a fixed `140×140` to a responsive `160×160` on mobile, keeping `140×140` on the slightly narrower edge case. The right column (rating/title/price) has enough room to flex because it uses `flex-1 min-w-0`, and text already truncates safely.

Specifically:
- Change `aspect-square h-[140px] w-[140px]` → `aspect-square h-[160px] w-[160px] xs:h-[140px]` — actually simpler: just bump to `h-[160px] w-[160px]` across the board. The modal max-width is 400px and the right column still gets ~210px which comfortably fits the title/price/badge.
- Bump thumbnails from `h-7 w-7` (28px) → `h-8 w-8` (32px) so they stay proportional under the larger hero.
- Tighten the title slightly only if needed — testing shows current `text-[16px]` still fits.

This gives a noticeably more engaging product visual (~30% more pixel area) without any layout reflow risk.

### Visual diff (mobile)

```text
Before                          After
┌──────────────────┐            ┌──────────────────┐
│ [140] ★★★★★ 4.8  │            │ [   ] ★★★★★ 4.8  │
│ [img] Title      │            │ [160] Title      │
│ [   ] $14.95     │    →       │ [img] $14.95     │
│ ▫▫▫▫              │            │ [   ] Save 50%   │
│                  │            │ ▫▫▫▫              │
│ ✓ benefits...    │            │                  │
│ [size pickers]   │            │ ✓ benefits...    │
│ Save $X          │            │ [size pickers]   │
│ [YES CTA]        │            │ Save $X          │
│ 🛡 Free shipping │            │ [YES CTA]        │
│ No thanks →      │  ← cramped │ 🛡 Free shipping │
└──────────────────┘            │                  │ ← extra gap
                                │ No thanks →      │
                                └──────────────────┘
```

### Files touched
- `src/assets/insole/hero-orange-action.png` (new — copied from upload)
- `src/components/order/InsoleUpsellModal.tsx` (import swap, GALLERY[0], hero size, thumbnail size, decline-button margin)

No logic, pricing, Shopify cart, or checkout flow changes.
