## Step 3 polish + Priority Processing upsell

Three tightly-scoped changes on the Order page.

### 1. Risk-Free Guarantee copy (`RiskFreeGuarantee.tsx`)

Drop the "prepaid return label" promise so the funnel never overpromises something we don't actually do.

- New body copy: *"Wear them every day — long days, swollen evenings, morning stiffness. If they don't change how you experience your feet, send them back for a **full refund**. Easy returns and exchanges, no hassle."*

### 2. Included Checklist wrapping (`IncludedChecklist.tsx`)

Right now the flag emoji can wrap to its own line on narrow viewports (your screenshot shows `🇺🇸` orphaned beneath "free on 2+ pairs"). Two fixes:

- Wrap the trailing `country.flag` together with the last word using a non-breaking space + `whitespace-nowrap` span so the flag never separates from the preceding text.
- Slightly tighten the checklist line so the whole sentence fits cleanly at 390px width (use `text-[12.5px]` on mobile, keep `13.5px` from `sm:` up).

Same treatment applied symmetrically to the 2-pair "Fast & free shipping to {country} 🇺🇸" line.

### 3. Priority Processing one-click upsell (NEW)

A subtle, tappable card placed **between the OrderSummary and the IncludedChecklist** on Step 3 — so it's seen right when the user is reviewing total cost, but doesn't push the CTA below the fold.

**Visual:**
```text
┌─────────────────────────────────────────────┐
│ ⚡  Priority Processing            +$4.95   │
│    Ships within 24h · jumps the queue       │
│                                  [  Add  ]  │
└─────────────────────────────────────────────┘
```

When toggled on:
- Card border turns `verified` green, button flips to "✓ Added".
- The `OrderSummary` adds a new line: `Priority Processing  +$4.95` above the Total, and the Total + sticky-bar total update instantly.
- Price displays in the user's localized currency via the existing `useCurrency` hook (FX uses the same Shopify Markets rate as the bundle product, so totals stay perfectly in sync with checkout).

**Wiring (technical detail):**
- New hook `usePriorityProcessingProduct.ts` mirroring `useSocksProduct` — fetches product `gid://shopify/Product/9077428519198` via the existing Storefront API, picks the first available variant, returns `{ variantId, price }`.
- New `PriorityUpsellCard.tsx` component (presentational + toggle).
- `OrderPage.tsx` holds `priorityAddOn: boolean` state. When true, a `CartLineInput` for that variant is appended in `handleCheckout(extraLines)` exactly the way insole/socks lines already work — so it lands in Shopify checkout as a real line item with its own price, and bumps the `InitiateCheckout` Pixel `value` correctly.
- `OrderSummary` and `StickyCheckoutBar` accept an optional `addOnTotal` number; if > 0, they render the extra line and add it to the displayed total.

**Why this placement & format:** A single, subtle add-on between Summary and Checklist tests well on Shopify funnels (low friction, no modal, no second page). Keeping it as a checkbox-style card — not a modal — means zero added clicks for users who decline. We can A/B the copy later.

### Out of scope (not building unless you ask)
- Shipping protection / extended warranty stack (you can add later as additional cards using the same pattern).
- Any change to the existing insole upsell modal flow.

### Files touched
- `src/components/order/RiskFreeGuarantee.tsx` — copy edit
- `src/components/order/IncludedChecklist.tsx` — wrapping fix
- `src/hooks/usePriorityProcessingProduct.ts` — NEW
- `src/components/order/PriorityUpsellCard.tsx` — NEW
- `src/components/order/UpgradeStep.tsx` — mount card, lift add-on state
- `src/components/order/OrderPage.tsx` — append cart line on checkout, include in Pixel value
- `src/components/order/OrderSummary.tsx` — render add-on line + bump total
- `src/components/order/StickyCheckoutBar.tsx` — bump total

After implementation I'll act as the customer (1-pair flow, toggle Priority on) and verify the line item + price land correctly in Shopify checkout.