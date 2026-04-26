# Clean up the checkout footer & fix payment badges

The screenshot shows the section under "Complete My Order" is doing too much: **three stacked trust rows** ("Secure checkout · Powered by Shopify · 60-day money-back" → "SECURE SSL ENCRYPTION" → "GUARANTEED SAFE CHECKOUT") plus a payment pill with **broken SVGs** (PayPal renders as "PirayPa", Discover as "DISC ●", Mastercard has no wordmark, Shop Pay as "SPdy", Amex stacked weirdly). It looks amateur and crowded — the opposite of what a checkout footer should feel like.

Two things to fix in one pass: **declutter the trust copy** and **rebuild the payment badges** to match the clean white-card style from your reference image.

---

## 1. Declutter the trust footer

Right now there are three separate text rows. Consolidate to **one** clean line + the payment row. Cut the redundancy: "Secure checkout" + "SECURE SSL ENCRYPTION" + "GUARANTEED SAFE CHECKOUT" all say the same thing.

**File: `src/components/order/UpgradeStep.tsx`**

Replace the entire block below the CTA (lines ~93–122) with a single tight composition:

- **Row 1 (immediately below CTA, ~12px muted):** `🔒 Secure SSL checkout · Powered by Shopify · 60-day money-back guarantee`
  - One row, dot separators, lock icon at the start. No uppercase shouty text.
- **Row 2:** the payment badges in a clean borderless row (no surrounding pill, no "WE ACCEPT" label — the badges speak for themselves and the pill background was adding visual weight).

**Delete `<TrustRow />` rendering** from `UpgradeStep.tsx` entirely (the SSL/SAFE CHECKOUT lines). That component can stay in the codebase unused, or I can delete the file — I'll delete it since nothing else uses it after the earlier cleanup.

Result: instead of 4 stacked elements, the footer becomes **CTA → 1 microline → payment badges**. Clean, scannable, professional.

## 2. Rebuild payment badges (brand-accurate, white card style)

The current SVGs use hand-drawn `<path>` data and mangled `<text>` that renders garbage at small sizes. I'll replace all 8 with clean, brand-consistent SVGs in a unified **white card** style matching your reference image:

- **Uniform format:** `viewBox="0 0 60 24"`, white background, 1px `#E5E7EB` border, 4px radius. Renders crisply at the `h-7 sm:h-8` size used in the row.
- **Wordmarks:** use proper inline SVG paths (not `<text>` — fonts don't render reliably in inline SVG across browsers and that's why "PayPal" became "PirayPa").

Specifically:

| Badge | Style | Source |
|---|---|---|
| **Visa** | White card, navy "VISA" wordmark in italic bold | Path-based wordmark |
| **Mastercard** | White card, two overlapping circles (red #EB001B + yellow #F79E1B) — no text needed, the circles are the recognized mark | Already mostly correct, just remove the broken text attempt |
| **Amex** | White card, blue "AMEX" wordmark (single line, not stacked) | Path-based, matches your reference where it's a single clean word |
| **Discover** | White card, black "DISCOVER" wordmark + small orange dot over the "v" | Path-based wordmark |
| **PayPal** | White card, "PayPal" wordmark (navy "Pay" + blue "Pal") | Clean path data, replacing the broken "PirayPa" |
| **Apple Pay** | White card, black ` Pay` (apple logo + "Pay") | Path-based |
| **Google Pay** | White card, "G Pay" (multicolor G + grey "Pay") | Path-based |
| **Shop Pay** | White card, purple "shop" + black "Pay" | Path-based, replacing broken "SPdy" |

**Important style change:** moving Apple Pay and Shop Pay from solid-color cards to **white cards** so all 8 badges share one visual language (matches your reference screenshot exactly). Solid colored badges next to white badges look mismatched.

**Files rewritten (8 SVGs in `public/payments/`):**
- `visa.svg`, `mastercard.svg`, `amex.svg`, `discover.svg`, `paypal.svg`, `apple-pay.svg`, `google-pay.svg`, `shop-pay.svg`

## 3. Tighten the payments row layout

**File: `src/components/order/UpgradeStep.tsx`**

- Drop the `bg-secondary/40` pill background and the "WE ACCEPT" label — the badges form their own visual unit.
- Render badges in a single centered flex row: `flex flex-wrap justify-center gap-1.5 sm:gap-2`.
- Badge size: `h-7 sm:h-8` (slightly larger so the wordmarks are legible at mobile width 390px).
- Add `mt-4` from the microline above for breathing room.

---

## Files touched
- **Edit** `src/components/order/UpgradeStep.tsx` — collapse 3 trust rows into 1 microline, drop the "WE ACCEPT" pill wrapper, remove `<TrustRow />` import + render
- **Delete** `src/components/order/TrustRow.tsx` — no longer used anywhere after this change
- **Rewrite** all 8 SVGs in `public/payments/` with clean path-based wordmarks on a unified white-card style

## Out of scope
- The "Almost There — Review & Checkout" header, savings hero, scarcity bar, summary, and protection toggle above the CTA — those are working as intended per the prior approved design.
- Adding more trust seals (Norton/McAfee/etc.) — these would re-add clutter; the new microline + Shopify mention covers it.