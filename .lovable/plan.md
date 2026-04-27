## Goal
Eliminate the empty white area on the live mobile site (visible after the yellow CTA) and restore the small footer line, while keeping the clean Step 1 layout the preview already shows.

## Root cause
In `src/components/order/OrderPage.tsx` the page shell is `flex min-h-screen flex-col` with `<main className="flex-1 ...">`. On iOS Safari `min-h-screen` resolves to `100vh`, which equals the *largest* viewport (URL bar collapsed). On initial load the actual visible viewport is shorter, so:
- The document is taller than what is visible → the user can scroll.
- `flex-1` makes `<main>` stretch to fill that 100vh → a tall blank area appears under the CTA.
- The footer is currently hidden on mobile during Step 1, so there is nothing visible at the bottom — just white space.

This does not show up in the Lovable preview iframe because the preview has no collapsible URL bar.

## Plan

### 1. Stop forcing the page to fill 100vh on Step 1
In `src/components/order/OrderPage.tsx`:
- Remove `min-h-screen flex flex-col` from the outer wrapper.
- Remove `flex-1` from `<main>`.
- Result: document height = header + step content + footer. No artificial stretch, no blank gap.

### 2. Restore the small footer on all steps (mobile + desktop)
In `src/components/order/OrderPage.tsx`:
- Remove the `isLanding ? "hidden md:block" : "block"` toggle.
- Always render the `© {year} VitalWalk. All rights reserved.` line.
- Keep the existing tight padding (`py-5`) so it stays a thin line, matching the aesthetic the user liked.

### 3. Keep mobile spacing exactly as it looks in the preview
No changes to `SiteHeader.tsx`, `StepHeader.tsx`, `QuantityStep.tsx`, or `BundleThumb.tsx`. These already produce the layout the user described as “looks perfect here on the preview.”

### 4. Verify on a real iPhone-sized viewport
After implementation, on 390×844:
- No blank white area under the yellow CTA.
- The thin `© 2026 VitalWalk. All rights reserved.` line sits directly below the CTA at the natural end of the content.
- Minor scroll caused by mobile Safari URL-bar behavior is acceptable, but no large empty region exists.
- Step 2 and Step 3 still look correct (they use longer padding and aren’t affected by removing the flex stretch).

## Files touched
- `src/components/order/OrderPage.tsx` (only file changed)

## Notes
- Intentionally NOT re-introducing viewport hacks (`100dvh`/`100svh`) — letting content drive height is the most reliable way to avoid a blank gap on iOS Safari.
- The thin footer strip preserves the preferred aesthetic while ensuring something fills the bottom of the screen instead of empty white.