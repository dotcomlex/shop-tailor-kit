## Goals (5 fixes)

1. **Step 1 fits the mobile viewport** — minimize empty scroll space below the bundle box on first paint.
2. **Larger, clearer color swatches** — easier to see actual colorways.
3. **Declutter Step 3** — remove the Shipping Protection card entirely.
4. **Same-tab checkout** — no new tab popup on mobile.
5. **Better bottom CTA** — refine the "Complete My Order" / sticky bar so it feels premium and on-brand, not boring.

---

## 1) Step 1 — fit the viewport (`OrderPage.tsx` + `QuantityStep.tsx` + `BundleThumb.tsx`)

Current viewport: 390×766. Header (~52px) + step header (~58px) + unisex pill row (~24px) + 3 cards (each ~108px tall w/ 16px gap) + CTA (~60px) + paddings ≈ ~720px — but the cards consume a lot of vertical space because of the offset stacked thumbs and large paddings, so the CTA frequently lands below the fold and there's awkward dead space when scrolled.

Tighten without losing clarity:

- **`OrderPage.tsx`**: reduce top padding (`pt-3 sm:pt-5` → `pt-2 sm:pt-4`) and reduce the inter-step gap on mobile (`space-y-6 md:space-y-8` → `space-y-4 md:space-y-8`). Step 2/3 only render after user advances, so this only affects Step 1 spacing.
- **`QuantityStep.tsx`**:
  - Drop the unisex pill row's top margin (`mt-3` → `mt-2`) and tighten its text wrap.
  - Reduce list spacing: `mt-5 space-y-4` → `mt-3 space-y-2.5`.
  - Reduce per-card padding on mobile: `p-3 sm:p-4` → `p-2.5 sm:p-4`, and gap `gap-3` → `gap-2.5`.
  - Reduce CTA top margin: `mt-5` → `mt-4`.
- **`BundleThumb.tsx`**: shrink mobile thumb from `h-[68px] w-[78px]` to `h-[56px] w-[64px]` (keep `sm:h-[80px] sm:w-[92px]` unchanged for tablets+). Keeps the "stack of pairs" visual but reclaims ~24px per card.

Net effect: Step 1 (header → 3 cards → yellow CTA) lands inside the 390×766 viewport with no awkward bottom whitespace.

---

## 2) Larger, clearer color swatches (`ColorSwatch.tsx` + `ColorSizeStep.tsx`)

- **`ColorSwatch.tsx`**: enlarge swatches from `h-[64px] w-[64px] sm:h-[72px] sm:w-[72px]` → `h-[78px] w-[78px] sm:h-[88px] sm:w-[88px]`.
  - Replace the always-on `ring-1 ring-hairline` with **no border in the unselected state** (only a subtle inner `ring-1 ring-black/5` for definition against white card bg). Selected state keeps the 3px blue ring + offset.
  - Reduce inner padding from `p-[3px]` → `p-[2px]` so the actual color fills more of the circle.
  - Bump label to `text-[13px] sm:text-[14px]` for legibility.
- **`ColorSizeStep.tsx`**: keep `grid-cols-4` on mobile but increase the gap to `gap-3 sm:gap-4` so the larger swatches breathe.

Result: ~22% larger color circles, no visual border noise, true colorways read clearly.

---

## 3) Remove Shipping Protection from Step 3 (`UpgradeStep.tsx` + `OrderPage.tsx` + `OrderSummary.tsx`)

- **`UpgradeStep.tsx`**:
  - Delete the entire `<div className="rounded-xl border border-border bg-card p-4">…Switch…</div>` block (the protection card).
  - Remove the `ShieldCheck` and `Switch` imports that become unused.
  - Remove `protectionEnabled`, `onToggleProtection`, `protectionPrice` props from the interface and destructure.
  - `totalWithProtection` becomes just `total` — pass `total` directly to `StickyCheckoutBar`.
  - Update `OrderSummary` props: drop `protectionPrice` and `protectionEnabled`.
- **`OrderPage.tsx`**:
  - Remove `protectionEnabled` state, `setProtectionEnabled`, and the `SHIPPING_PROTECTION_PRICE` constant.
  - Remove the props from the `<UpgradeStep>` invocation.
