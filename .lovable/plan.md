# Swap Checklist for Guarantee + Soft Free-Shipping Nudge

## Changes

### 1. Replace `IncludedChecklist` with `RiskFreeGuarantee` above the CTA
In `src/components/order/UpgradeStep.tsx`:
- Remove `<IncludedChecklist quantity={quantity} />` from the upper stack (above the CTA).
- Render `<RiskFreeGuarantee />` in its place — the 60-day badge becomes the closing reassurance before the CTA.
- Also remove the duplicate `<RiskFreeGuarantee />` currently sitting below the CTA (otherwise it appears twice). Post-CTA stack becomes: CTA → SSL microline → payment badges. Cleaner, less stacked.
- Drop the now-unused `IncludedChecklist` import.

### 2. Add a soft free-shipping nudge for 1-pair orders
The "Easy returns" + shipping copy is gone, but we still want to nudge single-pair buyers toward the 2-pack. Place a single, low-key line **outside** and **just under** the `OrderSummary` card (not inside it, so it doesn't compete with the price).

In `src/components/order/UpgradeStep.tsx`, immediately after `<OrderSummary />`, conditionally render when `quantity === 1`:

```tsx
{quantity === 1 && (
  <p className="px-1 text-center text-[12px] text-[hsl(var(--text-mute))]">
    🚚 <span className="font-semibold text-[hsl(var(--text-body))]">Add another pair</span> to unlock <span className="font-semibold text-verified">free shipping</span>.
  </p>
)}
```

- Sits between OrderSummary and PriorityUpsellCard.
- Subtle (12px, muted) so it doesn't fight the priority upsell or subtotal numbers.
- Only shown for `quantity === 1` since 2+ already ships free.

### 3. Keep `IncludedChecklist.tsx` file intact
- File stays in repo (still imported nowhere) in case we want to bring it back. No deletion.

## Files touched
- `src/components/order/UpgradeStep.tsx` (only)

## Out of scope
- No changes to `OrderSummary` internals, `RiskFreeGuarantee` styling, or `PriorityUpsellCard`.
- No copy changes inside the priority/subtotal cards.
