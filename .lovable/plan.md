# Step 3 — Declutter & Refine

Goal: Keep Step 3 lean and conversion-focused. The user is already past color/size, so we only show what nudges them to push the button.

## What stays (working well)
- **Reserved for you — expires in MM:SS** (10-min scarcity bar) ✅
- **Order summary** with subtotal, ~~compare price~~, **You save −$X (XX% OFF)** in green, FREE shipping, big total — already routed through `useCurrency()` so it auto-converts for the user's region ✅
- **60-day Risk-Free Guarantee** badge block (the big one)
- **Complete My Order** CTA + payment badges + verified reviews + FAQ

## Changes

### 1. `src/components/order/IncludedChecklist.tsx` — rework the 3 items
Replace the current 3 lines with a tighter, location-aware version:
- ✓ **Fast & free shipping** to **{country.name}** (e.g. "to the United States" / "to the United Kingdom"). Falls back to "Fast & free shipping" if geo hasn't resolved yet.
- ✓ **Easy returns & exchanges**
- ✓ *(remove the "60-day risk-free trial" line — already covered by the big `RiskFreeGuarantee` badge directly below it; keeping both is redundant)*

Wire it up by calling `useGeo()` inside `IncludedChecklist` and rendering `country?.name` when available. Drop down to a 2-item list (cleaner than 3 when the warranty line is gone).

### 2. `src/components/order/UpgradeStep.tsx` — remove clutter
- **Remove** `<LiveActivity />` and its import (the rotating "X people viewing / Sarah from Austin just ordered" strip). User wants it gone.
- **Remove** the lock-icon reassurance line: *"You won't be charged until you confirm your order on the next screen"* — redundant with the secure-checkout microline + payment badges right below it.
- Keep everything else (ScarcityBar → OrderSummary → IncludedChecklist → RiskFreeGuarantee → CTA → secure-checkout microline → payment badges → reviews → FAQ → sticky bar).
- Tighten the vertical rhythm now that two blocks are gone — section spacing stays at `space-y-3.5` but the result will breathe more naturally.

### 3. `src/components/order/LiveActivity.tsx` — delete
File is no longer imported anywhere after the UpgradeStep edit. Remove it to keep the codebase clean.

## Files touched
1. `src/components/order/IncludedChecklist.tsx` — rework to 2 geo-aware items
2. `src/components/order/UpgradeStep.tsx` — remove LiveActivity + reassurance line
3. `src/components/order/LiveActivity.tsx` — delete

## Out of scope (explicitly keeping)
- Scarcity timer (10 min reservation) — keep as is
- Compare price / "You save" row in OrderSummary — keep, already currency-localized via `useCurrency()`
- 60-day Risk-Free Guarantee badge block — keep
- Sticky checkout bar — keep
