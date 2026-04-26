# Plan: Unisex Sizing Clarity + Sticky Checkout CTA

Two improvements aimed at male shoppers' confidence and conversion at the bottom of Step 3.

---

## 1. Make the unisex/men's sizing obvious

**Problem:** The current size tiles show a big number (US Women's by default) with a tiny `M 6.5` underneath. A man scanning quickly may not realize these shoes fit him too, or which size to pick.

### Changes

**`src/components/order/SizeTileGrid.tsx`**
- Add a **dual-label tile layout** that gives equal visual weight to Women's and Men's sizing (instead of one big primary number).
  - Top row: `W 8` (women's badge in soft pink/neutral)
  - Bottom row: `M 6.5` (men's badge in soft blue/neutral)
  - Both shown in tabular-nums, same font weight, separated by a thin divider
- Update the confirmation strip to read: `✓ Selected: Women's 8 · Men's 6.5 · EU 38.5 · UK 6`
- For UK/EU/AU regions: keep the regional size as the headline but still show **both W & M** sub-labels so men recognize their fit.

**`src/components/order/ColorSizeStep.tsx`**
- Above the size grid, add a small **"Unisex Fit" badge row**:
  - Pill: `👟 Unisex — fits Men & Women`
  - Helper text: `Men: order ~1.5 sizes down from your usual men's size` (matches industry standard W→M conversion)
- Place it between the "Size" label and the `SizeTileGrid`.

**`src/components/order/QuantityStep.tsx`** (light touch)
- Add a tiny `Unisex` chip near the product title/bundle copy so the unisex nature is established BEFORE size selection — not just discovered there. *(Will confirm exact placement when reading the file in implementation.)*

---

## 2. Sticky "Complete My Order" CTA on Step 3

**Problem:** Step 3 now contains the order summary, shipping protection, guarantee, ~6 reviews, and a 6-item FAQ. Users who scroll down to read reviews/FAQs have to scroll back up to checkout — friction at the highest-intent moment.

### Changes

**New component: `src/components/order/StickyCheckoutBar.tsx`**
- Fixed position at bottom of viewport: `fixed bottom-0 inset-x-0 z-40`
- Backdrop: white with subtle blur (`bg-background/95 backdrop-blur-md`) and top border/shadow for separation
- Layout (mobile-first, single row):
  - Left: compact total — `Total: $XX.XX` with strikethrough compare price beneath in tiny text
  - Right: shrunk `YellowCta` variant — `Complete Order →` (40-44px tall, not 60px)
- Includes a tiny `🔒 Secure checkout` microline above the button on slightly taller screens (optional)
- Safe-area inset padding (`pb-[env(safe-area-inset-bottom)]`) so it sits above iOS home bar

**Visibility rules (smart, not annoying):**
- Only renders when `currentStep === 3`
- Uses an `IntersectionObserver` on the main "Complete My Order" CTA — sticky bar appears ONLY when the main CTA is scrolled OUT of view (so we don't double up two buttons on screen)
- Slides in/out with `translate-y-full` ↔ `translate-y-0` transition for polish
- Hidden on `md:hidden` for desktop (desktop users see the full page without thumb-reach concerns) — *(or kept on all sizes; will go with mobile-only by default since this is a mobile conversion concern)*

**`src/components/order/UpgradeStep.tsx`**
- Mount `<StickyCheckoutBar />` at the end of the section, passing `total`, `comparePrice`, `onCheckout`, `isCheckingOut`, and a ref to the main CTA so the bar can observe its visibility.
- Add bottom padding to the page container so the sticky bar never covers the FAQ's last item.

**`src/components/order/OrderPage.tsx`** (minor)
- Add `pb-[80px] md:pb-16` to the `<main>` when on step 3, so content can scroll past the sticky bar.

---

## Files to be created / modified

**New:**
- `src/components/order/StickyCheckoutBar.tsx`

**Modified:**
- `src/components/order/SizeTileGrid.tsx` — dual W/M tile labels + updated confirmation strip
- `src/components/order/ColorSizeStep.tsx` — unisex fit badge above size grid
- `src/components/order/QuantityStep.tsx` — small unisex chip near product copy
- `src/components/order/UpgradeStep.tsx` — mount sticky bar, pass refs/props
- `src/components/order/OrderPage.tsx` — extra bottom padding on step 3

No data/schema changes. No new dependencies (uses native `IntersectionObserver`).

---

## Why this works
- **Men feel seen** the moment they hit Step 2 — no squinting at a tiny "M 6.5" caption.
- **Sticky CTA removes scroll friction** at peak intent, while the IntersectionObserver prevents a redundant double-CTA when the main button is already visible.
- Both changes are **conversion-focused, mobile-first**, and stay consistent with the existing brand tokens (yellow CTA, forest green accents, rounded pills).