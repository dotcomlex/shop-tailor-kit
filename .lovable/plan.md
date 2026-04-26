## Goal

Step 3 currently jumps from Order Summary → Shipping Protection → CTA. That's enough to checkout, but it doesn't *handle objections* the way the long-form sales pages do. We'll add three high-converting trust blocks **only on Step 3** so they reveal beautifully when the user reaches review/checkout — not earlier where they'd add clutter.

All copy is pulled from the two product pages you sent (vitalwalk-pro + the editorial preview), so it stays on-brand and addresses the real objections (swelling fit, ease of use, falls, looks, returns, shipping speed).

---

## What gets added on Step 3 (in this order)

1. **SavingsHero** *(unchanged)*
2. **ScarcityBar** *(unchanged)*
3. **OrderSummary** *(unchanged)*
4. **Shipping Protection toggle** *(unchanged)*
5. **🆕 RiskFreeGuarantee block** — the "we're not asking you to trust us, we're asking you to test us" 60-day promise
6. **YellowCta — "Complete My Order"** *(unchanged)*
7. **Trust microline + payment badges** *(unchanged)*
8. **🆕 VerifiedReviewsBlock** — Trustpilot-style header + 4 verified review cards (re-using `ORDER_REVIEWS` from `src/data/reviews.ts`, plus 2 new ones taken from the source pages so the social proof feels deeper)
9. **🆕 FaqBlock** — 6 collapsible FAQ items targeting the top objections from the source pages

Every new block uses `animate-fade-in` and lives inside the `currentStep >= 3` gate, so they only appear when the user reaches Step 3 — exactly as requested.

---

## New components (all in `src/components/order/`)

### `RiskFreeGuarantee.tsx`
Compact card with a circular **60-Day** badge on the left and short copy on the right:
> **Try VitalWalk risk-free for 60 days.** Wear them on long days, swollen evenings, morning stiffness. If they don't change how you experience your feet — send them back for a full refund. No forms. No questions. We email you a prepaid return label.

- Forest green (`--order-blue` = `#0F483A`) circular badge with white "60 / DAY / GUARANTEE" stack
- Sits directly above the CTA so it removes purchase risk at the exact moment of decision

### `FaqBlock.tsx`
Uses the existing shadcn `Accordion` component (`src/components/ui/accordion.tsx`) — no new deps. 6 questions, all answered with copy distilled from the source pages:

1. **My feet swell severely throughout the day. Will these actually fit?** → DayFlex™ velcro adjusts in seconds, even mid-day, works with compression socks.
2. **I struggle to bend over to tie shoes. Are these easy to put on?** → EasyEntry™ flat opening, one-handed velcro, ideal for arthritis/post-surgery.
3. **I have bunions, hammertoes, or wide feet. Will these rub?** → True extra-wide WideComfort™ toe box, no pinching even on high-swelling days.
4. **Can I use my own custom orthotics?** → Yes — removable insole accommodates custom orthotics.
5. **How fast will my order arrive?** → Ships in 24h, free standard shipping, typically 5–8 business days in the US.
6. **What if they don't work for me, or I need a different size?** → 60-day money-back guarantee, free exchanges, prepaid return label.

Styling: forest-green chevron, body copy in `--text-body`, headers in `--text-strong`, hairline dividers between items.

### `VerifiedReviewsBlock.tsx`
Reuses the existing `ReviewsBlock.tsx` pattern but adds:
- **Trustpilot-style header**: 5 green stars + **"Excellent · Based on 2,847 verified reviews · 4.9/5"** (matches the brand's actual claimed rating from the product page)
- **6 reviews total** (extends `ORDER_REVIEWS` with 2 new entries adapted from the source pages — Margaret S. "Nobody knows they're medical shoes" and Joyce D. "Within one week the constant throbbing was gone")
- "Show more" expands all reviews; first 3 visible by default
- Each review keeps the green Verified Purchaser shield

---

## File-level changes

- **Edit** `src/components/order/UpgradeStep.tsx`
  - Add `RiskFreeGuarantee` directly above the CTA (after the Shipping Protection card)
  - After the existing payment-badges row, append `<VerifiedReviewsBlock />` then `<FaqBlock />`, each with top spacing (`mt-8`) and a hairline divider above for clear visual separation
- **Edit** `src/data/reviews.ts`
  - Append 2 new review objects (Margaret S., Joyce D.)
- **New** `src/components/order/RiskFreeGuarantee.tsx`
- **New** `src/components/order/FaqBlock.tsx`
- **New** `src/components/order/VerifiedReviewsBlock.tsx` *(supersedes the old `ReviewsBlock.tsx`, which is currently unused since the sidebar was removed — we'll delete the old file to keep things clean)*
- **Delete** `src/components/order/ReviewsBlock.tsx` (orphaned — was only used by the removed sidebar)

`OrderPage.tsx` needs **no changes** — everything stays inside `UpgradeStep`, so the new blocks automatically inherit the `currentStep >= 3` gate and the fade-in animation.

---

## Design rules applied

- All accents use the brand forest green `#0F483A` (`--order-blue`) — no stray blues
- All blocks are full-width inside the existing `max-w-[640px]` column so the page stays focused and scannable
- New blocks use `rounded-xl border border-border bg-card` to match the existing Step 3 visual language
- FAQ + Reviews live **below** the CTA on purpose — buyers ready to convert click the yellow button immediately; hesitant buyers scroll for reassurance and then convert

After approval I'll implement, then take a 390px-wide screenshot pass on Step 3 to confirm the layout reads cleanly on mobile.