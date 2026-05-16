# Plan

## What I’ll change

1. **Remove the fake empty white space under Step 1**
   - Adjust the page shell in `src/components/order/OrderPage.tsx` so the first-step view no longer stretches to fill the viewport with a large blank white block.
   - Keep the footer natural instead of visually forcing a big white panel above it on mobile.

2. **Keep Step 2 completely hidden on first load**
   - Preserve the current conditional rendering for Step 2 and Step 3.
   - Tighten the layout around the Step 2/Step 3 wrapper containers so they don’t reserve visible space before the user advances.

3. **Make Step 1 fill the phone screen more appropriately**
   - Rebalance vertical spacing in `src/components/order/QuantityStep.tsx` so the bundle cards, CTA, trust row, and payment badges sit comfortably within the phone viewport.
   - Keep the trust strip directly under the CTA, not detached lower on the page.
   - Reduce the feeling of the content being cramped at the top while avoiding extra scroll on Step 1.

4. **Restyle the top marquee to strong red with white content**
   - Update `src/components/order/FreeShippingMarquee.tsx` to use a stronger red background with white text and white icons for better visibility.
   - Keep the message simple: free shipping / today only, without adding more urgency clutter.

## Files involved

- `src/components/order/OrderPage.tsx`
- `src/components/order/QuantityStep.tsx`
- `src/components/order/FreeShippingMarquee.tsx`

## Expected result

- On initial load, users see only Step 1.
- The bottom of the page no longer has a large empty white area.
- The trust elements stay right below the yellow CTA.
- The top shipping strip reads clearly in red with white icon/text.
- Step 1 feels cleaner, better balanced, and more “full-screen mobile” without looking crowded.

## Technical details

- The main issue appears to be the outer page shell using a full-height flex layout (`min-h-[100dvh]` + `flex-1`) that visually stretches the Step 1 surface even when later steps are hidden.
- I’ll remove or relax the height/stretch behavior only where needed so Step 3 and footer behavior don’t regress.
- I’ll keep the existing step-state logic intact and limit the work to presentation/layout changes only.