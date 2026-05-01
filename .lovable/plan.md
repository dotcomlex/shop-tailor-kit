## Goal

Make the insole upsell handle 1, 2, or 3+ pair orders cleanly — one insole size per shoe pair, all auto-matched, easy to change, plus an optional "add an extra pair" for shoppers who want more insoles than shoes.

## Behavior

**Auto-match by default (the "smart" part)**
- For every shoe pair the customer added, the modal pre-selects an insole of the same size automatically.
- 1 shoe pair → 1 insole pre-matched. 2 pairs → 2 insoles pre-matched. Etc.
- The CTA total ("Yes, Add for $X.XX") reflects all pairs, no math required from the customer.

**One row per pair, only when needed**
- **1 pair ordered** → a single size row (same compact look it has now). No "Pair 1" label — unnecessary.
- **2+ pairs ordered** → a stacked list, one row per pair, each labeled "Pair 1", "Pair 2", … with the matched shoe color shown as a tiny hint (e.g. "Pair 1 · Black"). Each row shows its insole size and a "Change" affordance that expands an inline size grid for just that row.
- Rows stay collapsed by default so the modal doesn't get tall. Only the row being edited expands.

**Optional extra insole pairs**
- Below the per-pair list, a subtle "+ Add another pair" link (only shown after the per-pair list, max 2 extras so total insoles ≤ 5).
- Each extra pair starts pre-selected to the same size as Pair 1 (best guess), is fully editable, and can be removed via a small × on the row.
- Extras are labeled "Extra pair" so it's visually clear they're above the 1:1 match.

**Pricing**
- CTA total = $14.95 × (shoe pairs + extra pairs added in the modal). Updates live as extras are added/removed or sizes changed.
- Strike-through compare-at scales the same way.

**Layout cleanup**
- Size section sits where it does today (under benefits, above CTA).
- For multi-pair, the section becomes a tidy vertical list with consistent row height; no horizontal scroll, no nested modals.
- Size labels keep the customer's preferred system (Women's US / Men's US / UK / EU) from the shoe step.

## Edge cases

- If a shoe pair has no size selected yet, that row shows "Pick size" and the CTA stays enabled but that row's variant defaults to the largest available (current fallback).
- If two pairs share the same shoe size, both rows still appear independently — customer can change one without affecting the other.
- Out-of-stock insole sizes stay disabled in the picker grid (already handled).

## Technical notes

- `InsoleUpsellModal` props change: replace `shoeSize: string | null` with `shoeSelections: { color: string | null; size: string | null }[]` (passed straight from `OrderPage` `selections`). `bundleQuantity` stays for fallbacks.
- Internal state becomes `rows: { key: string; sourcePairIndex: number | null; variantId: string }[]` — one entry per shoe pair (pre-filled via `pickInsoleVariantForSize`) plus any user-added extras (`sourcePairIndex: null`).
- Override + size-picker state moves from a single `overrideVariantId` to a `Record<rowKey, boolean>` for which row's picker is open.
- `onAccept` signature changes to `(lines: { variant: ShopifyVariant; quantity: 1 }[]) => void`. `OrderPage.handleUpsellAccept` aggregates them into Shopify cart lines (group identical variant IDs into one line with summed quantity to keep the cart tidy) and fires a single `AddToCart` event with `num_items` = total and `value` = total price.
- Cart line attributes updated: `Insole Pairs` becomes total count; add `Pair Match` attribute per line (e.g. "Pair 1, Pair 2" or "Extra") for fulfillment clarity.
- Pixel `ViewContent` keeps firing once per modal open using the first row's variant (current behavior preserved).
- No changes to `pickInsoleVariantForSize` or `parseShopifySize` — reused as-is.

## Files to change

- `src/components/order/InsoleUpsellModal.tsx` — props, state, per-row UI, extra-pair add/remove.
- `src/components/order/OrderPage.tsx` — pass `selections` instead of just first size; update `handleUpsellAccept` to accept multiple lines and aggregate.
