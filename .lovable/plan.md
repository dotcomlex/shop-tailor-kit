## Goal

Throw out the long-scroll funnel and rebuild `/` as a **single-page, 2-column, 3-step order flow** that mirrors WideComfortShoes' checkout page exactly — but branded as VitalWalk and wired to your real Shopify product (4 colors × 20 sizes) with a real Storefront API cart → checkout handoff.

No long-scroll marketing. No `/select` route. The page IS the funnel.

## What's getting deleted

- `src/pages/Index.tsx` — fully replaced
- `src/pages/Select.tsx` — deleted
- `/select` route in `src/App.tsx` — removed
- All 19 funnel components in `src/components/funnel/` — **deleted** (Hero, ProblemBlock, FeatureRows, BenefitGifGrid, PodiatristBlock, SocialProofCards, ConditionsList, GuaranteeBlock, ReviewWall, FaqSection, FinalCta, StickyMobileCta, AnnouncementBar, SiteHeader, SiteFooter, PivotBlock, PressStrip, CtaButton, StarRating)
- `src/data/features.ts`, `src/data/faqs.ts`, `src/data/images.ts` — deleted (unused after rebuild)
- `src/data/testimonials.ts` — replaced with the 4 reviews from your spec

Keeping: `src/lib/shopify.ts`, `src/hooks/useVitalWalkProduct.ts` (already correctly fetching the Copy product with 4 colors × 20 sizes), all shadcn UI primitives.

## Page architecture

Single route `/`. Max width `1100px`, centered, white background, `system-ui` stack — no Google Fonts, no Fraunces, no marketing tone.

### Top of page (full width, above both columns)

