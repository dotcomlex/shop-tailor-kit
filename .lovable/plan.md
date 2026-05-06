## Goal

Make the bottom of Step 3 feel intentional. Today on mobile:

- The sticky checkout bar floats over the footer and big empty whitespace at the bottom of the page (`pb-32` clearance + the bar's own height).
- The bar's price block has uneven gaps and no trust microline, so it reads as "stuck on" rather than designed.
- There's no graceful exit — the bar stays visible even after the user has scrolled past all real content.

## Fixes

### 1. Auto-hide the sticky bar at the end of the page
Add a hide-when-footer-visible behavior using a second IntersectionObserver in `StickyCheckoutBar.tsx`. New optional `hideAtRef` prop tracks the footer (or end sentinel). Bar is visible only when:
- Main in-page CTA is off-screen, AND
- Footer/end sentinel is NOT yet in the viewport

Wire it from `OrderPage.tsx` by passing the existing footer ref (or adding one).

### 2. Reduce wasted bottom padding
Change Step 3 wrapper in `OrderPage.tsx` from `pb-32` to `pb-24` on mobile (the bar is ~78px tall + safe-area; 96px clearance is plenty and removes the awkward empty band above the footer).

### 3. Refine the sticky bar visual
Rebuild `StickyCheckoutBar.tsx` layout:

- **Single tighter row**: price block (compare strike inline with total, "Total · Free shipping" caption beneath) + yellow CTA with a lock icon.
- **Trust microline below** ("Secure SSL checkout · 60-day guarantee · You save $X") — replaces the previous awkward whitespace and reinforces the value prop right at the tap point.
- Softer entry: longer fade gradient (h-6 instead of h-4), opacity transition added to the slide.
- Stronger but more diffuse shadow so the bar sits cleanly above content without a hard line.
- Remove the vertical hairline divider — the spacing alone separates the two zones cleanly now.

### 4. No price/logic changes
Pricing math, currency formatting, checkout flow, upsell, pixels — all untouched.

## Files

- `src/components/order/StickyCheckoutBar.tsx` — rebuild layout, add `hideAtRef` prop + observer, integrated trust microline.
- `src/components/order/UpgradeStep.tsx` — pass a footer/end ref through to `StickyCheckoutBar`.
- `src/components/order/OrderPage.tsx` — reduce mobile bottom padding from `pb-32` to `pb-24`; if simplest, add an end-of-content sentinel `<div ref={endRef} />` right before the footer and pass it down. Otherwise reuse the footer's own ref.

## Result

- Sticky bar appears once the user scrolls past the in-page CTA.
- Bar shows a clean price + lock-icon CTA + trust microline.
- Bar gracefully fades + slides away once the footer enters view, so the bottom of the page no longer has a floating element over empty space.
- Less dead scroll between the trust blocks and the page bottom.