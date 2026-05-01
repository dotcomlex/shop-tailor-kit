# Plan: One-Click Insole Upsell Modal

A beautiful modal that intercepts the **Complete My Order** click, offers **VitalWalk Orthopedic Massage Insoles** at **$7.95** (was **$14.95**), with quantity auto-matched to the shoe bundle, sizes pre-set from Step 2, and a single color/variant for zero friction. One tap accepts and continues to checkout. One tap declines and continues to checkout. Either way, the customer ends up at Shopify checkout in the exact same flow they're used to.

---

## Step 1 — Shopify updates

1. **Set compare-at price = $14.95** on every variant of product `9945029935390` (VitalWalk Orthopedic Massage Insoles) so the strikethrough is real, not faked in code.
2. **Pull product imagery from competitor reference** `https://stepprs.com/products/massage` using `code--fetch_website` (screenshot + html), download the hero/lifestyle/feature images, and **upload them to the Shopify insole product** via `shopify--update_product` so the modal pulls them straight from the Storefront API (no hardcoded asset paths).
3. Confirm the insole product has at least one variant marked `availableForSale`. We'll always use the **first available variant** — no size picker, no color picker.

## Step 2 — Data layer

**`src/lib/shopify.ts`**
- Add `INSOLE_PRODUCT_HANDLE` constant (resolved by looking up product `9945029935390` once and storing the handle).
- Add `fetchInsoleProduct(country)` — same `@inContext` pattern as `fetchVitalWalkProduct`, returns `ShopifyProductData | null`.
- Add helper `pickInsoleVariant(product)` → returns the first `availableForSale` variant.

**`src/hooks/useInsoleProduct.ts`** (new)
- React Query hook mirroring `useVitalWalkProduct`: keyed by country, same stale/refresh behavior, same visibility-revalidation as bundles.

## Step 3 — UI: `InsoleUpsellModal.tsx` (new)

Location: `src/components/order/InsoleUpsellModal.tsx`. Built on existing `ui/dialog`, styled with current brand tokens (hairline borders, `YellowCta`, IncludedChecklist-style rows). Mobile-first (matches 691px viewport).

**Layout (top → bottom):**
1. Tight header: "Wait — one-time offer" (small caps, muted) + close X.
2. Product image (Shopify CDN, square, rounded, soft shadow).
3. Title: **VitalWalk Orthopedic Massage Insoles**.
4. **Price block:** `$7.95` large + `$14.95` strikethrough + green "50% OFF — today only" pill. Localized via `formatMoney` using the same currency as the bundle.
5. **3 benefit bullets** (checkmark rows, IncludedChecklist style):
   - Acupressure massage with every step
   - Relieves arch, heel & ball-of-foot pain
   - Fits perfectly inside your VitalWalk shoes
6. **Quantity line** (read-only, soft gray): "Adding **{N} pairs** to match your order" where N = shoe bundle quantity.
7. **Primary CTA** (`YellowCta`): "Yes — Add Insoles & Continue ($7.95/pair)"
8. **Secondary, subtle text link** below: "No thanks, continue without insoles" (gray, underlined on hover, NOT a button — keeps focus on accept).
9. Tiny reassurance line: "Same shipping. Same guarantee."

**Behavior:**
- Cannot be dismissed by backdrop click or ESC during the first 600ms (prevents fat-finger dismissal). After that, ESC/backdrop = decline.
- Locks body scroll while open.
- Renders only when `product` is loaded; if insole product fails to load, modal is skipped entirely and checkout proceeds (never block the user from buying shoes).
- On mount, fires Meta Pixel `ViewContent` for the insole product.

## Step 4 — Wire into `OrderPage.tsx`

Replace the direct `handleCheckout` invocation from `UpgradeStep` with a two-stage flow:

1. **`handleCompleteOrderClick`** (new) — opens the modal. Does NOT yet call Shopify.
2. **`handleUpsellAccept`** — appends an insole line to the `lines` array in `handleCheckout`, with `quantity = bundleQuantity`, then runs the existing checkout creation. Fires Meta Pixel `AddToCart` for the insole variant before `InitiateCheckout`. The existing `InitiateCheckout` `value` is increased by `bundleQuantity * 7.95` (in localized currency).
3. **`handleUpsellDecline`** — runs the existing `handleCheckout` unchanged.

The price-sync guard, validation, attributes, and note-building all stay exactly as they are. The only change inside `handleCheckout` is that it accepts an optional `extraLines: CartLineInput[]` parameter and concatenates them onto `lines`.

**Edge cases handled:**
- Insole product still loading when modal would open → skip modal, go straight to checkout (don't make customer wait).
- Insole variant `availableForSale === false` → skip modal entirely.
- User clicks Complete Order, declines, and clicks again → modal re-opens (so they can change their mind).
- Bundle quantity changes after modal is open (impossible in current UX, but defensive): modal closes on bundle change.

## Step 5 — Tracking

- `ViewContent` (insole) — when modal opens.
- `AddToCart` (insole) — when user accepts.
- `InitiateCheckout` value — bumped by insole subtotal so server-side ROAS reporting is correct.

## Files touched

| File | Change |
|---|---|
| Shopify (admin) | Set `compare_at_price = "14.95"` on all insole variants; upload competitor-quality images to product `9945029935390` |
| `src/lib/shopify.ts` | Add `INSOLE_PRODUCT_HANDLE`, `fetchInsoleProduct`, `pickInsoleVariant` |
| `src/hooks/useInsoleProduct.ts` | NEW — React Query hook |
| `src/components/order/InsoleUpsellModal.tsx` | NEW — the modal |
| `src/components/order/OrderPage.tsx` | Wrap checkout with modal flow; thread `extraLines` through `handleCheckout` |
| `src/components/order/UpgradeStep.tsx` | No change (already calls `onCheckout` prop) |
| `src/components/order/StickyCheckoutBar.tsx` | No change (same prop) |

## Tools the build will use

1. `code--fetch_website` on `https://stepprs.com/products/massage` (screenshot + html) → identify product images.
2. `curl` to download chosen images to `/tmp/`.
3. `shopify--get_product` on `9945029935390` → get current variant IDs and handle.
4. `shopify--update_product` → upload the new images to the insole product.
5. `shopify--update_product_variant` × N → set `compare_at_price: "14.95"` on every insole variant.
6. Code edits as listed above.

Approve and I'll execute the Shopify updates, image sourcing, and code in one pass.