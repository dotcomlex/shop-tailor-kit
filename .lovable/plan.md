# Step 1 quantity-card polish

Scope is limited to the three quantity cards on Step 1 — no other component touched.

## Changes

1. **Bigger thumbnail + more breathing room**
   - Thumbnail goes from ~56px → **76px** square.
   - Card vertical padding bumps from `py-3` → `py-5` (~16px more total).
   - Slight gap increase between thumb and title so the shoe doesn't crowd the copy.

2. **Lift the ribbons onto the card border**
   - "MOST POPULAR" and "BEST DEAL" ribbons move from inside the card to straddling the top border (`-top-2.5`).
   - Add a soft shadow so they read as a sticker on top of the card.
   - Cards get a small `mt-3` so the lifted ribbon doesn't get clipped.

## Files
- `src/components/order/QuantityStep.tsx` (only file changed)

## Out of scope
- MSRP / strike price values stay as-is.
- No "ships together" microline.
- No color, font, or animation changes.
- Other steps untouched.
