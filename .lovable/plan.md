## Two fixes in `SocksUpsellModal.tsx`

### 1. Thumbnail gap

The thumb row uses `justify-between` which spreads 3 tiles across the full 170px column → big air gaps. Switch to a tight cluster.

```tsx
// before
<div className="mt-1.5 flex w-full items-center justify-between gap-1">

// after
<div className="mt-1.5 flex items-center justify-start gap-1.5">
```

Tiles stay 36×36, sit flush-left under the hero, breathe at 6px spacing. Works for both 3-tile (no color picked) and 4-tile (color picked) states.

### 2. Remove the 3 trust bullets and rebalance columns

Delete the `<ul>` "what you get" stack added last turn. To prevent the right column from being shorter than the left, tighten the left column so heights line up.

**Approach:** when no color is touched yet (gallery has 3 tiles), the right column ends at the SAVE pill while the left has hero + thumbs. After bullet removal, the gap is ~70px.

Two small tweaks together close that gap cleanly:

- **Hero shrinks slightly when color not yet picked**: `w-[170px]` → `w-[150px]` while `colorTouched === false`. Reverts to `170px` after tap so the variant pack reads at full size. Hero is the dominant visual; -20px is barely noticeable when the user has nothing to compare against, but saves enough vertical space (-20px square) to balance.
- **Right column gets a tiny bit of breathing room above the price**: change `mt-1.5` on the price row to `mt-2`, and the SAVE pill `mt-1` → `mt-1.5`. Adds ~6px.

Combined: left column shrinks ~24px, right column grows ~10px → columns end within ~5px of each other. Hairline difference invisible at 390px.

If after this the columns still don't line up perfectly in the live preview, the fallback is to drop the thumbnail row's `mt-1.5` to `mt-1` and call it done.

## Files

- `src/components/order/SocksUpsellModal.tsx` — three small className tweaks + delete the trust-bullets `<ul>`

Nothing else changes. Funnel/checkout/currency wiring untouched.
