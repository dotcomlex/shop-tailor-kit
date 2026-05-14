# Simplify Floating CTA

Strip the sticky checkout bar down to a single floating button. Remove the white background panel, the price stack, and the "Total today" label. Only show it when the user is scrolling **down** past the main CTA — hide it when they scroll back up.

## Changes

**`src/components/order/StickyCheckoutBar.tsx`** — full rewrite of the visual + visibility logic:

1. **Visual** — remove the white background panel, the top fade gradient, the border, and the price stack. Render only the yellow "Complete Order" pill, centered, floating above content with a soft drop shadow. Wrap in safe-area padding so it sits cleanly above the iPhone home indicator.

2. **Visibility logic** — combine two signals:
   - `IntersectionObserver` on `ctaRef` → tracks whether main CTA is offscreen (existing).
   - Scroll direction tracker → only show when user is scrolling **down**. On any upward scroll, hide immediately.
   - Result: visible only when (CTA is offscreen) AND (last scroll was downward). Scrolling back up hides the floating button even if the main CTA is still offscreen.

3. **Props cleanup** — `comparePrice` and `quantity` become unused; keep `total` as optional/ignored or remove entirely. Caller (`UpgradeStep.tsx`) keeps passing them — no breaking change needed, just stop reading them.

## Technical notes

- Floating button: `fixed bottom-4 inset-x-0` with `mx-auto max-w-[260px]`, transparent surrounding area, `pointer-events-none` on the wrapper and `pointer-events-auto` on the button so it doesn't block taps on content beneath it.
- Scroll direction: `useEffect` listening to `window` scroll, comparing `window.scrollY` to a `lastY` ref. Use `requestAnimationFrame` throttling to avoid jank.
- Keep `md:hidden` so this only appears on mobile.
- Keep existing transition (`translate-y-full → translate-y-0`, opacity) for smooth enter/exit.

## Out of scope

No changes to `UpgradeStep.tsx`, the main CTA, or any other component.
