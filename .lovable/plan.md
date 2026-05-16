# Step 1 — Restore trust strip, drop top timer, paint marquee red

## What's broken in the screenshots

1. The `mt-auto` on the trust strip pushed it to the bottom of the viewport, leaving a giant dead zone between the yellow CTA and the trust line.
2. The top red flash-sale timer is redundant with Step 3's scarcity bar and the user wants it gone.
3. The free-shipping marquee is green/calm — doesn't carry urgency.
4. "Color & size on next step →" was already removed last turn (confirmed in current file).

## The fixes

### 1. Restore trust strip directly under the CTA
In `QuantityStep.tsx`:
- Remove `mt-auto … pt-4` from the trust strip wrapper — change back to `mt-3 flex flex-col items-center gap-2.5`.
- Remove the `flex min-h-[calc(100dvh-7.5rem)] flex-col` on the outer `<section>` and the `flex flex-1 flex-col` on the inner row-pad div — those were the cause of the bottom-anchor stretching. Plain block layout.
- Trust strip now sits ~12px below the CTA, exactly like before the broken pass.

### 2. Remove the top countdown bar
In `OrderPage.tsx`:
- Drop the `<GlobalUrgencyBar />` mount and its import.
- The file `GlobalUrgencyBar.tsx` can stay on disk (Step 3's `ScarcityBar` is the single remaining timer the user wants).

### 3. Make the marquee red + keep only "Free shipping today only"
In `FreeShippingMarquee.tsx`:
- Swap the green tint (`--verified-green` background + text) for a confident red treatment: background `hsl(0_85%_96%)` (soft red wash), text `hsl(0_72%_42%)` (the same red used by `--save`), border `hsl(0_72%_42%/0.2)`.
- Copy stays as today: only "FREE SHIPPING — TODAY ONLY" repeated with sparkle separators. No timer text inside.
- Marquee continues to sit at the very top of the page (above SiteHeader) so it's the first thing the eye lands on.

### 4. Page-fill behavior
Without `min-h` hacks, the natural content height of Step 1 (header + 3 cards + CTA + trust strip + payment badges) fits comfortably on a 390×844 viewport without scroll. The bottom of the white container ends right under the payment badges; the dark page bg shows below — no awkward white void.

## Files touched

- `src/components/order/OrderPage.tsx` — remove `GlobalUrgencyBar` import + mount.
- `src/components/order/QuantityStep.tsx` — drop `min-h` flex-fill wrappers, restore `mt-3` on trust strip.
- `src/components/order/FreeShippingMarquee.tsx` — red color tokens instead of green.

No business logic, Shopify, or pricing changes. Confirmed "Color & size on next step" already removed.
