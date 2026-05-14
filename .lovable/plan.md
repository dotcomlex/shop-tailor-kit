# Sticky CTA Visibility, Simpler Bar, Priority Color Fix, FAQ Updates

## 1. Sticky checkout bar — make it visible during reviews + FAQ scroll
Today the sticky bar only appears after a sentinel placed *below* the FAQ block intersects, so it's hidden the entire time customers read reviews and FAQs. Switch the trigger so the bar slides in **as soon as the main "Complete My Order" CTA leaves the viewport** (i.e., the moment the customer scrolls past it).

**Files:**
- `src/components/order/UpgradeStep.tsx`
  - Add a `ctaRef = useRef<HTMLDivElement>(null)` and wrap the `<YellowCta>` in a `<div ref={ctaRef}>`.
  - Pass `ctaRef` to `<StickyCheckoutBar />` (replacing the now-unused `showAtRef` sentinel).
  - Remove the bottom sentinel `<div ref={showAtRef} ... />`.
- `src/components/order/StickyCheckoutBar.tsx`
  - Rename prop to `ctaRef`. Observe with `IntersectionObserver`; set `visible = !entry.isIntersecting`. Use `threshold: 0` and `rootMargin: "0px 0px 0px 0px"` so the bar appears the moment the CTA scrolls offscreen and hides again when it's back in view.

## 2. Simplify the sticky bar content
The current sticky bar repeats SSL + 60-day + savings — info already shown above. Strip it down so it reads as a quick-action bar, not a second checkout summary.

**File:** `src/components/order/StickyCheckoutBar.tsx`
- Keep: price (with strike-through compare) + the yellow "Complete Order" button.
- Below price: replace the uppercase `TOTAL · SECURE CHECKOUT` line with a single quiet line `Total today` (12px, muted, sentence case). Drop "Free shipping" variant — not needed, it's just a price label.
- Remove the entire bottom microline (`Secure SSL checkout · 60-day guarantee · You save $X`).
- Net result: two-element bar (price stack on left, CTA on right) with one line under the price. Cleaner and lighter.

## 3. Priority Upsell — revert to yellow, fix icon/text visibility
The blue-then-green selected state had dark-on-dark legibility issues. Keep the yellow accent family but make the icon and text clearly readable.

**File:** `src/components/order/PriorityUpsellCard.tsx`
- Background returns to soft yellow wash: `bg-[hsl(var(--order-yellow)/0.10)]`.
- Border idle: `border-[hsl(var(--order-yellow-deep)/0.45)]`, hover deepens.
- **Icon disc (idle):** dark navy `bg-[hsl(var(--order-blue))] text-white` with a subtle ring — high contrast against the yellow card, the bolt clearly pops.
- **Icon disc (selected):** stays `bg-verified text-white` (the check inside is white, contrast is fine).
- **"Add" pill (idle):** white background, dark text `text-[hsl(var(--text-strong))]`, dark border — reads as a real button on yellow.
- **"Added" pill (selected):** verified-green background, **white** text + white check (was reading dark before). Add `text-white` + `border-verified` explicitly.
- Title and subtitle text already use `--text-strong` / `--text-body`, so no changes.

## 4. FAQ updates
**File:** `src/components/order/FaqBlock.tsx`
- Add a new diabetic-specific question (objection-handling for ad traffic):
  - **Q:** *"Are these safe and comfortable for diabetics?"*
  - **A:** *"Yes — VitalWalk was designed with diabetic-friendly features in mind: a seamless interior so there's nothing to rub against sensitive skin, an extra-wide toe box that won't compress toes, and adjustable straps that accommodate swelling and diabetic socks. Always check with your doctor before changing footwear if you have advanced neuropathy or active foot ulcers."*
  - Place it after the bunions/wide-feet question, before the diabetic-socks question (or merge with it — see below).
- Tighten so we don't have two near-identical diabetic questions: keep the existing "Can I wear them with diabetic socks or compression stockings?" *and* the new safety one — they answer different objections (safety vs. fit with socks). Order: swelling → easy on/off → wide feet → **diabetic safety (new)** → diabetic socks → orthotics → shipping → returns.
- Update the "How fast will my order arrive?" answer to use **4–7 business days** for US (per your correction). New copy:
  > *"Free standard shipping on every order. Most US orders arrive in 4–7 business days. UK, Canada, Australia, and New Zealand typically arrive in 5–7 business days. You'll get a tracking link by email the moment your pair ships."*

## Files touched
- `src/components/order/UpgradeStep.tsx`
- `src/components/order/StickyCheckoutBar.tsx`
- `src/components/order/PriorityUpsellCard.tsx`
- `src/components/order/FaqBlock.tsx`

## Out of scope
- No changes to RiskFreeGuarantee, OrderSummary, or reviews block.
- No new fake reviews.
