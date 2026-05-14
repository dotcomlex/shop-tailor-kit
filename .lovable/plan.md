# Tighten Post-CTA Spacing Rhythm

## Observation from screenshot
- CTA → SSL line gap looks fine.
- SSL line → payment badges feels slightly tight (badges hug the text).
- Payment badges → 60-day guarantee card gap feels a bit too large compared to the others, breaking the visual grouping.

## Goal
Even, intentional rhythm so the four elements (CTA, SSL line, badges, guarantee) read as one cohesive trust block.

## Changes — `src/components/order/UpgradeStep.tsx`

Replace the `space-y-2.5` wrapper with explicit per-element margins so each gap is tuned:

- CTA → SSL line: `mt-3` (≈12px) — clear separation from the big yellow button.
- SSL line → badges: `mt-2.5` (≈10px) — close but breathing.
- Badges → 60-day guarantee: `mt-3` (≈12px) — slight step-down to signal a new "card" element.
- Add a touch more vertical padding inside the badge row (`py-0.5`) so the strip doesn't feel cramped against neighbors.

Also: cap badge width slightly tighter on mobile (`max-w-[260px]` → keeps logos crisp at 390px viewport).

## Files touched
- `src/components/order/UpgradeStep.tsx` (spacing only — no structural or copy changes)

## Out of scope
- No changes to `RiskFreeGuarantee`, the CTA, or anything above the CTA.
- No new assets.
