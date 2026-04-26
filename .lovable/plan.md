
# Three fixes: Sticky CTA polish + Pricing update + iOS popup-blocker fix

Three independent issues, ordered by conversion impact (popup fix is the most critical — it's actively killing iPhone sales right now).

---

## 1. 🚨 Fix iOS Chrome popup blocker (CRITICAL — blocking checkouts)

### What's happening
In `OrderPage.tsx → handleCheckout()`:
```ts
setIsCheckingOut(true);
const { checkoutUrl } = await createCheckoutForLines(lines);  // ← async wait
window.open(checkoutUrl, "_blank");                            // ← popup blocked
```

iOS Safari and iOS Chrome **revoke the user-gesture trust** as soon as you `await` a network call. By the time `window.open()` runs, the browser no longer considers it a "user-initiated" action and shows the "Allow popups?" prompt. **Yes — this happens on every session, every checkout, on every iPhone.** It is silently killing mobile conversions right now.

### The fix — open the tab synchronously, then navigate it once the URL is ready

This is the standard pattern used by Shopify, Stripe Checkout, and PayPal. The trick: open a blank tab *immediately* on click (while the gesture is still trusted), then set its `location.href` after the API resolves.

```ts
const handleCheckout = async () => {
  if (!product) {
    toast.error("Product is still loading. Please wait a moment and try again.");
    return;
  }

  // 1. Open the tab SYNCHRONOUSLY while the click gesture is still trusted.
  //    iOS will allow this — no popup prompt.
  const checkoutWindow = window.open("about:blank", "_blank");

  // …validation + variant resolution (synchronous, no awaits) …

  setIsCheckingOut(true);
  try {
    const { checkoutUrl, error } = await createCheckoutForLines(lines);
    if (!checkoutUrl) {
      checkoutWindow?.close();          // clean up the blank tab
      toast.error(error ?? "Could not create checkout. Please try again.");
      return;
    }
    if (checkoutWindow) {
      checkoutWindow.location.href = checkoutUrl;   // navigate the already-open tab
    } else {
      // Fallback for the rare case the browser blocked even the blank open
      window.location.href = checkoutUrl;
    }
  } catch (err) {
    checkoutWindow?.close();
    console.error("Checkout failed:", err);
    toast.error("Something went wrong starting checkout. Please try again.");
  } finally {
    setIsCheckingOut(false);
  }
};
```

**Important reorder**: move all the synchronous validation (variant lookup, color/size checks) **before** the `window.open` call so we don't open a blank tab and then immediately error out. Open the tab only once we know we're going to checkout.

Refined order:
1. Validate `product` exists.
2. Resolve all selections → variants synchronously. If any fail, toast and bail (no tab opened).
3. **Now** call `window.open("about:blank", "_blank")` — gesture still trusted because no awaits yet.
4. Then `await createCheckoutForLines(...)` and assign `checkoutWindow.location.href`.

This eliminates the popup prompt on iOS Chrome/Safari completely.

### Files
- `src/components/order/OrderPage.tsx` — refactor `handleCheckout` per above.

---

## 2. 💰 Update pricing — $69.95 base @ 70% off, WCS-style tiered bundles

### Current vs new pricing

The base price on Shopify is now **$69.95** (was $59.95). 70% off means the compare-at price is **$233.17** for a single pair. For multi-pair bundles, we mimic WeatherproofComfortShoes' (and similar DTC) ladder: small per-pair discount that grows with quantity, while the "Save %" climbs because the compare-at scales linearly.

| Qty | Per pair | Total      | Compare-at | Save  | Ribbon         |
|-----|----------|------------|------------|-------|----------------|
| 1   | $69.95   | $69.95     | $233.17    | 70%   | —              |
| 2   | $62.95   | $125.90    | $466.33    | 73%   | MOST POPULAR   |
| 3   | $57.95   | $173.85    | $699.50    | 75%   | BEST DEAL      |

Why this ladder works:
- **Anchor stays consistent** — every tier is anchored against "70% off retail," so the math feels honest.
- **Per-pair savings grow** ($7 off for 2-pack, $12 off for 3-pack) — clear incentive to bundle without giving away the farm.
- **Save % climbs by 3 points per tier** — psychologically rewarding ("the more I buy, the bigger the win") without the absurd "Save 60% on a 3-pack vs 50% on 1-pack" jump we have today, which makes the 1-pack look like a rip-off.
- **Total prices stay under $200** for all tiers — keeps the 3-pack within impulse range.

### Where the numbers live

**`src/components/order/QuantityStep.tsx`** — `OPTIONS` array constants:
```ts
const OPTIONS: BundleOption[] = [
  { qty: 1, name: "1 Pair VitalWalk® Shoes", perPair: 69.95, total: 69.95,  compare: 233.17, savePct: 70 },
  { qty: 2, name: "2 Pairs VitalWalk® Shoes", perPair: 62.95, total: 125.90, compare: 466.33, savePct: 73, ribbon: { label: "MOST POPULAR", tone: "popular" } },
  { qty: 3, name: "3 Pairs VitalWalk® Shoes", perPair: 57.95, total: 173.85, compare: 699.50, savePct: 75, ribbon: { label: "BEST DEAL", tone: "best" } },
];
```

These flow through `OrderPage.tsx` (`bundleTotal` / `bundleCompare` from `useMemo`) into `UpgradeStep` → `OrderSummary`, `SavingsHero`, and `StickyCheckoutBar` — no other changes needed; everything is driven from this single source.

**`src/hooks/useVitalWalkProduct.ts`** — update the static fallback so the page never flashes the old price before Shopify responds:
```ts
export const STATIC_FALLBACK = {
  price: "69.95",
  compareAtPrice: "233.17",
  currency: "USD",
};
```

### Note on currency conversion
The `useCurrency` hook already converts USD → local currency via live rates, so UK/EU/AU shoppers will see the correctly-converted equivalents automatically. No additional work needed there.

### Files
- `src/components/order/QuantityStep.tsx` — update the three `OPTIONS` entries.
- `src/hooks/useVitalWalkProduct.ts` — bump `STATIC_FALLBACK` to match.

---

## 3. 🎨 Redesign the sticky checkout bar (Step 3)

### What's wrong now
At 390px viewport, the current bar squeezes "Total + price + struck-through compare + Lock icon + 'Complete Order' label + arrow circle" into one cramped row. The yellow CTA ends up tiny, the lock icon collides with the label, and the right-side arrow circle eats space the CTA needs to feel tappable. It looks budget — exactly the wrong vibe at the moment a shopper commits.

### New design — clean, premium, two-zone layout

```
┌──────────────────────────────────────────────────────┐
│  $173.85  $699.50      ┃   Complete Order      →    │
│  Save $525.65 (75%)    ┃                            │
└──────────────────────────────────────────────────────┘
   ← left zone (price + savings)   ← right zone (yellow CTA)
```

Specifics:
- **Two clear zones separated by a subtle vertical hairline** — not a gap, a divider. Reads as one unified bar.
- **Left zone** (~38% width): 
  - Big total `text-[20px] font-extrabold tabular-nums` — the hero number.
  - Compare-at right next to it, smaller (`text-[12px]`), struck-through, muted.
  - Below: green "Save $X.XX (Y%)" microline (`text-[11px] font-bold text-[hsl(var(--save-green))]` or the existing `text-save` token) — reinforces the deal at the moment of decision.
  - **Drop** the "TOTAL" uppercase eyebrow — it's wasted vertical space; the price size makes it obvious.
- **Right zone** (~62% width, flex-1):
  - Yellow pill CTA, **taller** (`h-13`, ~52px) — meets Apple/Google 48px+ tap-target guidance comfortably.
  - Single label "**Complete Order**" — extrabold, `text-[15px]`, no lock icon (the SSL/Shopify trust line above the bar already covers this; the icon was clutter).
  - Subtle right-aligned arrow inside the pill (no circle wrapper) — `→` chevron at `text-[16px]` with `ml-auto`. Cleaner than the dark circle.
  - Soft yellow glow on the pill (`shadow-[0_4px_14px_-4px_hsl(var(--order-yellow-deep)/0.45)]`) so it floats above the bar visually.
- **Bar container**:
  - Increase vertical padding `py-3` → `py-3.5` for breathing room.
  - Stronger top shadow `shadow-[0_-8px_24px_-10px_rgba(0,0,0,0.18)]` — it should feel like a floating sheet, not a sticker glued to the bottom.
  - Keep `backdrop-blur-md` and `bg-background/95` — that frosted glass works.
- **Loading state**: replace the label with `Processing…` and show a spinner inline at the right (replacing the arrow). Same height — no layout jump.

### Why this is better
- **Tappable** — CTA is now ~62% of bar width × 52px tall instead of fighting for space with an icon and a circle badge.
- **Scannable** — total + compare + savings stack reads instantly; the yellow CTA is the obvious next action.
- **Premium** — the hairline divider and soft glow are the small details that separate a $59.95 "looks cheap" page from a $173.85 "this is a real brand" page.
- **Conversion math** — bigger button + savings reminder right at the commit moment is a textbook lift pattern (Baymard, ConversionXL).

### Files
- `src/components/order/StickyCheckoutBar.tsx` — full layout rework per above.

---

## Summary of file changes

| File | Change | Why |
|---|---|---|
| `src/components/order/OrderPage.tsx` | Refactor `handleCheckout` to open tab synchronously before await | **Fixes iOS popup blocker — critical for mobile conversions** |
| `src/components/order/QuantityStep.tsx` | Update `OPTIONS` pricing array | New $69.95 base + WCS-style tier ladder |
| `src/hooks/useVitalWalkProduct.ts` | Update `STATIC_FALLBACK` constants | Prevents old-price flash on first load |
| `src/components/order/StickyCheckoutBar.tsx` | Layout rework: two-zone design, taller CTA, savings line, soft glow | Premium, conversion-optimized sticky bar |

No new dependencies. No structural changes to data flow — every fix is local to the file mentioned.
