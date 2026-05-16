# Plan

## Exact issue
On the real iPhone screenshot, the extra white area is not coming from the footer text itself. The problem is the step-1 page shell: on mobile Safari, the page is not using the available viewport height consistently, so the remaining height shows up as blank space below the footer.

## Files to adjust
- `src/components/order/OrderPage.tsx`
- `src/components/order/QuantityStep.tsx`
- `src/index.css` only if a small viewport-height utility is needed for iPhone-safe behavior

## What I’ll change
1. Fix the step-1 layout shell so the page fills the visible mobile viewport correctly and the footer sits flush at the bottom instead of floating above empty space.
2. Keep Step 2 and Step 3 fully hidden on first load with no reserved space.
3. If extra height exists on taller phones, distribute it inside Step 1 in a controlled way so it helps the quantity section breathe instead of creating a dead white block under the footer.
4. Leave the red top marquee alone unless the final check shows a real visibility regression.

## Technical details
- Use an iPhone-safe viewport-height approach (`svh` / safe-area-aware layout) for the first-step shell.
- Keep the footer in the normal flow, but make the wrapper and main area own the extra height correctly.
- Avoid reintroducing the earlier issue where trust elements get pushed too far down or Step 1 becomes scroll-heavy.
- No pricing, step logic, Shopify, or checkout changes.

## Validation
- Re-check the 390×844 mobile preview.
- Confirm there is no visible empty white block below the footer on Step 1.
- Confirm the CTA, trust row, and footer still feel balanced and readable without exposing Step 2 on initial load.