- **`OrderSummary.tsx`**: remove the conditional protection row and its props from the interface (subtotal + shipping + total + saved remain).

This collapses Step 3 to: SavingsHero → ScarcityBar → OrderSummary → RiskFreeGuarantee → CTA — exactly the lean flow requested.

---

## 4) Same-tab checkout — kill the popup prompt (`OrderPage.tsx`)

The current `handleCheckout` calls `window.open("about:blank", "_blank")` synchronously to preserve the user gesture for popup-based checkout. On iOS Chrome this still triggers a "Allow popups?" prompt the first time. Switch to **same-tab navigation**:

- Remove the `window.open("about:blank", "_blank")` line and all `checkoutWindow` references.
- After resolving `checkoutUrl`, do `window.location.href = checkoutUrl;` (no try/finally setIsCheckingOut(false) on success — leave the spinner on while the browser navigates away).
- On error path, still toast and clear `isCheckingOut`.

Trade-off acknowledged: cart-state-on-return is moot here because checkout completion redirects to Shopify's thank-you page, not back to the order page. This eliminates the popup blocker prompt entirely on mobile (the #1 conversion killer).

> Note: this intentionally diverges from the "always open checkout in a new tab" guidance in the Shopify knowledge file because the user has explicitly requested same-tab behavior to avoid the iOS popup prompt. The `channel=online_store` param is preserved.

---

## 5) Refined bottom CTA — premium, not boring

Two CTAs to upgrade so they feel cohesive:

### `YellowCta.tsx` (the in-flow "Complete My Order" button)

- Keep the `h-[60px]` height and yellow base, but remove the heavy **inset bottom shadow** (`0_2px_0_…`) which reads as flat/cheap. Replace with a **soft glow + subtle inset highlight**:
  - `shadow-[0_8px_22px_-8px_hsl(var(--order-yellow-deep)/0.55),inset_0_1px_0_rgba(255,255,255,0.55)]`
  - Hover: lift via `hover:-translate-y-px hover:shadow-[0_12px_28px_-8px_hsl(var(--order-yellow-deep)/0.6),…]`.
- Replace the dark right-side circle with a cleaner **right-aligned arrow** that lives inside a translucent black pill `bg-black/10` (or remove the circle entirely and use a chevron) — current "black puck" feels disconnected.
- Add a thin `Lock` icon (12px) before the label on Step 3 only (passed via new optional `leadingIcon` prop) for trust signaling at the most critical CTA.

### `StickyCheckoutBar.tsx` (mobile sticky bar)

- Already two-zone — keep that, but:
  - Increase the CTA pill height from `h-[52px]` to `h-[54px]` and bump font size to `text-[16px]`.
  - Add a faint top **gradient fade** above the bar (`before:` pseudo or a sibling div with `bg-gradient-to-t from-background to-transparent h-3 -translate-y-full`) so content scrolls "into" the bar instead of being cut off harshly.
  - Tighten the price block typography for clarity (price `text-[22px]`, save line `text-[12px]`).

Result: both CTAs share a refined yellow language with soft glow + subtle motion, and the sticky bar fades elegantly into page content.

---

## Files to edit

- `src/components/order/OrderPage.tsx` — same-tab checkout, drop protection state, tighten top spacing.
- `src/components/order/QuantityStep.tsx` — tighter card spacing/padding.
- `src/components/order/BundleThumb.tsx` — smaller mobile thumb.
- `src/components/order/ColorSwatch.tsx` — larger swatch, remove border noise.
- `src/components/order/ColorSizeStep.tsx` — adjust grid gap for larger swatches.
- `src/components/order/UpgradeStep.tsx` — remove shipping protection card + props.
- `src/components/order/OrderSummary.tsx` — drop protection props/row.
- `src/components/order/YellowCta.tsx` — refined shadows + cleaner trailing affordance + optional leading icon.
- `src/components/order/StickyCheckoutBar.tsx` — taller pill, top fade, tighter typography.

No new dependencies, no schema changes.
