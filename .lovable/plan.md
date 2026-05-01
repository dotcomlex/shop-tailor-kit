## Bug: 6 thumbnails overflow the 160px hero column → squeezes right column → title wraps to 3 lines

The screenshot shows:
- Title wrapping awkwardly to **3 lines** ("Orthopedic / Massage / Insoles")
- Hero column visually dominates, right column is cramped

**Root cause**: 6 thumbnails at `w-7` (28px) with `gap-1` (4px) = `6×28 + 5×4 = 188px`, but the hero column is 160px. The thumbnails overflow horizontally, which combined with `flex justify-between` makes them stretch and visually expand the column. The right column ends up too narrow for "Massage" to fit on one line at 16px font-extrabold.

## Fix in `src/components/order/InsoleUpsellModal.tsx`

1. **Shrink hero from 160px → 150px** to give the right column ~10px more room — small enough that nobody notices the hero shrunk, big enough to let the title fit `Orthopedic Massage / Insoles` (2 lines).
2. **Resize thumbnails to fit**: 22×22 with `gap-1` and `justify-between` across the 150px column. Math: `6×22 + 5×4 = 152` ≈ 150 (close enough; `justify-between` distributes evenly without overflow). Also add `w-full` on the thumb row so it locks to the hero width.
3. **Lock the hero wrapper to a fixed `w-[150px]`** so it can never be widened by its children — eliminates any chance of the column blowing out again.
4. Make video thumb's ▶ triangle slightly smaller to fit the new 22px size (`border-y-[3px] border-l-[5px]`).

## Files touched
- `src/components/order/InsoleUpsellModal.tsx` — hero/thumb sizing only.

No content, gallery order, video, pricing, or Shopify changes.
