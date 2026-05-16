# Step 1 — Fix spacing, simplify marquee, fit one screen

## What to change

### 1. Move marquee out from under the green step header
Right now the scrolling band sits between the green "1. Select Quantity" bar and the bundle cards — it visually crowds the cards and looks tacked on. Move it to sit **directly under the red flash-sale bar, above the SiteHeader logo row**, so the scarcity/shipping messaging reads as one cohesive top-of-page strip.

Order at top of page becomes:
```
🔥 Flash sale ends in 02:19         ← red bar
🚚 FREE SHIPPING — TODAY ONLY ✦ …   ← marquee (moved)
[VitalWalk logo · USD · Need help?] ← SiteHeader
[1. Select Quantity | Bundle & Save!]
[bundle cards...]
```

### 2. Simplify marquee copy — free shipping only
Drop "60-day money-back guarantee" and "ships in 24h". The 60-day badge already lives in the trust strip under the CTA and inside the reviews block; doubling it up dilutes the scarcity message.

New marquee content (loops):
```
🚚 FREE SHIPPING — TODAY ONLY  ✦  FREE SHIPPING — TODAY ONLY  ✦  …
```
Only one message, repeated with a sparkle separator. Reads cleaner, hammers the one point we want.

### 3. Remove the "$X off" amount from bundle cards
Drop the absolute-dollar add-on under each save %. The line goes back to just:
```
Save 70%
Save 80%
Save 85%
```
Clean, scannable, no math overload.

### 4. Make Step 1 fill the viewport — eliminate the bottom whitespace
The user reports content feels crammed at the top with empty space below. Currently the main has `pt-3 pb-3` on Step 1 and `space-y-4` between step blocks (unused on Step 1 since steps 2/3 aren't rendered yet), but the *bundle list* itself was tightened too aggressively in the last pass, leaving the content top-loaded.

Rebalance:
- Bring back generous breathing room **inside** the card area: list `space-y-2` → `space-y-3`, card padding `p-2.5` → `p-3`. Cards feel premium again.
- After the trust strip, add `flex-1` spacer behavior so the white container itself fills the viewport. Concretely: make the Step 1 section a `flex flex-col` with `min-h-[calc(100dvh-<header+urgency>)]`, and use `mt-auto` on the trust strip so it sits at the **bottom** of the viewport rather than floating mid-page with dead space below.
- Drop the under-CTA "Color & size on next step →" micro-copy (added last turn) — it's noise; the CTA label already implies it.
- Keep the StepHeader without subStrip (as it is now).

Result: header + cards anchored top, CTA mid, trust strip + payment badges anchored bottom, no scroll on a 390×844 phone.

## Files touched

- `src/components/order/OrderPage.tsx` — mount `<FreeShippingMarquee />` between `<GlobalUrgencyBar />` and `<SiteHeader />`.
- `src/components/order/QuantityStep.tsx` — remove marquee import/usage from inside Step 1, remove "$X off" sub-text, remove "Color & size on next step" micro-copy, restore `space-y-3` + `p-3`, restructure outer wrapper to flex-fill the viewport (`flex flex-col min-h-…` with `mt-auto` trust strip).
- `src/components/order/FreeShippingMarquee.tsx` — simplify items to a single repeated "FREE SHIPPING — TODAY ONLY" message; drop ShieldCheck + Clock imports.

No business logic, Shopify, or pricing changes.
