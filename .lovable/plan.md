## Highlight selected quantity card with warm on-brand tint

Make the pre-selected "2 Pairs" card pop the moment users land, using a warm cream/yellow tint that matches the existing yellow CTA brand color.

### Changes (single file: `src/components/order/QuantityStep.tsx`)

For the option `<button>` when `selected` is true:
- **Background:** warm cream `bg-[#FDF7F0]` (matches your suggested swatch — soft, on-brand with the yellow CTA)
- **Border:** keep `border-order-blue` but bump visibility — add a subtle warm-yellow accent ring `ring-2 ring-[hsl(45_95%_55%/0.35)]` so the card glows slightly without fighting the blue border
- **Shadow:** add `shadow-[0_4px_14px_-4px_rgba(212,160,23,0.25)]` for a soft warm lift
- **Save % text:** keep as-is (already strong red)

Unselected cards stay white with gray border — so the contrast is immediate and the eye lands on 2 Pairs first.

### Why this works
- `#FDF7F0` ties visually to the yellow "Select Color and Size" CTA → reinforces brand color story
- Warm tone reads as "premium / chosen" without competing with the red MOST POPULAR ribbon
- Stronger visual hierarchy than the current blue-border-only treatment, which can be missed on bright phone screens
- Pure presentation change — no logic, copy, pricing, or ribbon changes

No other files touched.