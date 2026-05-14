# Polish Pass: Guarantee Card, Priority Color, Reviews Header, FAQ Refinement

## 1. Make the 60-Day Guarantee card more beautiful
File: `src/components/order/RiskFreeGuarantee.tsx`

- Wrap the card in a soft gradient background (`from-[hsl(var(--order-blue-soft))] to-card`) with a subtle inner highlight, so it reads as a premium reassurance block, not a flat card.
- Promote the badge: bump back to ~64/72px, add a thin ring + outer glow in `--order-blue` so the disc feels like a seal/medallion.
- Add a tiny "Risk-Free Promise" eyebrow label above the headline (uppercase, 10px, blue, tracked) for hierarchy.
- Headline stays "Try VitalWalk risk-free for 60 days." in 14.5px extrabold.
- Body line tightens to: *"Don't love them? Send them back for a **full refund** — easy returns, no questions asked."*
- Padding bumps to `p-4 sm:p-5` so it has presence as a standalone block (now that it sits on its own between badges and reviews).

## 2. Recolor the Priority Processing card
File: `src/components/order/PriorityUpsellCard.tsx`

The yellow on the upsell competes with the yellow CTA and the red ScarcityBar above it. Switch to a cool blue treatment — distinct, premium, still attention-grabbing without piling on warm tones.

- Background: soft blue wash `bg-[hsl(var(--order-blue)/0.06)]` (selected state keeps verified-green ring).
- Border (idle): `border-[hsl(var(--order-blue)/0.30)]`, hover `0.55`.
- Top-left shimmer gradient swaps yellow → `hsl(var(--order-blue)/0.14)`.
- Icon disc (idle): `bg-[hsl(var(--order-blue)/0.18)] text-[hsl(var(--order-blue))]`. Selected stays verified green.
- "Add" pill (idle): blue border + blue text on white, hover deepens. Selected stays verified green.
- No copy changes.

Net effect: the visual stack reads cool-blue (priority) → bold-yellow (CTA), much cleaner than warm-on-warm-on-red.

## 3. Reviews block — add a section headline
File: `src/components/order/VerifiedReviewsBlock.tsx`

Add a header above the Trustpilot bar so the section announces itself:

- Eyebrow: `WHAT CUSTOMERS SAY` (10px, uppercase, tracked, blue).
- H3: `Real stories from real walkers` (18px extrabold, text-strong).
- Sit above the existing Trustpilot rating row, separated by the same hairline.

Review **bodies, names, ratings, and counts are unchanged** (won't fabricate new testimonials — see note above). If you provide real reviews from your store/Trustpilot export, I'll swap them in.

## 4. FAQ block — small refinements
File: `src/components/order/FaqBlock.tsx`

Light copy + structure polish only — no new fake claims:

- Reorder so the highest-converting questions surface first: fit/swelling → easy on/off → wide feet → orthotics → shipping → returns (current order is already close, just tighten).
- Tighten 2 answers for clarity (no new product claims):
  - **"My feet swell severely throughout the day…"** — trim filler, keep the DayFlex™ + compression-sock points.
  - **"How fast will my order arrive?"** — drop the "ships within 24 hours" line (per your earlier note we're drop-shipping). New copy: *"Free standard shipping on every order. Most US orders arrive in 5–8 business days; UK, Canada, Australia, and New Zealand typically arrive in 5–6 business days. You'll get a tracking link by email the moment your pair ships."*
- Add a final FAQ:
  - **Q:** *"Can I wear them with diabetic socks or compression stockings?"*
  - **A:** *"Yes. The adjustable straps and extra-wide toe box accommodate diabetic socks, compression stockings, and swelling throughout the day without pinching."*
  (This is product-specification copy about the shoe's design, not fabricated social proof — safe to add. Tell me if you'd rather omit.)

## Files touched
- `src/components/order/RiskFreeGuarantee.tsx`
- `src/components/order/PriorityUpsellCard.tsx`
- `src/components/order/VerifiedReviewsBlock.tsx`
- `src/components/order/FaqBlock.tsx`

## Out of scope
- Generating new review testimonials, ratings, names, or counts.
- Any backend / data changes.
- Layout above the OrderSummary.
