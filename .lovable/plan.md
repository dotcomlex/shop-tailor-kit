# Strip the sidebar — keep checkout focused on checkout

You're at 390px and the right column (`ProductPanel` + `GuaranteeBlock` + `ReviewsBlock`) collapses below the 3-step flow, creating a long, cluttered tail: hero image → 60-Day Guarantee starburst → Trustpilot reviews → "Show more reviews ▼". After a user has already seen the CTA and trust microline, that extra ~600–800px of scroll is pure friction. Cut it.

## What changes

**File: `src/components/order/OrderPage.tsx`**

1. **Delete the entire `<aside>` block** (lines 147–156) — the product panel, guarantee, reviews, and their dividers.
2. **Collapse the grid** — remove `grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-10` and the wrapping `<div>`, since there's no longer a right column. The order flow becomes the single centered column.
3. **Tighten the main container width** — with one column the `container-order` class will already center; just constrain to `max-w-[640px] mx-auto` on the flow wrapper so it doesn't stretch awkwardly wide on desktop.
4. **Remove the now-unused imports** for `ProductPanel`, `GuaranteeBlock`, `ReviewsBlock`.

## What stays

- `SiteHeader` (with currency chip)
- The 3-step flow: `QuantityStep` → `ColorSizeStep` → `UpgradeStep`
- Inside `UpgradeStep`: savings hero, scarcity bar, order summary, protection toggle, CTA, trust microline, payment badges
- Footer copyright

## Why not just hide on mobile?

Hiding-but-keeping-on-desktop sounds tempting, but the desktop sidebar repeats info already visible in the steps (product name, savings, trust signals). Removing it everywhere is the cleaner call and matches your "make checkout flow clean and easy" direction.

## Files left intact (just unused)

`ProductPanel.tsx`, `GuaranteeBlock.tsx`, `ReviewsBlock.tsx` will remain in the codebase but unimported. Say the word and I'll delete them too on the next pass — keeping them around for now in case you want them back on a separate product page later.

## Out of scope

- The 3-step flow itself, payment badges, currency converter, color/size pickers — all working as designed and untouched.
