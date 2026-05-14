# Compact Payment Badges + Cleaner Post-CTA Stack

## Goal
Replace the current chunky payment-badges PNG with the new compact strip the user uploaded, and tighten the post-CTA reassurance stack so SSL line, badges, and 60-day guarantee feel like one cohesive, premium block.

## Changes

### 1. Add the new badge asset
- Copy `user-uploads://image-14.png` → `src/assets/payment-badges-compact.png`
- Retire the old `payment-badges.png` import in `UpgradeStep.tsx` (file itself can stay in repo, just unused).

### 2. Reorder + restyle the post-CTA block in `src/components/order/UpgradeStep.tsx`
New order, tightly spaced:

```
[ Complete My Order ]
🔒 Secure SSL checkout · Powered by Shopify
[ compact payment badges strip ]
[ 60-Day Guarantee card ]
```

- Reduce vertical spacing from `space-y-3.5` → `space-y-2.5` so the group reads as one unit.
- Render the new badges immediately under the SSL microline (no extra `mt-3` wrapper, just `mt-1.5`).
- Constrain badge image to `max-w-[280px] sm:max-w-[320px]`, drop the `opacity-80 saturate-[0.85]` (new asset is already balanced), keep `mx-auto`.
- Update alt text to match the new providers visible in the strip: Shop Pay, Discover, Visa, Mastercard, Apple Pay, Google Pay, Amazon, Amex.

### 3. Keep the `RiskFreeGuarantee` card as the closing element
- It already has the compact styling from the prior pass — no changes to that component.
- Sits last so the guarantee is the final reassurance before the fold.

## Files touched
- `src/assets/payment-badges-compact.png` (new, copied from upload)
- `src/components/order/UpgradeStep.tsx` (import swap, reorder, spacing)

## Out of scope
- No changes to `RiskFreeGuarantee.tsx`, the CTA button, or anything above the CTA.
- Old `payment-badges.png` left on disk (can be cleaned up later).
