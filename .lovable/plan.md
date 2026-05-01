# Fix incorrect insole upsell pricing

The wrong price is coming from variant selection, not from a hardcoded modal price.

I checked the live insole product data and found that the insole product currently has mixed variant pricing:
- the first 2 size variants are still $7.95
- the remaining size variants are $14.95
- compare-at price is $29.95

Right now the modal uses the first available insole variant, so it can surface the $7.95 variant even when the customer should be seeing the $14.95 one.

## Plan

1. Replace the current “first available insole variant” logic with size-aware matching.
   - Match the shopper’s selected shoe size to the corresponding insole size variant.
   - Use that matched insole variant for the modal display, CTA total, pixel value, and checkout line item.

2. Pass the selected shoe size into the upsell modal.
   - The modal currently only receives the product and bundle quantity.
   - I’ll also pass the customer’s selected size so the modal price reflects the actual variant that will be added.

3. Add a safe fallback so the modal never shows the wrong lower price again.
   - If an exact size match fails, fall back to a deterministic valid variant strategy instead of blindly choosing the first available one.
   - Keep the checkout line item and displayed price in sync.

4. Preserve the current UI redesign exactly as-is.
   - No visual rollback.
   - Only pricing/variant-selection behavior will change.

## Technical details

Files to update:
- `src/lib/shopify.ts`
- `src/components/order/OrderPage.tsx`
- `src/components/order/InsoleUpsellModal.tsx`

Implementation approach:
- Add a helper that selects an insole variant by size string instead of first available.
- Derive the upsell size from the customer’s selected shoe size.
- Use the matched variant everywhere the upsell currently reads `variant.price` / `variant.compareAtPrice`.
- Keep bundle quantity multiplication intact, but base it on the matched $14.95 variant.

## Important note

If every insole size is supposed to be $14.95 in the catalog, the live product data should still be cleaned up later because two variants are currently priced at $7.95. This code fix will stop the modal from defaulting to those smaller-size variants, but it will not change the catalog data itself unless you explicitly want that done.