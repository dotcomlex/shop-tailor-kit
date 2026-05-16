# Step 1 Polish — Make it feel "holy shit," not overwhelming

Goal: Step 1 should fit on one mobile screen (390×844), feel premium and aesthetic, and channel scarcity *outside* the bundle cards so they can breathe.

## The four moves

### 1. Lift the countdown OUT of the card area — make it a global page strip
Right now the "Sale ends in 02:19" strip sits between the green step header and the bundle cards, crowding the most important content. Move it to a slim global strip pinned **above the whole white order container** (above the SiteHeader-adjacent section, or just under it — whichever reads cleaner against the dark page background).

- New component: `src/components/order/GlobalUrgencyBar.tsx` — full-width slim bar (32px tall), dark green/red gradient or solid `--save` red, white text: "⏰ Flash Sale ends in **02:19** · Free shipping on every order". Uses the same `vitalwalk_offer_deadline_v2` localStorage key so it stays in sync with Step 3's `ScarcityBar`.
- Mount it inside `OrderPage.tsx`, right above the first `<section>` / SiteHeader wrapper so it spans the full viewport width.
- Delete `Step1UrgencyStrip` from inside `QuantityStep` (the component file can stay for now or be removed — the plan removes its usage; we can clean up the file in the same change).

### 2. Replace the per-card "FREE SHIPPING" pills with ONE scrolling marquee
Repeating "FREE SHIPPING" on all 3 cards dilutes its value. Pull it out and make it a single, animated band that sits **between the green sub-strip ("You can select color and size on next step") and the bundle list**.

- New component: `src/components/order/FreeShippingMarquee.tsx` — full-width thin band (~30px), soft cream/verified-green tinted background, single line of right-to-left scrolling text that repeats:
  > 🚚 FREE SHIPPING TODAY ONLY  ·  ✦  ·  60-DAY MONEY-BACK GUARANTEE  ·  ✦  ·  SHIPS IN 24H  ·  ✦
- Pure CSS `@keyframes` translateX animation, ~25s loop, `prefers-reduced-motion` disables it.
- Remove the green `Truck + Free Shipping` pill from every bundle card. The card content becomes: thumb · (name + Save %) · price column. Cleaner, less visual weight.

### 3. Tighten bundle names and card density
Names are fine as "1 Pair / 2 Pairs / 3 Pairs" but feel vague alone. Add a tiny **per-pair savings line** to give them substance without bringing back the brand name.

Card content becomes:
```
[thumb] 1 Pair                $216.50
        Save 70% · $151 off   $64.95 /ea
```
- Headline: `1 Pair` / `2 Pairs` / `3 Pairs` (same as today, 17px extrabold)
- Sub-line: `Save 70% · $151 off` — combines the save % with the absolute $ saved (compare − total), tabular-nums, 13px. The absolute-dollar number is what actually moves people; % alone is abstract.
- Remove the shipping pill (now in the marquee).

Card padding drops from `p-3` to `p-2.5`, gap between cards from `space-y-2.5` to `space-y-2`. Saves ~30px vertical — exactly what we need to fit the page.

### 4. Fit the whole step on one screen — kill the empty space below
At 390×844 the current layout overflows slightly and leaves dead space because the trust strip + payment logos sit far below the CTA. Compress:

- Remove the StepHeader's `subStrip` ("You can select color and size on next step") — it's redundant once you reach Step 2 anyway, and it eats ~36px. Move that copy to a tiny `text-[11px] text-muted` line directly under the CTA: "Color & size on next step →".
- Bundle list `mt-2.5` → `mt-2`, list `space-y-2.5` → `space-y-2`.
- CTA `mt-4` → `mt-3`.
- Trust strip `mt-3` → `mt-2`, payment-badge img `h-[16px]` (unchanged).
- Net: ~70px reclaimed. Step 1 fits cleanly on iPhone 12/13/14/15 (390×844) with the global urgency bar visible.

## Visual hierarchy after the changes (top → bottom)

```
┌──────────────────────────────────────────┐
│ 🔥 Flash Sale ends in 02:19 · Free ship  │  ← NEW global urgency bar
├──────────────────────────────────────────┤
│ VitalWalk logo    USD    Need help?      │  ← SiteHeader
├──────────────────────────────────────────┤
│ 1. Select Quantity        Bundle & Save! │  ← StepHeader (no sub-strip)
├──────────────────────────────────────────┤
│ « FREE SHIPPING TODAY · 60-DAY GUARANTEE »│  ← NEW scrolling marquee
├──────────────────────────────────────────┤
│ ○ [👟] 1 Pair                    $216.50 │
│        Save 70% · $151 off       $64.95  │
│                                          │
│ ● [👟] 2 Pairs       MOST POPULAR        │
│        Save 80% · $220 off       $54.95  │
│                                          │
│ ○ [👟] 3 Pairs       BEST DEAL           │
│        Save 85% · $283 off       $49.95  │
├──────────────────────────────────────────┤
│      [ Select Your Color and Size → ]    │
│           Color & size on next step      │
├──────────────────────────────────────────┤
│  ★★★★★ 4.9 · 2,847 reviews · 60-Day      │
│      VISA · MC · CF · PayPal · SSL        │
└──────────────────────────────────────────┘
```

## Technical details

- **Files created:** `GlobalUrgencyBar.tsx`, `FreeShippingMarquee.tsx`.
- **Files edited:** `QuantityStep.tsx` (remove urgency strip + shipping pill, add per-card $ saved, tighten paddings), `OrderPage.tsx` (mount GlobalUrgencyBar at the very top), `StepHeader` usage (drop subStrip on Step 1 only — pass `subStrip={undefined}`).
- **Files removed (usage):** `Step1UrgencyStrip` no longer imported. File can be deleted.
- **Shared deadline:** GlobalUrgencyBar reads/writes `vitalwalk_offer_deadline_v2` so its timer matches Step 3's `ScarcityBar` to the second.
- **No business logic touched** — no Shopify, no cart, no pricing math beyond computing `compare − total` for the per-card "$X off" display (data already available via `readLocalizedTotals`).
- **Accessibility:** marquee gets `aria-hidden` + paused under `prefers-reduced-motion`; urgency timer uses `aria-live="polite"`.

## What we deliberately are NOT doing

- No changes to Step 2 / Step 3 / sticky bar / priority upsell.
- No changes to Shopify prices, discount codes, or bundle products.
- Not removing free-shipping copy entirely — moving it from 3 weak repetitions to 1 prominent moving banner that *adds* scarcity ("today only").
