## Goal
Boost AOV and bundle attach rate by making the 2-pair the obvious default, and make the "MOST POPULAR" badge stand out so it actually does its job.

## Changes

### 1. Default quantity = 2 (auto-select the 2-pair bundle)
**File:** `src/components/order/OrderPage.tsx`

Currently the page initializes with `useState<Quantity>(1)`. Change the initial state to `2` so the 2-pair bundle is pre-selected when the page loads. The selections array auto-resizes via the existing `useEffect`, so no other state changes are needed — Step 1 will simply open with the 2-pair card highlighted, the radio filled, and the price column showing the 2-pair total.

This is the single biggest lever: defaults dominate user behavior. Many funnels see bundle attach jump 15–30% just from changing the default.

### 2. "MOST POPULAR" badge — red, pill-shaped, more prominent
**File:** `src/components/order/QuantityStep.tsx`

Currently both ribbons (`popular` and `best`) use the same blue (`bg-[hsl(var(--order-blue))]`), which makes them visually identical and forgettable. The badge is also tiny (10px text, low padding).

Update so the two badges are clearly differentiated and the "popular" one is the loudest thing in Step 1:

- **MOST POPULAR (2-pair):** solid red background (`bg-red-600`), white text, slightly larger (`text-[11px]`), more padding (`px-2.5 py-1`), uppercase, subtle ring/shadow for lift. Position raised slightly so it sits cleanly above the card edge.
- **BEST DEAL (3-pair):** keep the current blue but stays at the existing size — secondary to MOST POPULAR.

This creates a clear visual hierarchy: red ribbon > blue ribbon > no ribbon, matching the conversion priority (we want 2-pair > 3-pair > 1-pair attach).

### 3. Subtle highlight on the default card (optional polish)
**File:** `src/components/order/QuantityStep.tsx`

Since the 2-pair is now selected by default, the existing `border-order-blue` selected state will already make it stand out — no extra highlight needed. The red ribbon + blue selected border will give the 2-pair card two layers of visual weight, which is exactly what we want.

## Out of scope (intentionally)
- No copy changes to the badge text ("MOST POPULAR" stays).
- No changes to pricing, savings %, or the bundle products themselves.
- No re-firing of `AddToCart` on quantity change (per earlier decision to leave the pixel logic alone for now).

## Files touched
- `src/components/order/OrderPage.tsx` — change initial `quantity` state from `1` to `2`
- `src/components/order/QuantityStep.tsx` — differentiate ribbon styles; make "MOST POPULAR" red and slightly larger
