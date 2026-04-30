## What I'm doing

Three things, in order of impact:

1. **Trust strip under Step 1 button** — adds social proof at the highest-drop-off point in the funnel
2. **Verify + harden currency sync** so 2-pair / 3-pair totals match Shopify checkout to the cent in every enabled currency
3. **Make Step 1 paint instantly** when arriving from the product page (perceived load speed)

No design tokens or color hardcoding — everything stays in the existing semantic palette.

---

## 1. Trust strip under "Select Your Color and Size"

A single, compact horizontal strip — not a noisy badge wall. Three signals only, separated by tiny dots:

```text
★★★★★  4.9 / 5  ·  100,000+ Happy Customers  ·  60-Day Money-Back Guarantee
```

Constraints, per the reviews policy:
- **No fabricated review text or fake reviewer names.** The "100,000+ Happy Customers" + "4.9/5" line is a brand stat the user already uses elsewhere on the site (it's in `VerifiedReviewsBlock` / `RiskFreeGuarantee` — I'll mirror the exact wording). I will reuse what already exists in the project, not invent new claims.
- If the existing components don't already display "4.9/5" / "100k+", I'll **drop the rating number** and use only the guarantee + customer-count language already present in the codebase. (I'll confirm by reading `VerifiedReviewsBlock.tsx` and `RiskFreeGuarantee.tsx` before writing.)

### File: `src/components/order/QuantityStep.tsx`
- Add a new `<TrustStrip />` row immediately after `<YellowCta>`.
- Layout: `flex items-center justify-center gap-2`, `mt-2.5`, text `[11.5px]` muted, dot separators as `<span aria-hidden>·</span>`.
- Stars rendered as inline SVG (5 filled stars, `text-[hsl(var(--order-blue))]` or yellow accent — match existing star color used in `VerifiedReviewsBlock`).
- Wraps gracefully on 320px width (small screens stack the guarantee line below).

No new dependencies.

---

## 2. Currency sync verification + small hardening

The sync architecture is already correct (I confirmed by reading `OrderPage.tsx`, `useVitalWalkProduct.ts`, `useCurrency.ts`):

- All three bundle products are fetched in **one** Shopify `@inContext` call with the buyer's country code → Shopify returns the exact localized total per bundle.
- The displayed total = `bundles[quantity].priceRange.minVariantPrice.amount` directly (no division, no FX math).
- `visibilitychange` invalidates the query when the tab refocuses.
- The pre-checkout guard re-fetches and refuses to redirect if the price moved ≥ 1¢.
- Checkout is created with the same `countryCode` passed to `buyerIdentity`, so Shopify charges in the same currency it quoted.

Two small hardenings I'll add:

a. **Stale-while-revalidate window**: `staleTime` is 5 min. I'll **lower it to 60s** and add `refetchOnWindowFocus: true` and `refetchOnReconnect: true` on `useVitalWalkBundles`. This means after ~1 minute of idle the page silently re-pulls in the background, so a user who lingers on Step 1 for 3 minutes still sees a fresh price before clicking through.

b. **Per-pair display rounding**: on Step 1 the `/pair` sub-line shows `format(total / qty)`. With Shopify's 2-decimal totals, a 3-pair £74.99 bundle would show £24.9966… → `formatMoney` already rounds to 2 decimals via `Intl.NumberFormat`, so this is fine — but I'll add a short comment in `QuantityStep.tsx` calling out that the per-pair number is informational and the **headline + checkout always use the unrounded Shopify total**, so the customer is never charged based on the rounded per-pair figure.

That's it for currency — the architecture is already cent-accurate by construction. There's nothing to "fix"; these are belt-and-suspenders.

---

## 3. Load-speed: instant Step 1 paint from the product page

Right now, Step 1 cards show skeleton placeholders until Shopify responds (~300–800ms). Two changes:

### a. Prefetch bundles on the product page

Add a `useEffect` on the product page (or the link/CTA component that navigates to `/order`) that calls `queryClient.prefetchQuery` with the same `["vitalwalk-bundles", country]` key the order page uses. By the time the user clicks "Order Now", the data is already in the React Query cache → Step 1 paints with real prices immediately, no skeleton flash.

I'll find the link to the order page (likely in the homepage hero / product CTA) and add the prefetch there. **If the homepage already mounts `useVitalWalkBundles` for its own pricing, no change needed — the cache is shared.** I'll confirm by grepping for `useVitalWalkBundles` / `useVitalWalkProduct` usage outside the order folder before writing.

### b. Warm geo + bundles in parallel on app boot

Currently `useVitalWalkBundles` waits for `useGeo` to resolve (because country code is the query key). I'll:
- Have `useGeo` populate from a synchronous source first (e.g. `navigator.language` country hint or a cached value in `localStorage`) so React Query can fire the bundles request immediately on first paint, then revalidate when the real geo arrives.
- This shaves ~150–400ms off first paint for return visitors.

### c. Preconnect hint

Add `<link rel="preconnect" href="https://{shop}.myshopify.com" crossorigin />` and `<link rel="dns-prefetch" href="https://{shop}.myshopify.com" />` to `index.html`. Saves the TLS handshake on the first Storefront API call (~100–250ms on mobile).

---

## Files touched

- `src/components/order/QuantityStep.tsx` — append trust strip after the CTA; add the per-pair sync comment
- `src/hooks/useVitalWalkProduct.ts` — `staleTime: 60_000`, `refetchOnWindowFocus: true`, `refetchOnReconnect: true`
- `src/hooks/useGeo.ts` — cache last-known country in `localStorage`, hydrate synchronously on mount (only if it currently has an async-only init)
- One file in the homepage/product-page CTA path — prefetch bundles on hover/mount of the "Order" link (file confirmed during implementation)
- `index.html` — preconnect + dns-prefetch tags for the Shopify domain

## What I will NOT do

- No fake reviewer names, quoted testimonials, or fabricated star counts (per reviews policy).
- No new color tokens or hardcoded colors — strip uses the existing muted/accent tokens.
- No changes to `OrderPage.tsx` checkout logic — it's already correct.
- No new dependencies.
