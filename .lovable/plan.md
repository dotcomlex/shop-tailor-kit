## Bug found during E2E verification

The funnel renders, the upsell opens, geo + currency localize, sales toasts fire, and the FB pixel sends `ViewContent` / `AddToCart` / `InitiateCheckout`. **But the bundle-tier matching is broken** because you renamed the Shopify option values:

- Code expects: `"1x Pair - 70% OFF"` / `"2x Pairs - 75% OFF"` / `"3x Pairs - 80% OFF"`
- Shopify now has: `"1x Pair - (70% OFF)"` / `"2x Pairs - (75% OFF)"` / `"3x Pairs - (80% OFF)"`

Effects:
- `findBundleVariant()` returns `undefined` → `projectTier()` falls back to the product's `priceRange.minVariantPrice`, which is **always $49.95** (cheapest variant across all tiers).
- That's why during my E2E test the Step 3 total flipped from $109.90 to $99.90 after I touched the upsell modal — React Query refetched and overwrote my synthetic per-tier price with the global min.
- Checkout would also fail at the resolve step: "We couldn't find Black in size US W 9 / US M 8 / UK 7."

**Fix is a label-tolerant matcher — no Shopify edits.**

## Fix

### `src/lib/shopify.ts`

1. Replace `BUNDLE_TIER_LABEL` with a regex matcher that extracts the leading `Nx` token, so any future label rewording (parens, emoji, "Pack of N", etc.) keeps working:

   ```ts
   function tierFromValue(value: string): 1 | 2 | 3 | null {
     const m = value.match(/^\s*([123])\s*x/i);
     return m ? (Number(m[1]) as 1 | 2 | 3) : null;
   }
   ```

2. Rewrite `findBundleVariant(product, tier, color, size)` to use `tierFromValue` against the `Bundle Deal` option (still tolerant of `Color`/`Color:` and `Size`/`Size:` colon variants).

3. Rewrite `projectTier(product, tier)` to find any variant whose `Bundle Deal` value resolves to that tier (instead of literal-string equality), so `bundles[1|2|3]` always carries the correct per-pair price.

4. Pre-checkout sync stays the same — it just consumes the corrected `projectTier`.

### Re-verify after fix (no code changes needed elsewhere)

Walk the full flow in the preview browser and confirm:

- **Step 1** — pack-size cards show $59.95 / $109.90 ($54.95/pair) / $149.85 ($49.95/pair).
- **Step 2** — color + size selectable per pair (color comes from `Color:` option, size from `Size:` option).
- **Step 3** — $54.95 × 2 = $109.90 with $439.60 strikethrough.
- **Sticky bar / FAQs / scroll behavior** unchanged.
- **Insole upsell** opens with size auto-matched per pair; Step 3 total **stays $109.90** after the modal closes (this is the regression I just caught).
- **Cart create network call** — payload contains real Bundle×Color×Size variant IDs, one line per unique pair (or merged with `quantity: 2` if both pairs match). Inspect via `browser--list_network_requests` for the `cartCreate` POST.
- **Currency converter / geo** — header pill still shows "USD" by IP; Markets `@inContext` still applies.
- **Sales notifications** (`RecentPurchaseToasts`) still cycling on Steps 1–2, paused on Step 3.
- **Checkout URL** ends with `?channel=online_store`, opens the real Shopify checkout, totals match to the cent.

### Safety / paid-traffic checklist

- ✅ Read-only Storefront API; **no Admin writes, no product/variant edits.**
- ✅ Single product `official-vitalwalk®` (verified live).
- ✅ Robust to future Shopify label rewording.
- ✅ Pixel events + currency conversion + insole upsell preserved.

Approve and I'll implement the matcher fix and re-run the full E2E.