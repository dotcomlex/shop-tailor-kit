## Make color swatch images bigger on Step 2

Older customers need to clearly see what each colorway looks like. Current swatches are 78px (mobile) / 88px (desktop) — comfortably bumpable since the grid is only 4 columns wide.

### Changes (single file: `src/components/order/ColorSwatch.tsx`)

Increase the swatch circle:
- **Mobile:** `h-[78px] w-[78px]` → `h-[88px] w-[88px]` (~13% larger)
- **Desktop (sm+):** `h-[88px] w-[88px]` → `h-[112px] w-[112px]` (~27% larger)

Also bump the color label one notch so it scales with the bigger swatch:
- Mobile: `text-[13px]` → `text-[14px]`
- Desktop: `text-[14px]` → `text-[15px]`

The selected check badge stays proportional (it's anchored to the circle).

### Why these numbers
- 88px on a 390px viewport with 4 cols + `gap-3` (12px) = `4×88 + 3×12 + row-pad ≈ 388px` — fits without overflow
- 112px on desktop has plenty of room (grid is inside the order column, not full width)
- Keeps the existing 4-col grid (no layout reshuffle), just makes the actual product images more legible

No changes to `ColorSizeStep.tsx`, no logic, no other components touched.