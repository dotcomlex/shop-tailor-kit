## Step 3 polish — Priority card + layout reflow

Three small, surgical changes. Pure presentation, no business-logic touches.

### 1. Priority Processing subtitle (`PriorityUpsellCard.tsx`)

Drop the 24h promise (we're dropshipping, can't honor it). Replace with something playful that still sells the "jump the queue" benefit.

- New copy: **"Skip the line — your order ships first ⚡"**
  - Honest (we *do* prioritize their order ahead of standard queue)
  - Punchy, single line, no time commitment
  - Trailing bolt emoji ties back to the lightning-bolt icon on the left

### 2. Priority card visual standout

Right now the card uses the same neutral `bg-card` as the OrderSummary above and the IncludedChecklist below — so it visually melts into the stack. Lift it with a soft tinted background and a slightly warmer border so the eye stops on it.

- **Idle state:** soft yellow wash (`bg-order-yellow/8`, border `border-order-yellow-deep/30`) — same accent family as the CTA, signals "this is an opportunity," not noise.
- **Selected state:** keep the existing verified-green ring/border but layer it over the yellow wash so the toggle still feels like a clean confirmation.
- Add a faint top-left shimmer gradient (`from-order-yellow/15 to-transparent`) for a touch of depth — same recipe used elsewhere on premium CTAs in this funnel.
- Icon disc tint stays as-is (yellow when idle, green when added).

Result: the card reads as a distinct "upgrade" row, not another summary line — without screaming.

### 3. Reflow Step 3 to shorten the scroll

Currently above the CTA: ScarcityBar → OrderSummary → PriorityCard → IncludedChecklist → **RiskFreeGuarantee** → CTA. That's 5 boxes before the button on a 390-wide viewport.

Move the **60-day guarantee block under the CTA**, right above the trust microline. New order:

```text
ScarcityBar
OrderSummary
PriorityUpsellCard
IncludedChecklist
[ Complete My Order ]   ← CTA reachable ~1 scroll sooner
RiskFreeGuarantee       ← reassurance for hesitant clickers
Trust microline · payment badges
↓ Reviews / FAQ
```

Why this works:
- Customers who are ready to buy hit the CTA faster (less stacked friction above the fold).
- Customers who hesitate at the CTA see the 60-day guarantee *as the next thing they look at* — exactly when reassurance matters most.
- The guarantee block stays visually tied to the CTA (sits in the same `row-pad` group as the trust microline and badges).

No spacing or padding rebuilds — the block keeps its current styling, only its position changes.

### Files touched
- `src/components/order/PriorityUpsellCard.tsx` — copy + tinted background/border
- `src/components/order/UpgradeStep.tsx` — move `<RiskFreeGuarantee />` from above the CTA to below it

### Out of scope
- No changes to OrderSummary, IncludedChecklist, sticky bar, checkout logic, or pixel events.
- No new content in the guarantee block itself.