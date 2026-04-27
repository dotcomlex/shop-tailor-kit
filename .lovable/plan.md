## Goal
Restore a clean, premium mobile landing view without the cramped look, while still preventing annoying first-screen scrolling. Also simplify the final checkout step by removing the savings promo panel.

## Plan

### 1. Rebalance Step 1 mobile spacing instead of over-compressing it
Update the mobile layout so it feels closer to the earlier, cleaner version:
- In `src/components/order/SiteHeader.tsx`, restore a bit more vertical breathing room and logo presence on mobile.
- In `src/components/order/StepHeader.tsx`, loosen the title/sub-strip padding slightly so the section header doesn’t feel jammed against the top.
- In `src/components/order/QuantityStep.tsx`, roll back the most aggressive spacing cuts:
  - slightly more space above the pill, between cards, and above the CTA
  - slightly roomier card padding/gaps where it does not cause overflow
- In `src/components/order/BundleThumb.tsx`, increase the mobile thumbnail size modestly so the cards look less compressed.

This keeps the readability gains, but removes the “crammed up” feel.

### 2. Fix the real cause of the landing scroll / white-space issue
Instead of forcing everything to fit by shrinking the UI, fix the page shell on mobile Step 1:
- In `src/components/order/OrderPage.tsx`, add step-aware mobile spacing so Step 1 does not carry the same bottom padding as later steps.
- Prevent the footer from creating extra scroll/blank area on the initial mobile landing state.
  - Hide or defer the footer on mobile while `currentStep === 1`
  - Keep it visible on later steps and desktop
- Adjust the top/bottom shell spacing so the first screen ends naturally around the CTA rather than feeling pushed into the header or leaving dead space below.

This preserves aesthetics while removing the immediate up/down scroll problem on arrival.

### 3. Simplify Step 3
Remove the savings-heavy promo treatment from the final review step:
- In `src/components/order/UpgradeStep.tsx`, remove the `SavingsHero` block entirely.
- In `src/components/order/OrderSummary.tsx`, remove the extra “You saved” row so the summary is cleaner.
- In `src/components/order/StickyCheckoutBar.tsx`, remove the savings line there too, leaving just the key total + CTA.

Result: Step 3 becomes cleaner and more checkout-focused.

### 4. Verify mobile behavior after implementation
After approval and implementation:
- Check Step 1 on mobile widths against the screenshot issue
- Confirm the landing view no longer feels cramped
- Confirm there is no extra blank white area / unnecessary initial scroll on landing
- Confirm Step 3 no longer shows the “You’re saving X amount today” section or other extra savings callouts

## Technical details
- Files likely touched:
  - `src/components/order/OrderPage.tsx`
  - `src/components/order/SiteHeader.tsx`
  - `src/components/order/StepHeader.tsx`
  - `src/components/order/QuantityStep.tsx`
  - `src/components/order/BundleThumb.tsx`
  - `src/components/order/UpgradeStep.tsx`
  - `src/components/order/OrderSummary.tsx`
  - `src/components/order/StickyCheckoutBar.tsx`
- Main design change: fix viewport/layout behavior first, then tune spacing. Do not solve this by squeezing typography or card content further.