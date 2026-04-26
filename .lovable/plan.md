
# Goal

Fix the broken bundle card (badge collides with price), make the size chart genuinely beautiful and multi-region (US / UK / EU / AU-NZ), de-clutter Step 3, auto-detect the buyer's country to personalize the shipping line with their flag, polish payment methods, and tighten everything for mobile-first. Update guarantee copy to **60 days** and release year to **2026**.

---

## 1. Fix Step 1 — broken "MOST POPULAR" badge collision

The blue `MOST POPULAR` ribbon is currently `absolute right-3 top-3` and overlaps the `$53.95/ea` price. I'll rebuild the card layout so nothing overlaps.

In `QuantityStep.tsx`:
- Move the `badgeAbove` ribbon **outside** the card, sitting on top as a small floating chip that breaks the top border (right side, ~12px from the edge) — like a real ribbon, won't collide with price.
- Reduce its padding so it's compact: `px-2 py-[3px] text-[10px]`.
- Remove the duplicated "Most Popular" star line in the right-side price block — redundant with the ribbon. Keep only **price**, **/ea**, and **strikethrough compare**.
- Reorder the right column: `compare price (small, struck)` → `current per-pair price (big bold)` → `/ea` inline. This is the WCS pattern and reads cleaner.
- Add a subtle 1px highlight ring on the selected card instead of the heavy `shadow-[0_0_0_3px]` glow which feels harsh on mobile.

Result: clean card, no overlap, price always fully visible.

---

## 2. Redesign the size chart — beautiful, multi-region, easy to scan

The current chart only shows US Women / US Men / UK. Buyers come from US, UK, AU, NZ, Canada, EU. I'll rebuild `SizingDialogs.tsx` (`SizeChartDialog` portion):

### Layout
- **Tab strip** at the top: `US · UK · EU · AU/NZ` (4 segmented pills, only one active). Default to detected country (see §5). Canada uses US sizing.
- Below the tabs: a **single clean two-column table** showing only what's relevant for the selected region:
  - US tab → `US Women` | `US Men`
  - UK tab → `UK Women` | `UK Men`
  - EU tab → `EU Women` | `EU Men`
  - AU/NZ tab → `AU Women` | `AU Men` (same as UK numerically, labeled for clarity)
- Rows: clean zebra stripes, larger row height (`h-11`), sticky header, tabular nums, the **user's currently selected size** highlighted in a soft blue band so they instantly see "that's me" across regions.
- Above the table: a single helpful line — "**Find your size below.** All pairs are true to size." (replaces the old "Sizing is currently displayed in US sizes" line — removed per request).
- Below the table: a small foot-measurement tip card with a tiny ruler icon: "Not sure? Measure your foot in cm and match it to the EU column for the most accurate fit."

### Data
Add a small `src/data/sizeChart.ts` with a hard-coded matrix mapping each Shopify size string (which is currently `US W X / US M Y / UK Z`) to its EU and AU equivalents. Standard women's/men's conversion table — no fabricated data, just industry-standard sizing.

### Sizing tips dialog
- Keep the two ✅ tips.
- **Remove** the "Sizing is currently displayed in US sizes" pill (per request).
- Add: "Wide feet? Our adjustable strap accommodates wider widths comfortably."

---

## 3. Step 3 — de-clutter, less overwhelming

Current Step 3 stacks: SavingsHero → 2 trust pills → ScarcityBar → Protection card → OrderSummary → CTA → micro-trust → 4 payment logos. That's 8 visual blocks — too much.

New, leaner stack:
1. **Combined Savings + Shipping strip** (single rounded card, two rows inside):
   - Top row: `🎉 You're saving $XX.XX  ·  vs $YYY.YY retail`
   - Bottom row: `✅ FREE & fast shipping to {country with flag}` (auto-detected, see §5). Falls back to "FREE worldwide shipping" if detection fails.
   - Replaces both the SavingsHero card AND the two separate trust pills.
2. **Scarcity bar** — kept, but visually softened: remove dashed border, use solid soft red background `bg-[hsl(0_85%_97%)]`, smaller pill size, single line on mobile.
3. **Shipping protection** — kept as-is, already clean.
4. **Order summary** — kept, but bump Total font size for clarity on mobile.
5. **CTA** + **single condensed micro-trust line** + **payment row** (see §4).

Net: 8 blocks → 5 blocks. Much easier to scan.

---

## 4. Payment methods row — optimized

Currently 4 logos in a centered row. Improvements in `UpgradeStep.tsx`:
- Add **Apple Pay**, **Google Pay**, **Shop Pay**, **PayPal** SVGs to `public/payments/` (the real checkout supports these — they boost trust massively).
- Wrap row in a subtle `bg-secondary/40` pill container with `rounded-lg` so it reads as a unified "we accept" group rather than scattered icons.
- Add a tiny left-aligned label "We accept" inside the pill at `text-[11px] uppercase tracking-wider text-[hsl(var(--text-mute))]`.
- Logos at uniform `h-6` with consistent ~32px width slots, evenly spaced. Wraps cleanly on mobile (8 logos → 4×2 grid below 380px).
- Add the four new SVGs as new files: `apple-pay.svg`, `google-pay.svg`, `shop-pay.svg`, `paypal.svg`. Real, recognizable brand marks (using the publicly available official wordmarks in SVG form).

