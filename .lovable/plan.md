# Reword Free-Shipping Nudge — Generalize

## Change
In `src/components/order/UpgradeStep.tsx`, update the 1-pair shipping nudge copy to cover both 2-pair and 3-pair bundles.

**Before:**
> 🚚 **Add another pair** to unlock **free shipping**.

**After:**
> 🚚 **Get 2+ pairs** to unlock **free shipping**.

Rationale: customer can pick the 2-pack or the 3-pack — both ship free. "2+ pairs" reads instantly and matches what's already used elsewhere in the funnel ("free on 2+").

Bold stays on "Get 2+ pairs" and "free shipping". Position, styling, and `quantity === 1` condition unchanged.

## Files touched
- `src/components/order/UpgradeStep.tsx` (copy only)
