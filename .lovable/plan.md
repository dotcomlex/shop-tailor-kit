# Step 1 — Tighten quantity card containers

Cards currently feel too airy after the last `py-5` bump. Pull the padding back so the three cards read as a tight group.

## Changes
- `QuantityStep.tsx`: card padding `py-5` → `py-3.5` (both base + sm).
- `QuantityStep.tsx`: gap between thumb and text `gap-3.5` → `gap-3`.
- Thumb size stays as-is (76px) — it remains the hero.

## Files
- `src/components/order/QuantityStep.tsx` (only file)

## Out of scope
- No content/copy changes.
- No ribbon, color, or font changes.
- No other step touched.
