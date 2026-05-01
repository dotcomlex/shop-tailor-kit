# Smart insole size matching + manual override in upsell modal

The missing **US W 5 / US M 4 / UK 3** insole variant has been added to the catalog at $14.95 / $29.95, so every shoe buyer now has a matching insole option.

## Plan

**1. Smarter size matching (`src/lib/shopify.ts`)**

Replace the current strict matcher with a 3-step strategy:
- Exact match on US Women / US Men / UK token (e.g. shoe US W 9 → insole US W 9).
- If the shoe size is a half size with no exact insole match (e.g. US W 8.5), round **up** to the next whole insole size (industry standard for trim-to-fit insoles — better to size up and trim than size down).
- If the shoe size is bigger than every insole, fall back to the largest insole available.

**2. Show the matched size in the modal (`src/components/order/InsoleUpsellModal.tsx`)**

Under the price, add a compact "Your size" pill:

```text
Your size: US W 9 / US M 8 / UK 7   [Change ▾]
Auto-matched to your shoes · half sizes round up, trim-to-fit
```

- The pill is tappable. Tapping it expands a small chip grid of all available insole sizes so the customer can override.
- Whatever size is selected drives the displayed price, the CTA total, the Facebook Pixel value, and the variant sent to checkout.
- Manual override is sticky for the rest of the session.

**3. Wire the size through (`src/components/order/OrderPage.tsx`)**

Already passing `shoeSize` to the modal — no further changes needed there. The modal will own its own "selected insole size" state, defaulting to the auto-matched one.

## Technical details

Files to edit:
- `src/lib/shopify.ts` — upgrade `pickInsoleVariantForSize` with round-up logic.
- `src/components/order/InsoleUpsellModal.tsx` — add `selectedSize` state, "Your size" pill, expandable size grid, and recompute pricing from the chosen variant.

No catalog changes required (the US W 5 variant was already created above).