---

## 5. Auto-detect country → personalize shipping line

New utility `src/lib/geo.ts`:
- Async function `detectCountry()` that calls `https://ipapi.co/json/` (no key, free, returns `{country_code, country_name}`). Wrap in try/catch with a 2-second timeout.
- Cache the result in `localStorage` under `vitalwalk_geo` for the session (no need to re-hit the API on every render).
- Returns `{ code: 'US', name: 'United States', flag: '🇺🇸' }` shape. Map ISO code → emoji flag with a small inline helper (codepoint math: regional indicator letters).
- If detection fails or returns nothing, return `null` — the UI falls back to "FREE worldwide shipping".

New hook `src/hooks/useGeo.ts`:
- Wraps `detectCountry()` in a `useEffect`, returns `{ country, loading }`.

Used in:
- The **combined Savings + Shipping strip** in Step 3 → renders `✅ FREE & fast shipping to 🇬🇧 United Kingdom` when detected.
- The **Size chart dialog default tab** → if country ∈ `{GB, IE}` default to UK; `{AU, NZ}` → AU/NZ; EU country list → EU; else US (covers US + Canada + everywhere else).

Privacy: this is purely client-side, no data stored beyond the cached country code in localStorage.

---

## 6. Update copy — 60-day guarantee, 2026 release

Search-and-replace across the whole `src/components/order/` folder + `index.html`:
- `100-day money-back` / `100 Day Guarantee` / `100-day` → **`60-day money-back`** / **`60 Day Guarantee`** / **`60-day`**.
- `New 2025 Release` → **`New 2026 Release`** (in `ProductPanel.tsx`).
- Update the SVG starburst medallion in `GuaranteeBlock.tsx` so the inner text reads `60 DAY GUARANTEE`.
- Update `<title>` and meta description in `index.html` if they reference the old guarantee.

---

## 7. Mobile-first polish (the page is already responsive, this tightens it)

- `SiteHeader.tsx`: shrink vertical padding on mobile (`py-2.5` instead of `py-3.5`), shrink logo to `h-7` on mobile / `h-9` desktop. Adds ~20px of vertical space above the fold.
- `OrderPage.tsx`: reduce top padding (`pt-3 sm:pt-5`) and gap between cards (`space-y-6` instead of `space-y-8` on mobile, keep `space-y-8` on `md:`).
- `StepHeader.tsx`: tighten the sub-strip padding so each step header is ~8px shorter on mobile.
- `ColorSwatch.tsx`: bump touch target up — outer button gets `p-1` so the tappable area is ≥44px even when swatch is 64px (Apple HIG / Google MD touch-target compliance).
- `SizeSelect.tsx`: bump trigger height to `h-12` on mobile for easier tap.
- `YellowCta.tsx`: ensure min-height `h-14` on mobile so the primary CTA is always thumb-friendly.
- `OrderSummary.tsx`: bump Total to `text-[24px]` on mobile (currently `text-[22px]`).

---

## 8. Files

**New**
- `src/data/sizeChart.ts` — full US/UK/EU/AU sizing matrix.
- `src/lib/geo.ts` — `detectCountry()` + flag helper.
- `src/hooks/useGeo.ts` — React hook wrapper.
- `public/payments/apple-pay.svg`
- `public/payments/google-pay.svg`
- `public/payments/shop-pay.svg`
- `public/payments/paypal.svg`

**Edited**
- `src/components/order/QuantityStep.tsx` — fix badge overlap, clean right-column price stack.
- `src/components/order/SizingDialogs.tsx` — multi-region tabbed size chart, remove "displayed in US" line, add measurement tip + wide-feet tip.
- `src/components/order/UpgradeStep.tsx` — collapse SavingsHero + shipping pills into one strip; soften scarcity bar; redesigned payment row with 8 logos and "We accept" label.
- `src/components/order/SavingsHero.tsx` — extended to render the country-flag shipping line internally (becomes "SavingsShippingStrip").
- `src/components/order/ScarcityBar.tsx` — visual softening (no dashed border, smaller).
- `src/components/order/SiteHeader.tsx` — tighter mobile padding, smaller logo.
- `src/components/order/OrderPage.tsx` — tighter top padding, smaller mobile gap.
- `src/components/order/StepHeader.tsx` — tighter mobile padding.
- `src/components/order/ColorSwatch.tsx` — larger tap target.
- `src/components/order/SizeSelect.tsx` — `h-12` mobile trigger.
- `src/components/order/YellowCta.tsx` — `h-14` mobile min-height.
- `src/components/order/OrderSummary.tsx` — bigger total on mobile.
- `src/components/order/ProductPanel.tsx` — `New 2026 Release`.
- `src/components/order/GuaranteeBlock.tsx` — `60 Day Guarantee` in medallion.
- `index.html` — title/meta if needed.

**Deleted**
- None.

---

## 9. What I'm NOT touching
- Cart / checkout / Shopify variant resolution — already correct.
- Bundle pricing math — unchanged.
- Reviews block content — strict no-fake-reviews policy.
- Color swatches and Step 2 layout — already polished.

---

Approving this plan flips me to default mode and I'll ship every item in one pass, then visually verify in the preview before confirming.
