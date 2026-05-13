# Compression Socks — Decline-Path Upsell

## Goal

When a customer declines the insole upsell, show ONE more lightweight, beautifully-designed offer for the **3-pack of compression socks** (already priced 50% off in Shopify at $14.95). Auto-pick the right size based on what the customer chose in Step 2, but let them change it if needed. One-tap accept, then continue to checkout.

## Funnel placement

```text
Quantity → Color/Size → [Insole modal]
                              ├── Accept → checkout (with insoles)
                              └── Decline → [NEW Socks modal]
                                                ├── Accept → checkout (with socks)
                                                └── Decline → checkout (shoes only)
```

Insole-acceptors do NOT see the socks modal in this test (we'll layer that in later if this wins).

## Sizing strategy (the key change)

Looking at the competitor and standard compression-sock sizing, the live Shopify product almost certainly has S/M and L/XL variants (and possibly colors — we'll ignore color for V1 unless the user has a strong preference and pick the first available).

**Auto-match logic** (mirrors how the insole modal does it):
- Read the customer's shoe size from Step 2 (already stored in `shoeSelections`).
- Map to sock size: roughly **US Women ≤ 8 / US Men ≤ 7.5 → S/M**, larger → **L/XL**. Exact thresholds confirmed against the actual Shopify variant titles when I pull them.
- If customer ordered multiple shoe pairs of different sizes → pre-select based on the **first pair**, customer can change.

**UI:**
- Show ONE pre-selected size pill prominently with a small "Change" link (same pattern as insole modal's per-pair selector, but simpler — single row, no per-pair list because we're only offering 1 pack of 3 pairs).
- "Change" expands a small grid of all available sock sizes (S/M, L/XL).
- If a variant is out of stock, show it greyed out and disabled.
- Quantity is fixed at 1 pack (= 3 pairs of socks).

## What gets built

### 1. `src/lib/shopify.ts` — add socks fetcher

- Add `SOCKS_PRODUCT_HANDLE` constant (real handle pulled from Shopify before coding).
- Add `fetchSocksProduct(country)` mirroring `fetchInsoleProduct`. Returns full product with all variants.
- Add `pickSocksVariantForSize(product, shoeSize)` helper that maps shoe size → S/M or L/XL variant. Falls back to first available variant if no match.

### 2. `src/hooks/useSocksProduct.ts`

- Mirrors `useInsoleProduct` exactly. React Query, geo-localized price.

### 3. `src/components/order/SocksUpsellModal.tsx` (new)

Lighter, calmer companion to `InsoleUpsellModal` — same Dialog primitive, but tuned for the post-decline psychology: customer just said no to one popup, second one must feel like a *gift*, not a *push*.

**Layout (mobile-first, 400px max, same Dialog primitive):**
- **Top band:** soft warm cream `#FDF7F0` (the brand color you locked in for Step 1), text reads `A LITTLE GIFT FOR YOUR FEET` in dark brown. NO animated red dot. Close X right.
- **Hero (two-column, like insoles):**
  - Left: square sock image on a soft beige background (NOT bright orange — calmer).
  - Right: 4.8★ · 12,400+ rating row, title `Compression Socks · 3 Pack`, subtitle `Soothes swollen feet · all-day relief`, price `$14.95` with strike-through `$29.90` and green `Save 50% today` badge.
- **Benefits list (4 items, lifted from competitor research, our voice):**
  - ✓ Relieves swelling & tired feet
  - ✓ Graduated compression boosts circulation
  - ✓ Soft, breathable — wear all day
  - ✓ Recommended for long days on your feet
- **Size selector row** (NEW for V1):
  - Pre-selected pill: `Size · S/M` (or L/XL) with a `Change` chevron link on the right.
  - Below it (collapsed by default): "Matched to your shoe size" hint.
  - Tap "Change" → opens a 2-column grid of size options (S/M, L/XL). Selected = red border + red bg, same visual language as the insole modal size grid.
- **Subtle reassurance:** `🦶 Loved by 12,000+ customers · Pairs perfectly with your VitalWalks`
- **Primary CTA:** `YellowCta` — `Yes, Add 3 Pairs for $14.95`
- **Trust row:** `🛡 Free shipping · 60-day money-back guarantee`
- **Decline link:** `No thanks, continue to checkout →` (small, muted)

**Behavior:**
- Same 500ms arming delay as insole modal (prevents accidental dismiss).
- Fires `ViewContent` Pixel event on open (variant ID, price, currency).
- `onAccept(variant)` returns the chosen variant; OrderPage appends to checkout.
- `onDecline()` skips straight to checkout.

### 4. `src/components/order/OrderPage.tsx` — wire it in

- Add `useSocksProduct()` hook.
- Add state: `showSocksModal: boolean`.
- In `handleUpsellDecline` (insole decline):
  - If socks product loaded AND any variant available → open socks modal.
  - Otherwise → existing decline behavior (go to checkout).
- New `handleSocksAccept(variant)`: append socks line, fire `AddToCart`, `handleCheckout`.
- New `handleSocksDecline()`: existing shoe-only checkout path.

### 5. No changes to `InsoleUpsellModal.tsx`

Just keeps calling `onDecline()`. OrderPage interprets that as "now show socks".

## What I need from Shopify before coding

I'll connect to Shopify and pull:
1. The real product `handle` (URL slug) for product `9479564034334`.
2. Full variant list with titles, prices, `availableForSale`, `compareAtPrice`. This confirms exact size labels (S/M vs L/XL vs S/M/L/XL etc.) and whether colors exist.
3. Confirm `compareAtPrice` is set to ~$29.90 so the strike-through and "Save 50%" math display automatically.

If color variants exist, V1 will silently auto-pick the first available color (most common: Black) and we won't expose a color picker — keeps the modal clean. We can add color later if conversion data justifies it.

## Out of scope (this round)

- Showing socks AFTER insole accept (deferred A/B test).
- Color picker (auto-pick first available).
- Multiple sock packs / quantity (fixed at 1 × 3-pack).
- Per-shoe-pair sock matching for multi-pair carts (just use first pair's size).
- Adding socks as a standalone product card on the main product page.

## Tech notes

- Type-safe: reuse `ShopifyProductData` / `ShopifyVariant`.
- Localized pricing via `useGeo` country code.
- Cart line uses `merchandiseId` = variant `id`, `quantity: 1`.
- Pixel events via `variantNumericId()` helper.

After approval I'll connect to Shopify to pull the real handle + variant data, then build all five pieces in one pass.
