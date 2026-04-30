## Recommendation

For a high-converting funnel, the cleanest pattern (used by GoldenWear, BlendJet, Bombas-style funnels) is:

- **Headline = bundle total** (the number that matches checkout exactly)
- **Tiny secondary line below = per-pair breakdown** ("$37.34/pair") — only shown on 2-pair and 3-pair, since it's redundant on 1-pair
- **Strike-through compare price = bundle compare-at total** (so the savings feel bigger and match the "Save 75%" badge)

This way:
1. The number on the card = the number at checkout = no sticker shock at Step 3
2. The per-pair line still anchors the value ("only $37/pair if I get 2") without being the headline lie
3. 1-pair card stays clean — no "/pair" clutter when qty is 1

## Step 1 price column — final layout

```text
1 Pair card:
  £56.00          ← strike-through compare (bundle compare)
  £41.45          ← bold headline (bundle total = checkout)
                  (no per-pair line — redundant)

2 Pair card:
  £112.00         ← strike-through compare
  £74.67          ← bold headline (bundle total)
  £37.34/pair     ← tiny grey secondary line

3 Pair card:
  £168.00
  £99.45
  £33.15/pair
```

## Changes

### `src/components/order/QuantityStep.tsx`
- Switch headline back to `totals.total` (the authoritative Shopify bundle total) and strike-through to `totals.compare`
- Compute per-pair as a small secondary label: `format(totals.total / opt.qty) + "/pair"`
- **Only render the per-pair line when `opt.qty > 1`** (removes "/pair" clutter on the 1-pair card)
- Tighten typography:
  - Compare strike: `text-[13px]` muted
  - Headline total: `text-[20px] font-extrabold` (unchanged size, just different value)
  - Per-pair sub-line: `text-[11px] font-medium` muted, `mt-0.5`
- Keep existing skeleton placeholders so layout doesn't jump while Shopify loads

### Untouched (already correct)
- `OrderPage.tsx` — `visibilitychange` refetch + pre-checkout sync guard stays
- `OrderSummary`, `StickyCheckoutBar`, checkout button — all already use the exact Shopify bundle total
- `useVitalWalkBundles` / `@inContext` currency sync — unchanged

## Result

- Step 1 → Step 3 price = identical (no surprise)
- Per-pair value anchor still visible on 2/3-pair cards where it actually drives the upsell
- 1-pair card is clean, no awkward "/pair" tag
- Every currency stays cent-perfect with Shopify checkout
