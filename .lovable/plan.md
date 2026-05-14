## Tighten the post-CTA trust block

The area under "Complete My Order" feels heavy: a big 60-day card with a long paragraph, a microline that *repeats* "60-day money-back guarantee" (duplicating the card it sits beneath), and a wide payment-badge PNG that competes with the guarantee. Three small fixes.

### 1. Slim the 60-day guarantee card (`RiskFreeGuarantee.tsx`)

Right now the card is the visual heaviest thing under the CTA — bigger than the CTA itself on a 390-wide viewport. Make it inline-compact while keeping the badge as the trust anchor.

- Shrink the circular badge: 78/88px → **56/64px**.
- Tighten the body copy to one short line + one supporting line:
  - **H:** "Try VitalWalk risk-free for 60 days."
  - **B:** "Don't love them? Send them back for a full refund. Easy returns & exchanges."
- Drop card padding from `p-4 sm:p-5` → `p-3 sm:p-3.5`.
- Headline `text-[14px]`, body `text-[12px] leading-snug` (down from 14.5/12.5 leading-relaxed).

Net: same reassurance, ~35% less vertical space, sits cleanly between CTA and microline.

### 2. De-dupe the trust microline (`UpgradeStep.tsx`)

Currently reads: *Secure SSL checkout · Powered by Shopify · 60-day money-back guarantee*

The "60-day" mention is now directly above it (in the card) and below it (in the badge image's "100% SECURE" seal area). Drop it from the microline.

- New microline: **"🔒 Secure SSL checkout · Powered by Shopify"**

Keeps the security/legitimacy signal without echoing the guarantee three times in a row.

### 3. Soften the payment badges (`UpgradeStep.tsx`)

The PNG is loud (saturated SSL gold seal + 7 colored card logos) and pulls the eye away from the guarantee. Two cheap tweaks:

- Cap max-width tighter: `max-w-[340px]` → **`max-w-[300px] sm:max-w-[340px]`**.
- Apply a subtle desaturation + opacity so it reads as a trust footer, not a banner: `className="... opacity-80 saturate-[0.85]"`.

No PNG re-export needed.

### Files touched
- `src/components/order/RiskFreeGuarantee.tsx` — compact layout + tighter copy
- `src/components/order/UpgradeStep.tsx` — drop redundant microline phrase, slim badge image

### Out of scope
- No changes to the CTA, sticky bar, Priority card, OrderSummary, IncludedChecklist, or any logic.
- Reviews/FAQ blocks below remain untouched.