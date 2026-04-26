# Add Length & Width (mm) to the Size Chart

The Shopify product page includes **Length (mm)** and **Width (mm)** for every row — these are the most reliable way for international buyers to confirm fit (especially when their region uses different numbering). Our current chart omits them. I'll add them as first-class data, surface them inline in every row, and keep the layout clean on mobile.

---

## 1. `src/data/sizeChart.ts` — extend the master table with mm

Add `lengthMm` and `widthMm` to every row in the `TABLE` constant, sourced directly from the Shopify chart screenshot:

| US W | Length (mm) | Width (mm) |
|---|---|---|
| 5 | 235 | 87.1 |
| 5.5 | 240 | 88.2 |
| 6 | 245 | 89.4 |
| 6.5 | 250 | 90.6 |
| 7 | 255 | 91.7 |
| 7.5 | 260 | 92.85 |
| 8 | 265 | 94 |
| 8.5 | 270 | 95.15 |
| 9 | 275 | 96.3 |
| 9.5 | 280 | 97.4 |
| 10 | 285 | 98.6 |
| 10.5 | 290 | 99.75 |
| 11 | 295 | 100.9 |
| 11.5 | 300 | 102.05 |
| 12 | 305 | 103.2 |
| 12.5 | 309 | 104 |
| 13 | 313 | 106 |
| 13.5 | 318 | 112 |

For the two extrapolated rows our table has beyond the Shopify chart (US W 14 and 14.5), I'll continue the linear trend (~+5mm length, ~+1.15mm width per half size) so nothing displays as `—`.

Update `SizeRow` interface:
```ts
export interface SizeRow {
  usW: string;
  usM: string;
  uk: string;
  eu: string;
  auW: string;
  auM: string;
  lengthMm: string;   // NEW — e.g. "265"
  widthMm: string;    // NEW — e.g. "94"
}
```

Update `parseShopifySize` to return `lengthMm` and `widthMm` from the matched row (formatted with `fmt`). Falls back to `"—"` if no row matches.

## 2. `src/components/order/SizingDialogs.tsx` — surface mm in every row

The chart is region-tabbed (US, UK, EU, AU/NZ) with one row per available size. Length/Width are universal across regions, so they belong inline on every row regardless of the active tab.

**Row layout (mobile-first):**

```
┌───────────────────────────────────────────────────┐
│  8        7              ← primary region values  │
│  US       US                                       │
│  ─────────────────────────────────────             │
│  📏 265 mm  •  ↔ 94 mm     [ Yours ✓ ]             │
└───────────────────────────────────────────────────┘
```

Specifically:
- Keep the existing top row (region-specific size numbers + "Yours" pill on the right).
- Add a thin secondary row underneath inside the same card, separated by `border-t border-border/60 pt-2 mt-2`, showing:
  - `<Ruler className="h-3 w-3" />` `Length` `265 mm`
  - `<MoveHorizontal className="h-3 w-3" />` `Width` `94 mm`
- Use `text-[11px] sm:text-[12px] tabular-nums text-[hsl(var(--text-mute))]`, with the numeric values bumped to `font-semibold text-[hsl(var(--text-body))]` for scannability.
- On the selected ("Yours") row, tint the mm numbers `text-[hsl(var(--order-blue))]` to keep the visual emphasis consistent.

**Column header update:**
- Change the right-side header label from "Match" to read just the secondary EU/US conversion on `sm+` (already happening), and add a small inline legend on `sm+`: `· Length / Width (mm)` next to the size header so the row's bottom strip is self-explanatory.

**Footer tip update:**
Replace the current EU-based tip with a stronger, mm-based instruction that matches the Shopify page:
> "Measure your foot heel-to-toe in **mm** with no shoes on. Match the **Length** column for the most accurate fit."

This makes mm the primary fitting signal — exactly how the source chart works.

## 3. No other files need changes

- `ColorSizeStep.tsx` continues passing `sizes` and `selectedSize` unchanged.
- The `parseShopifySize` API stays backward-compatible (only adds two fields).
- Region tabs, geo-detection, auto-scroll-to-selected-row, sheet/dialog responsive shell, and Sizing Tips body are all preserved.

---

## Files touched

- `src/data/sizeChart.ts` — add `lengthMm` / `widthMm` to every row, extend interface, update parser output.
- `src/components/order/SizingDialogs.tsx` — render a secondary mm strip inside each size card; tweak header legend and footer tip.

After this, every row in every region tab clearly shows: **your region's number → exact foot length & width in mm**, matching the Shopify reference 1:1 while staying mobile-friendly.
