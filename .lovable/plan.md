# Simplify trust strip under Step 1 CTA

Strip out the dynamic "Free Shipping on 2+ Pairs / Free Shipping" text that swaps when the user changes quantity. Keep a single static, centered line.

## Final content (mobile + desktop, identical)

`★★★★★  4.9  ·  2,847 reviews  ·  60-Day Guarantee`

- Stars (green Trustpilot mini stars) — kept
- Rating `4.9` — kept
- Review count `2,847 reviews` — **now shown on mobile too** (was desktop-only)
- `60-Day Guarantee` — kept
- ❌ Remove `Free Shipping` / `Free Shipping on 2+ Pairs` segment entirely
- ❌ Remove the `/ 5` desktop-only fragment (cleaner without it)

Payment-badges row underneath stays unchanged.

## Changes

**`src/components/order/QuantityStep.tsx`**

1. In the trust strip block, drop the responsive `hidden … sm:inline` classes so the rating + review count render the same on every viewport.
2. Delete the `· Free Shipping` (and its dynamic `quantity === 1 ? …` ternary) segment and its preceding bullet separator.
3. Since `quantity` is no longer read inside the trust strip, the `quantity` prop is still used elsewhere in the component — no signature changes.
4. Ensure the wrapper keeps `flex flex-col items-center` so the line stays centered. Inner row uses `inline-flex items-center justify-center gap-x-1.5` — already centered, just verify after the edits.

## Out of scope

No changes to the bundle cards, CTA, payment badges, or any other component.
