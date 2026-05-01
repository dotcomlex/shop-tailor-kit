# Tighten the upsell modal: remove summary block, move size selector below bullets, clean up size labels

## Changes

**1. Delete the "Adding 1 pair to your order +$14.95" summary block.**
The total is already on the CTA button (`Yes, Add for $14.95`), so this block is redundant noise.

**2. Move the insole size selector under the bullet points.**
New order inside the modal: hero/price → bullets → **insole size** → CTA → trust strip → decline link.

**3. Clean up the variant labels (no more mixed "US W 9 / US M 8 / UK 7").**
Reuse the same `parseShopifySize` + region/system logic the shoe step already uses (`vitalwalk_size_system` in localStorage), so the modal shows a single clean number that matches whatever region the customer chose on step 2:
- Women's US picker selected → "Women's US 9"
- Men's US → "Men's US 8"
- UK → "UK 7"
- EU → "EU 40"

The collapsed pill becomes a tidy 2-line block:

```text
INSOLE SIZE
Women's US 9                              Change ▾
Auto-matched to your shoes
```

The expanded picker becomes a 4–5 column grid of clean single-system numbers (e.g. `9`, `10`, `11`…) styled like the shoe size tiles, instead of long dense labels.

**4. Keep size matching unchanged.**
Round-up logic and the new US W 5 variant stay in place; only the visual labels change.

## Technical details

File to edit: `src/components/order/InsoleUpsellModal.tsx`
- Import `parseShopifySize` from `@/data/sizeChart`, `useGeo`, and `defaultSizeSystem`/`regionFor` from `@/lib/geo`.
- Read the user's stored size system from `localStorage` (`vitalwalk_size_system`), falling back to the geo default — same pattern as `SizeTileGrid`.
- Render the variant label using only the chosen system (W/M/UK/EU number), not the full Shopify title.
- Remove the entire "Quantity / total summary" `<div>` block.
- Move the size pill + grid to sit between the benefits `<ul>` and the CTA.