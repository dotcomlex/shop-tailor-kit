## Goals

1. **Size chart accuracy & clarity** — eliminate redundant Women/Men columns where the region uses a single unified number, and fix AU/NZ data.
2. **Shipping line copy** — flag must come after the country name.
3. **Step 3 layout** — surface "Add Shipping Protection — $5.95" directly above the "Complete My Order" button so the upsell is the very last decision before checkout.

---

## 1. Correct international sizing rules

Based on industry-standard conversions:

| Region | Women | Men |
|---|---|---|
| **US** | US W (e.g., 8) | US M (≈ US W − 1.5) |
| **UK** | Single UK number (W = M physically) |
| **EU** | Single EU number (W = M physically) |
| **AU/NZ** | = US Women number | = UK number |

So the W vs M split only matters for **US** and **AU/NZ**. UK and EU should each render as a **single column** per row.

### Edits to `src/data/sizeChart.ts`
- Update the `SizeRow.au` field (and computed values) so that:
  - `auW` = `usW` (numerically identical to US Women)
  - `auM` = `uk` (numerically identical to UK)
- Replace the single `au` field with `auW` and `auM` to remove the false "AU = UK for women" assumption currently in the code's comment.
- Keep `parseShopifySize` working — it returns the full row; consumers will pick the right column.

### Edits to `src/components/order/SizingDialogs.tsx` — `SizeChartBody`
Replace the always-two-column (Women / Men) layout with a region-aware renderer:

- **US tab** → two columns: "Women" and "Men" (current behavior, kept).
- **AU/NZ tab** → two columns: "Women" (= US W) and "Men" (= UK).
- **UK tab** → **one column**: "Size (UK)" — single bold number per row, with subtitle "Unisex sizing".
- **EU tab** → **one column**: "Size (EU)" — single bold number per row, with subtitle "Unisex sizing".

Other adjustments inside the body:
- Column header row: dynamically render `Women / Men` (US, AU) OR a single `Size` header (UK, EU).
- Secondary line under each row: stays useful — show US W/M when on UK/EU/AU tabs; show EU when on US.
- "Yours" pill: highlight the row that matches the user's selected size in the active region's primary value (computed from `parseShopifySize`).
- Footer tip: keep as-is.

Result: UK and EU tabs become clean, scannable single-number lists (no duplicated identical numbers), and AU/NZ correctly reflects that women = US numbers, men = UK numbers.

---

## 2. Fix shipping line — flag last

### Edit `src/components/order/SavingsHero.tsx`
Change:
```
`FREE & fast shipping to ${country.flag} ${country.name}`
```
to:
```
`FREE & fast shipping to ${country.name} ${country.flag}`
```
Result on US: **"FREE & fast shipping to United States 🇺🇸"**.

Fallback (no geo) stays: "FREE worldwide shipping included".

---

## 3. Reorder Step 3 — protection upsell directly above CTA

Currently the order in `UpgradeStep.tsx` is:
1. SavingsHero
2. ScarcityBar
3. **Shipping Protection card**
4. OrderSummary
5. (gap) → Complete My Order CTA

### Edit `src/components/order/UpgradeStep.tsx`
Reorder the stack to:
1. SavingsHero (savings + localized shipping)
2. ScarcityBar (soft urgency)
3. **OrderSummary** (subtotal, shipping FREE, total, you saved)
4. **Shipping Protection toggle card** ← moved down, now sits immediately above CTA
5. **Complete My Order** CTA
6. Secure-checkout micro line + payments pill

This makes the protection toggle the final micro-decision before checkout (a proven pattern), while the order summary stays anchored above it so the user sees the total they're committing to.

Minor visual tightening:
- Reduce the vertical gap between the protection card and the CTA (e.g., `mt-3` instead of `mt-5`) so they read as a connected unit.
- When protection is enabled, the OrderSummary already shows the +$5.95 line and updated total — that linkage is now visually adjacent (summary → toggle → CTA).

---

## Files touched

- `src/data/sizeChart.ts` — split `au` → `auW` / `auM`, update interface and parser output.
- `src/components/order/SizingDialogs.tsx` — region-aware column rendering (1 col for UK/EU, 2 col for US & AU/NZ), updated header labels and secondary line logic.
- `src/components/order/SavingsHero.tsx` — flag after country name.
- `src/components/order/UpgradeStep.tsx` — reorder children so the protection card sits directly above the CTA.

No other components need changes; `ColorSizeStep` still passes `sizes` and `selectedSize` to `SizingDialogs` unchanged.