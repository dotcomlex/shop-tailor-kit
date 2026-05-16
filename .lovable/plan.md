## New pricing strategy

A clean, consistent ladder that lifts margin on every tier, fixes the 3-pair bleed, undercuts White Comfort's $69.99, and uses free shipping as a sitewide trust signal (it costs nothing — already baked into COGS).

### The new ladder (US)

| Tier | Price | Per pair | vs. old | COGS | Profit | Margin |
|---|---|---|---|---|---|---|
| 1 pair | **$64.95** | $64.95 | +$5.00 | $29.37 | **$35.58** | 55% |
| 2 pair | **$109.90** | $54.95/ea | +$9.98 | $56.31 | **$53.59** | 49% |
| 3 pair | **$149.85** | $49.95/ea | +$29.95 | $83.26 | **$66.59** | 44% |

All tiers ship free.

### UK ladder (mirrored structure, GBP)

| Tier | Price | Per pair | COGS | Profit |
|---|---|---|---|---|
| 1 pair | £49.95 | £49.95 | £23.19 | £26.76 |
| 2 pair | £84.90 | £42.45/ea | £44.26 | £40.64 |
| 3 pair | £114.85 | £38.28/ea | £64.79 | £50.06 |

### Why this works

- **Still cheaper than White Comfort** ($64.95 vs $69.99) — keeps the "value alternative" wedge
- **3-pair margin fixed**: $12.21/pair → $22.20/pair (no more bleeding on your highest-volume bundle aspiration)
- **Clean mental math ladder**: $64.95 → $54.95 → $49.95 ($10 then $5 drop per pair — feels like real savings)
- **Free shipping everywhere** — biggest cart-abandonment killer, zero real cost since shipping is in COGS
- **Strikethrough story stays strong** — anchor against a single MSRP (e.g. $89.95) so each tier still shows a chunky "Save X%"

### What changes in the app

**Pricing source of truth**
- Update the pricing config / constants used by `QuantityStep`, hero, sticky bar, order summary, and any tier cards
- Single price object per region: `{ tier1, tier2Total, tier3Total }` so per-pair display is always derived

**UI copy + badges**
- Every tier card shows **"Free shipping"** badge (not just 2+/3+)
- Header announcement bar: **"Free shipping on every order"** (replace any threshold copy)
- Hero / sticky CTA price updates to **$64.95**
- "Save X%" strikethrough recalculated against a consistent MSRP anchor
- Highlight 2-pair as **"Most Popular"** and 3-pair as **"Best Value — Save $X total"**

**Checkout / cart**
- Shopify variant prices updated to new amounts (1-pair variant, 2-pair bundle, 3-pair bundle) for both US and UK markets
- Remove any "free shipping when you add a 2nd pair" upsell copy — it's now universal

**Ads/landing safety**
- You confirmed ads don't quote a specific price → safe to roll out immediately, no ad coordination needed
- Keep $59.95 nowhere on the site to avoid confusion

### Out of scope (for a follow-up)

- A/B test 1-pair at $64.95 vs $69.95 (matching competitor) once 7 days of conversion data is in
- Bundle a free pair of socks/insoles on 3-pair as a soft incentive instead of price drops
- Region auto-detect for GBP pricing if not already in place

### Rollout order

1. Update pricing constants (one source)
2. Update Shopify variant prices (US + UK)
3. Sweep UI: tier cards, hero, sticky bar, announcement bar, order summary
4. Verify in preview: quantity step, cart drawer, checkout total all match
5. Publish