1. **Delivery estimate bar** — thin gray strip. Left: `🛡️ Estimated Delivery`. Right: `Order Today {today as "DD MMM"} — Get It By {today+8} - {today+12}` (calculated at render).
2. **Countdown box** — dashed blue border on `#EBF4FF` background. `First-time Buyer Offer Ends in 24 hours! Time left: HH:MM:SS` with the timer in bold red `#CC0000`. Counts down from 24:00:00, resets per page load (honest — it's a session timer, not a fake persistent one).
3. **Minimal header** above the bars — VitalWalk logo image (max-height 40px) left-aligned. No nav.

### Left column (≈60%) — the 3-step flow

**Step 1 — Select Quantity** *(visible on load)*
- Blue `#3B5BDB` header bar: `1. Select Quantity` (bold left) / `Bundle and Save!` (right).
- Sub-strip on `#EBF4FF`: `You can select color and size on next step`.
- Three quantity cards, radio-style, only one selectable. Selected = blue border + filled radio.
  - **1 Pair** — $59.95/ea, compare $119.90, Save 50% *(default selected)*
  - **2 Pairs** — $53.95/ea ($107.90 total), compare $239.80, Save 55%, "MOST POPULAR" pill above card, green star
  - **3 Pairs** — $47.96/ea ($143.88 total), compare $359.70, Save 60%, "Best Deal" green tag
  - Card thumb uses your CDN image `vitalwalk_color_2_compressed.jpg`.
- **Yellow CTA** `#F5C518` pill button, full width, height 60px, radius 30px: `Select Your Color and Size →` (arrow in dark circular bg). Reveals Step 2 + smooth-scrolls.
- Trust row: `🔒 SECURE SSL ENCRYPTION   🔒 GUARANTEED SAFE CHECKOUT`.

**Step 2 — Select Your Color and Size** *(hidden until Step 1 CTA clicked)*
- Same blue header bar.
- **Dynamically renders N selector blocks** matching the chosen quantity (1, 2, or 3). Each block:
  - Label: `1. Select Color:` / `2. Select Color:` / `3. Select Color:`. Updates to `Select Color: Beige` once chosen.
  - **Color swatches** — 40×40 squares, 4px radius, 2px border (blue when selected). Pulled from the **real Shopify options** for this product: **Beige, Blue, Gray, Black** (4 colors, not the 6 in your spec — your store doesn't carry the others).
  - **Size dropdown** — uses real Shopify size option list (20 values like `US W 7 / US M 6 / UK 5`). Default placeholder `Select Your Size`.
- Below all blocks:
  - `👟 Sizing is currently displayed in US sizes`.
  - Collapsible **Size Chart** — uses your Shopify-native size strings (US Women / US Men / UK already in each option label, so the chart is just a clean rendering of those 20 rows).
  - Collapsible **Expert Sizing Tips** — verbatim copy from your spec.
- **Next button** (yellow CTA). Disabled until every pair has both color + size. Reveals Step 3 + scrolls.
- Trust row repeated.

**Step 3 — Upgrade your experience** *(hidden until Step 2 complete)*
- Same blue header bar.
- Single shipping protection card: shield icon, bold `Free Returns & Exchanges + Package Protection for $5.95`, sub-text from your spec, **green toggle switch** (off by default). When on, adds `$5.95` to the running subtotal shown above the Checkout button.
- **Checkout button** (yellow CTA): `Checkout`. On click:
  1. Builds line items from each selected (color, size) pair → resolves to the matching Shopify variant ID by matching `selectedOptions`.
  2. Calls `cartCreate` via Storefront API with all lines (qty 1 each — N pairs = N lines, or merged if duplicates).
  3. Opens the returned `checkoutUrl` (with `channel=online_store` param) in a new tab via `window.open(url, '_blank')`.
  4. Note: shipping protection is a UI-only add-on for now (not a real Shopify product) — surfaced as a line item upsell would need a separate "Shipping Protection" product in Shopify, which isn't in scope here. The toggle reflects in the displayed total but is not added to the Shopify cart. (We can wire a real protection SKU in a follow-up if you want.)
- Trust row + payment logos row (Visa / Mastercard / Amex / Discover) as styled text badges.

### Right column (≈40%) — product info + social proof

- Top row: `21,734+ Happy Customers` (gray) / `New 2025 Release` (red bold).
- Product title `The Original VitalWalk® Shoes` left, hero image right (140×140, your `23b406cd-...png` CDN URL).
- Divider.
- **100 Day Guarantee block**: red CSS circle badge (70px, white text "100 DAY") + bold heading + body copy verbatim from spec.
- Divider.
- **Customer reviews** — 4 reviews from your spec (Mary W., Michael R., Dorothy W., Robert K.). Show first 2 by default; `Show more reviews ▼` link reveals the other 2. Each: 5 green `#00B67A` stars, bold headline, body, `— Name  ✓ Verified Purchaser`.

### Mobile

Stack: top bars → left column → right column. Same step flow. Yellow CTAs full-width.

## Cart wiring (Shopify Storefront API)

Per the cart-checkout knowledge file — no manual URLs, no permalinks. Implementation:

- Add `CART_CREATE_MUTATION` to `src/lib/shopify.ts` plus a `createCheckoutForLines(lines)` helper that:
  1. Takes `[{ variantId, quantity }]`.
  2. Fires `cartCreate` via existing `storefrontApiRequest`.
  3. Returns `formatCheckoutUrl(checkoutUrl)` (appends `channel=online_store`).
- The order page calls this on Checkout click → `window.open(url, '_blank')`.
- No persistent cart store / Zustand needed — this page builds and submits a single ephemeral cart per checkout. Items are never edited after checkout opens. Keeps it dead simple.
- Variant resolution: match each selected `(color, size)` pair against the live `product.variants[].selectedOptions` from `useVitalWalkProduct()`. If a variant is `availableForSale: false`, surface a sonner toast `"That size is currently sold out — please pick another."` and block checkout.

## State (single `OrderPage` component, local `useState`)

- `quantity: 1 | 2 | 3` (default 1)
- `currentStep: 1 | 2 | 3` (default 1; advancing reveals next step)
- `selections: Array<{ color: string | null; size: string | null }>` (length = `quantity`, resized on quantity change)
- `protectionEnabled: boolean`
- `countdownSeconds: number` (24*3600, decremented per second via `useEffect` interval)
- `sizeChartOpen`, `sizingTipsOpen`, `showAllReviews`
- `isCheckingOut: boolean` (button loading state)

All resets are sane: changing quantity from 3 → 1 trims `selections` and re-validates Step 3 unlock.

## File plan

**Deleted**
- All files in `src/components/funnel/` (19 files)
- `src/data/features.ts`, `src/data/faqs.ts`, `src/data/images.ts`
- `src/pages/Select.tsx`

**Created**
- `src/components/order/OrderPage.tsx` — orchestrator, holds all state
- `src/components/order/TopBars.tsx` — delivery + countdown
- `src/components/order/SiteHeader.tsx` — minimal logo header
- `src/components/order/QuantityStep.tsx`
- `src/components/order/ColorSizeStep.tsx`
- `src/components/order/UpgradeStep.tsx`
- `src/components/order/ProductPanel.tsx` — right column
- `src/components/order/GuaranteeBlock.tsx`
- `src/components/order/ReviewsBlock.tsx`
- `src/components/order/StepHeader.tsx` — reusable blue bar
- `src/components/order/YellowCta.tsx` — reusable pill button
- `src/components/order/TrustRow.tsx`
- `src/components/order/ColorSwatch.tsx`
- `src/components/order/SizeSelect.tsx`
- `src/data/reviews.ts` — 4 reviews from your spec
- `src/lib/checkout.ts` — `createCheckoutForLines()` + variant matcher

**Edited**
- `src/pages/Index.tsx` → renders `<OrderPage />` only
- `src/App.tsx` → remove `/select` route + import
- `src/lib/shopify.ts` → add `CART_CREATE_MUTATION` + `formatCheckoutUrl`
- `src/index.css` → strip Fraunces import (we're going system-ui), keep Tailwind tokens but add the WCS-spec hex values as semantic tokens (`--brand-yellow #F5C518`, `--brand-blue #3B5BDB`, `--save-red #CC0000`, `--verified-green #00B67A`, `--soft-blue #EBF4FF`)
- `tailwind.config.ts` → drop Fraunces font family, expose new semantic tokens

## Things I'm not doing (and why)

- **6 color swatches** — your Shopify product only carries 4 (Beige, Blue, Gray, Black). I'll render the 4 real ones rather than fake "All Black / Light Gray / Dark Gray" swatches that would 404 at checkout. If you want those colors, add the variants in Shopify and they'll auto-appear.
- **Persistent 24h countdown across reloads** — keeping it as a 24h session timer per your "honest copy" preference established earlier in the project. Real persistent countdowns would need a per-visitor cookie; happy to add if you want.
- **Real shipping-protection SKU at checkout** — the toggle is UI-only this session. Wiring a real Shopify "Shipping Protection $5.95" product is a 2-minute follow-up once you create that SKU.
- **Header nav / footer links** — per your spec, just the logo up top; one-line footer.
- **Long-scroll marketing sections** — explicitly killed per your spec. The page's only job is quantity → variant → checkout.

## What you'll see when this ships

A `/` route that loads as a clean 2-column white page: WCS-style stepped order flow on the left, product + guarantee + 2 visible reviews on the right, dashed countdown banner up top, golden-yellow CTAs that progressively reveal Steps 2 then 3, and a Checkout button that fires a real Shopify Storefront `cartCreate` and opens the live checkout in a new tab — already wired to your "The Original VitalWalk® Shoes (Copy)" product with its 4 real colors and 20 real sizes.