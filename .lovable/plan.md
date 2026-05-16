## Wrap-up sweep: free shipping everywhere + tier badges

Shopify variant prices are being updated manually. This is the remaining frontend work to align UI copy with the new universal free-shipping policy, plus a couple of small polish touches the original plan called out.

### 1. `QuantityStep.tsx` — free shipping badge on all tiers

Currently the green "Free Shipping" pill only renders when `opt.qty > 1` (gated on 1-pair). Remove that gate so the badge shows on the 1-pair card too. This makes all three cards visually consistent and signals the new "free on every order" policy.

### 2. `UpgradeStep.tsx` — drop the "Get 2+ pairs to unlock free shipping" nudge

That line (only shown when `quantity === 1`) is now factually wrong — 1-pair also ships free. Delete the entire conditional block. Don't replace with anything; the OrderSummary's shipping line and the IncludedChecklist already convey free shipping.

### 3. Keep the strikethrough story strong (no change to math)

The `SAVE_PCT` derivation in `QuantityStep.tsx` (70/80/85%) drives each card's per-pair strikethrough. With new prices:
- $64.95 / 70% off → strike at $216.50/ea
- $54.95 / 80% off → strike at $274.75/ea
- $49.95 / 85% off → strike at $333.00/ea

These keep the "loud savings" feel intact. Leaving the math as-is on purpose.

### 4. Optional polish (skip unless you want it)

- Rename the 3-pair ribbon from `BEST DEAL` to `BEST VALUE` — minor copy tweak, same component.
- Update the option-label "% OFF" suffix on Shopify (`1x Pair - (70% OFF)`, etc.) to match the new % — decorative only, the UI doesn't read these. Recommend leaving as-is for now.

### Files touched

- `src/components/order/QuantityStep.tsx` — remove `opt.qty > 1` gate on the Free Shipping pill
- `src/components/order/UpgradeStep.tsx` — delete the `quantity === 1` shipping-unlock nudge

### Already shipped earlier in this session

- `src/components/order/IncludedChecklist.tsx` — "Fast & free shipping to {country}" on every order
- `src/hooks/useVitalWalkProduct.ts` — static fallback price bumped $59.95 → $64.95

### Verification after Shopify prices are live

1. Hard-refresh the preview, open Step 1 — all three cards show "Free Shipping" pill, prices read $64.95 / $54.95 /ea / $49.95 /ea.
2. Click into Step 3 — OrderSummary total matches Shopify (2-pair = $109.90, 3-pair = $149.85).
3. Proceed to checkout — Shopify cart total matches the displayed total to the cent.
