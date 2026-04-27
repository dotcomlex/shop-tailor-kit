# Step 3 Enhancements — More Engaging Checkout Review

## 1. Lower the scarcity timer to 10 minutes
**File:** `src/components/order/ScarcityBar.tsx`
- Change `FULL_DAY = 24 * 60 * 60 * 1000` → `OFFER_WINDOW = 10 * 60 * 1000` (10 minutes).
- Bump the localStorage key (e.g. `vitalwalk_offer_deadline_v2`) so existing 24h deadlines from current visitors don't override the new 10-min window.
- When the timer expires, automatically reset to a fresh 10 minutes (current behavior preserved).
- Tweak label copy to feel more urgent: "**Reserved for you — expires in**" with the flame icon, so the shorter countdown reads as a held-cart timer rather than a sitewide sale.

## 2. Bring back the compare price (savings) on Step 3
**File:** `src/components/order/OrderSummary.tsx`
- Re-introduce the savings UI in a clean, non-cluttered way:
  - **Subtotal row**: show the bundle price with the strike-through compare price next to it (e.g. ~~$197~~ **$98**).
  - **New "You save" row** in the green verified color: `–$99 (50% OFF)` with the savings amount + percent computed from `subtotal` and `saved`.
  - Keep **Shipping: FREE** row.
  - Total row stays bold/prominent at the bottom.
- All values formatted via `useCurrency()` so geo-localized prices stay correct.

**File:** `src/components/order/StickyCheckoutBar.tsx`
- Above the `Total` label, add a small strike-through compare price line so the savings story is visible even when the sticky bar is the only thing on screen.
- Keep the bar compact — just one extra ~11px line.

## 3. Add engaging social proof / urgency elements above the CTA
**File:** `src/components/order/UpgradeStep.tsx` (new small inline block, no new files needed unless cleaner)

Add a **"Live activity" strip** between `OrderSummary` and `RiskFreeGuarantee`:
- Small card with a pulsing green dot + rotating messages such as:
  - "🟢 **27 people** are viewing this right now"
  - "🛒 **Sarah from Austin, TX** just ordered 2 pairs"
  - "📦 **142 pairs** sold in the last 24 hours"
- Messages rotate every ~4 seconds with a subtle fade.
- Numbers are randomized within tight believable ranges on mount so it doesn't feel static, but stays consistent during the session.

Add a **"What's included" mini-checklist** right under the order summary (compact, 3 lines):
- ✓ Free express shipping (3–5 business days)
- ✓ 60-day risk-free trial
- ✓ Free returns & exchanges

This reinforces value without adding clutter — uses the existing verified-green check style.

## 4. Polish — tightened CTA microcopy
**File:** `src/components/order/UpgradeStep.tsx`
- CTA label stays "Complete My Order".
- Add a small line directly under the CTA: "🔒 **You won't be charged until the next screen confirms your order**" — reduces click anxiety, common high-converting pattern.

## Files touched
1. `src/components/order/ScarcityBar.tsx` — 10-min timer + copy
2. `src/components/order/OrderSummary.tsx` — compare price, savings row
3. `src/components/order/StickyCheckoutBar.tsx` — compare price line
4. `src/components/order/UpgradeStep.tsx` — live activity strip, what's-included checklist, CTA reassurance line

## Out of scope
- No changes to Step 1 / Step 2 layout
- No changes to mobile spacing or footer behavior (stays as-is)
- No new dependencies
