# Plan

## 1. Fix the X (close) button on the Step 2 image zoom dialog

**Root cause (most likely):** `ColorZoomDialog` uses the default shadcn `DialogContent`, whose close button is a tiny 16px white-X icon absolutely positioned over the photo. With `p-0` and an edge-to-edge product image, the X often blends into the shoe and the tap target is too small on mobile — so taps land on the image (no action) instead of the close button. Functionally `onOpenChange` is wired correctly, which matches your symptom of "sometimes works, sometimes doesn't."

**Change (visual/UX only, `src/components/order/ColorZoomDialog.tsx`):**
- Hide the default tiny X by giving DialogContent a wrapper, and add our own close button:
  - Bigger tap target (44×44, well above iOS 44pt minimum)
  - Solid contrast pill: dark/translucent background with white X icon so it's always visible on any shoe color
  - Positioned `top-3 right-3`, `z-50`, `pointer-events-auto`
  - Uses `DialogClose` from `@/components/ui/dialog` (so it always triggers `onOpenChange(false)` → resets `zoom` state)
- Also add a `Close` overlay tap zone: clicking the dark area around the image already closes the dialog (Radix default), keep that intact.
- Add `aria-label="Close"` for a11y.

No other files touched, no logic changes elsewhere.

## 2. Full multi-currency funnel QA (US, UK, CA)

I'll act as a customer end-to-end in the live preview, using the browser tool. For each market I'll:
1. Open the site (US default first, then simulate UK & CA — note: Shopify markets switch via cart context; I'll confirm what's actually currency-driven vs hardcoded).
2. **Step 1 (Quantity)** — verify prices, "Total" lines, savings math, and currency symbol/code match the active currency.
3. **Step 2 (Color + Size)** — verify variant pricing updates, swatches load, size chart correct, zoom dialog opens and **X reliably closes** (the fix above).
4. **Step 3 (Upgrade / extras)** — verify add-ons reflect correct currency and totals recalculate cleanly.
5. **Sticky checkout bar / Order Summary** — totals, currency, line items consistent.
6. **Complete Order → Upsell modal**:
   - Decline path → cart proceeds to Shopify checkout **without** upsell items (as you confirmed last turn).
   - Accept path → upsell items added, redirect to Shopify checkout.
7. **Shopify checkout handoff** — verify `checkoutUrl` opens, `channel=online_store` param present, correct currency shown on Shopify's side, no lag/flicker, no double-add of upsell on decline.
8. Repeat for UK and CA where currency switching is supported.

I'll capture screenshots at each step and report:
- ✅ what's perfect
- ⚠️ any inconsistency (price mismatch, wrong currency, lag, stuck state, broken close, etc.)
- 🛠 a follow-up fix list if anything fails — no code changes outside of #1 without your approval.

## Out of scope
- No copy/content changes on Step 1 (your earlier "forget it" still stands).
- No business-logic changes to upsell behavior (already correct).
- No design system / color token changes.

## Files touched
- `src/components/order/ColorZoomDialog.tsx` (only file edited)
