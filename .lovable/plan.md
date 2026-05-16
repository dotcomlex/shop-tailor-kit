# Funnel Polish — Step 1 & Step 3 Improvements

Four focused changes. All UI-only, no pricing or backend changes.

## 1. Shorter bundle names (Step 1)

`src/components/order/QuantityStep.tsx` — `OPTIONS` array.

Drop the redundant "VitalWalk® Shoes" entirely (the whole page is already branded). New names:
- **"1 Pair"**
- **"2 Pairs"**
- **"3 Pairs"**

No sub-label. This kills the wrap on 360–390px screens and gives the price column breathing room. Bump font size slightly (e.g. 18–19px) so the headline still carries weight.

## 2. Urgency strip on Step 1

Add a slim "Sale ends in MM:SS" strip directly under the Step 1 header, above the bundle cards. New tiny component `Step1UrgencyStrip.tsx`, reads the same `vitalwalk_offer_deadline_v2` localStorage key as `ScarcityBar` so both timers stay in sync but read as distinct moments (Step 1 = "Sale ends", Step 3 = "Reserved for you"). Flame icon + red accent matching `--save`.

## 3. Make Priority Processing removable (Step 3)

`src/components/order/PriorityUpsellCard.tsx`:

- Selected state pill: change "✓ Added" → **"✓ Added · Remove"** with a small `×` glyph so the affordance is obvious.
- Update `aria-label` to flip between "Add Priority Processing" / "Remove Priority Processing".
- Card already toggles on click — no logic change, just clearer copy + icon.

## 4. Fix sticky Complete Order bar on mobile

`src/components/order/StickyCheckoutBar.tsx`.

Current: `visible = ctaOffscreen && scrollingDown` — hides whenever the user scrolls up, which is why it disappears unpredictably.

Change to: **visible whenever the main CTA is offscreen**, regardless of scroll direction. Remove the `scrollingDown` state + scroll listener. Keep the fade/translate transition.

## Technical notes

- All four changes are presentational. No Shopify / cart / pricing changes.
- `BUNDLE_OPTIONS` export stays intact.
- Sticky bar simplification removes ~25 lines of scroll-tracking code.
