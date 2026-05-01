## Goal

Tighten the insole upsell modal: drop the "add another pair" affordance, simplify per-pair labels, and clean up the auto-match wording.

## Changes (all in `src/components/order/InsoleUpsellModal.tsx`)

1. **Remove "Add another pair"**
   - Delete the dashed `+ Add another pair` button at the bottom of the size list.
   - Remove the `addExtra` and `removeExtra` handlers, the per-row × remove button, the `MAX_EXTRAS` constant, the `extrasCount` / `canAddExtra` logic, and the `Plus` icon import.
   - Drop `sourcePairIndex: null` from the `Row` type — every row now maps 1:1 to a shoe pair. Remove "Extra pair" / "Extra" branches in `rowLabel` and the accept payload.

2. **Drop shoe color from row label**
   - Multi-pair label becomes plain `Pair 1`, `Pair 2`, `Pair 3` — no `· Black` suffix.

3. **Remove "trim-to-fit" copy**
   - Strip that phrase entirely from the hint line.

4. **Simpler auto-match wording**
   - Replace the current hint with `Matched to your shoe size` when a shoe size is set, falling back to `Pick size` if not.

## Behavior preserved

- 1 shoe pair → single compact row (unchanged look).
- 2–3 shoe pairs → one row per pair, each independently editable via inline size grid.
- Auto-match logic, $14.95 pricing, size-system labels (US W / US M / UK / EU), and the existing accept → checkout flow all stay the same.
- `OrderPage.handleUpsellAccept` already handles a label of just `Pair N`, so no changes needed there.
