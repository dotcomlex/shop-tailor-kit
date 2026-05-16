# Tighten swatches, simplify zoom, relocate fit meter

## 1. Swatch spacing — `ColorSizeStep.tsx`
Reduce the color grid gap from `gap-3 sm:gap-4` to `gap-2 sm:gap-3`. That pulls the 2 × 2 mobile grid tighter without crowding tap targets.

## 2. Zoom dialog — `ColorZoomDialog.tsx`
Strip the footer entirely. The dialog becomes just the high-res square image (with a close affordance via the existing Dialog X). No "Colorway / Beige" label, no "Select this color" button. Simplified props — drop `onSelect` and `isSelected`. Update `ColorSizeStep.tsx` to stop passing them.

## 3. Move the "How do they fit?" meter — `ColorSizeStep.tsx`
Today the render order inside each pair card is: Color grid → **TrueToSizeMeter** → Size label + tiles → SizingDialogs (View size chart / sizing tips). Move `<TrueToSizeMeter />` so it renders **after** `<SizingDialogs />` instead of between the swatches and the size grid. Keeps it discoverable but stops it from breaking the color → size flow.

Single render-order swap, no logic changes.

## Files
- `src/components/order/ColorSizeStep.tsx` — gap tweak + move TrueToSizeMeter below SizingDialogs + drop zoom props
- `src/components/order/ColorZoomDialog.tsx` — remove footer/select-button, image-only layout
