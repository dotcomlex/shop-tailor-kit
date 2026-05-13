## Goal

A/B test the socks upsell by promoting it to the **post-purchase position #1** slot (where insoles currently sit). Insole code stays in the project intact — just disabled behind a single flag so we can flip back instantly.

Also: strengthen the socks modal with stronger, more specific benefits (edema, diabetic-friendly, soft-on-skin, true-to-shoe-size fit, etc.) so the offer looks premium.

---

## Scope of changes

### 1. `src/components/order/OrderPage.tsx` — re-wire the upsell flow

Add a single feature flag at the top of the file:
```ts
const UPSELL_PRIMARY: "socks" | "insoles" = "socks";
```

Refactor `handleCompleteOrderClick` so that when `UPSELL_PRIMARY === "socks"`:
- Click "Complete My Order" → open `SocksUpsellModal` directly (skip insole modal entirely)
- Accept socks → checkout with sock line (existing `handleSocksAccept` logic, untouched)
- Decline socks → straight to checkout (no chained second offer — clean A/B test)

When `UPSELL_PRIMARY === "insoles"` the current flow is preserved verbatim (insoles → on decline, socks). Flipping the flag back is a one-line revert.

No deletions. `useInsoleProduct`, `InsoleUpsellModal`, `pickInsoleVariantForSize`, `handleUpsellAccept`, `handleUpsellDecline` all stay in the file and continue to work — they're just unreachable while the flag is "socks".

Keep the lazy import for `InsoleUpsellModal` so its chunk isn't even fetched while the flag is "socks" (already lazy — no change needed).

### 2. `src/components/order/SocksUpsellModal.tsx` — strengthen copy & trust

This is the moment of truth for the test, so the modal needs to feel premium and clinically credible — not just a generic "add socks" prompt.

Updates to copy (visual layout stays the same — already approved):

- **Headline tweak:** keep "Compression Socks · 3-Pack" but add a tighter sub-headline below: *"Built for VitalWalk wearers — fits true to your shoe size."*
- **Benefits list — replace the current 4 with 5 stronger, more specific ones:**
  1. Reduces swelling & edema — graduated 20–30 mmHg pressure
  2. Diabetic-friendly — non-binding cuff, no circulation cut-off
  3. Ultra-soft bamboo-blend knit — gentle on sensitive skin
  4. Moisture-wicking & odor-resistant — fresh all day
  5. Sized to match your VitalWalks — guaranteed perfect fit
- **Add a small "Best paired with VitalWalks" row** (icon + text) above the size selector, replacing the existing "🦶 Pairs perfectly with your VitalWalks" line which moves up.
- **Trust microline below the CTA:** keep "Free shipping · 60-day money-back guarantee", add "· Doctor-recommended materials".

No structural/layout changes. No new components. No new images. All copy changes are inside the existing JSX — same animation, same buttons, same modal dimensions.

### 3. Nothing else changes

- No changes to `useSocksProduct`, `useInsoleProduct`, `shopify.ts`, checkout logic, pixel events, price-sync guard, or any other file.
- Insole product is still fetched in the background (cheap, cached) so flipping the flag back is instant — no cold-start delay.

---

## Files touched

- `src/components/order/OrderPage.tsx` — add `UPSELL_PRIMARY` flag + branch in `handleCompleteOrderClick`
- `src/components/order/SocksUpsellModal.tsx` — strengthen benefits copy, add sub-headline, refine trust line

## How to read the test result

After ~50–100 Step-3 completions:
- Socks take-rate now (position #1) vs. insole take-rate before (position #1) = clean apples-to-apples
- If socks ≥ insoles → keep socks, optionally chain insoles as #2
- If socks < insoles → flip `UPSELL_PRIMARY` back to `"insoles"` (one-line change), socks return to position #2 or get retired

## Risk / rollback

- One-line revert: change `UPSELL_PRIMARY` back to `"insoles"`.
- Insole code paths are unchanged and still fully wired — no regressions possible on flip-back.
- Checkout, pixel events, price guards: all untouched.
