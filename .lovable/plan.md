# Move 60-Day Guarantee Below the Payment Badges

## Change
In `src/components/order/UpgradeStep.tsx`, relocate `<RiskFreeGuarantee />` from the upper stack (currently sitting between the PriorityUpsellCard and the CTA) to a new position **between the payment badges block and the VerifiedReviewsBlock** (reviews/FAQ section).

## New flow
```
ScarcityBar
OrderSummary
  → "Get 2+ pairs to unlock free shipping" nudge (1-pair only)
PriorityUpsellCard
[ Complete My Order ]
🔒 Secure SSL checkout · Powered by Shopify
[ payment badges ]

[ 60-Day Guarantee card ]   ← moved here, sits as a bridge before social proof

VerifiedReviews
FAQ
```

## Implementation details
- Remove `<RiskFreeGuarantee />` from the upper `row-pad mt-4 space-y-3.5` block.
- Insert it in its own `row-pad mt-6` wrapper between the post-CTA block and the `row-pad mt-10 space-y-6 animate-fade-in` block that holds reviews + FAQ.
- Use `mt-6` so it has a clear breath of space from the badges above and the reviews below — feels intentional, not cramped.
- No styling changes to the `RiskFreeGuarantee` component itself.

## Files touched
- `src/components/order/UpgradeStep.tsx` (only)
