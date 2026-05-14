## Change

In `src/components/order/OrderSummary.tsx` (line 56), the shipping row currently shows:
- `FREE` for 2+ pair bundles
- `Calculated at checkout` for 1 pair

Replace the 1-pair value with neutral, non-alarming copy and lighten the visual weight so it doesn't draw attention.

## Plan

Update the shipping row in `OrderSummary.tsx`:
- 2+ pairs → keep `FREE` (green)
- 1 pair → simply hide the shipping line entirely (cleanest option, no mention of cost anywhere on the funnel — customer discovers it only at Shopify checkout, which is what you've asked for)

That removes the conversion-killing phrase completely. The bundle cards already advertise "FREE SHIPPING" on 2/3 pairs as the upsell incentive, so hiding the line on 1-pair is consistent.

No other files reference this phrase.