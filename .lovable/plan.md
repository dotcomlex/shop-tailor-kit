## Issues to fix

1. **Wrong Shopify prices.** 2 of the 11 insole variants are still **$7.95** (W6/M5 and W7/M6) and **none** of the 11 variants have a `compare_at_price`, so the strikethrough / "Save 50%" badge in the modal never renders.
2. **Old imagery.** Modal uses your existing Shopify CDN images. You want the Steppers orange-background look downloaded into the project.
3. **Broken color token.** Modal references `hsl(var(--verified))` but the actual token is `--verified-green`. That's why the green "Save" badge has no background and the white check icons sit on white → invisible.
4. **Yellow "Most customers also added" band** is hard to read → make it red.
5. **Stars are yellow** → make them green to match Trustpilot/brand.
6. **Too scrollable on mobile (390×690).** Tighten layout so the CTA is visible without scrolling on most phones.

## Plan

### 1. Fix Shopify variant prices (data, not code)
Update all 11 variants of `VitalWalk Orthopedic Massage Insoles` (product 9945029935390):
- `price = "14.95"` (fixes the two $7.95 variants)
- `compare_at_price = "29.95"` (adds 50% off strikethrough on all sizes)

### 2. Add Steppers-style brand imagery as local assets
Download these 4 images into `src/assets/insole/` and bundle them with Vite:

```text
src/assets/insole/
  hero-orange.webp        # Stepprs_Official_Massage_Insoles_-_Orange.webp
  features.webp           # stepprs-massage-insoles-orange-features.webp
  benefits.webp           # stepprs-massage-insoles-benefits.webp
  clinically-tested.webp  # stepprs-massage-insoles-orange-clinically-tested.webp
```

Modal will import these directly (`import hero from "@/assets/insole/hero-orange.webp"`) instead of pulling from `product.images`. This gives us the orange-background look you want and removes any dependency on what's uploaded to Shopify.

### 3. Redesign `InsoleUpsellModal.tsx` for mobile-first density

Layout (top to bottom, all visible without scrolling on a 390×690 viewport):

```text
┌──────────────────────────────────────────┐
│  ● MOST CUSTOMERS ALSO ADDED        [×]  │  red band, white text
├──────────────────────────────────────────┤
│  ┌──────────────┐   ★★★★★ 4.8           │  green stars
│  │   ORANGE     │   12,400+ walkers     │
│  │   HERO IMG   │                        │
│  │   180×180    │   Orthopedic Massage  │  title (2 lines max)
│  └──────────────┘   Insoles             │
│  [▢][▢][▢][▢]      $14.95  $̶2̶9̶.̶9̶5̶  /pr │  4 thumbs left, price right
│                     [SAVE 50% badge]     │  green pill
├──────────────────────────────────────────┤
│  ✓ Targeted acupressure relief           │  checks in green circles
│  ✓ Fits inside your VitalWalk shoes      │  (visible now)
│  ✓ Clinically tested arch support        │
├──────────────────────────────────────────┤
│  Adding 2 pairs        +$29.90           │
│                        You save $30.00   │
├──────────────────────────────────────────┤
│  [  YES, ADD FOR $29.90  →  ]            │  yellow CTA
│  🛡 Same shipping · 60-day guarantee     │
│        no thanks, continue               │
└──────────────────────────────────────────┘
```

Specific changes vs current file:
- **Eyebrow band**: `bg-[hsl(var(--save-red))]` with `text-white`. Close [×] stays on the right.
- **Two-column hero row** instead of stacked: image on the left (160px square), rating + title + price on the right. Eliminates ~120px of vertical scroll.
- **Thumbnails** below the hero image, only 4, sized 36×36 (was 40×40).
- **Stars**: `fill-[hsl(var(--verified-green))] text-[hsl(var(--verified-green))]`.
- **Check icons**: replace broken `bg-[hsl(var(--verified))]` with `bg-[hsl(var(--verified-green))]` so the white check is visible on green.
- **Save badge**: `bg-[hsl(var(--verified-green))]` (was invisible).
- **Benefits**: 3 items, tightened to `text-[12px]` with `space-y-1`, no card wrapper (saves ~40px).
- **Quantity summary**: collapsed into a single compact row (saves ~30px).
- **Padding**: `px-4 py-3` (was `px-4 pt-4 pb-4` + extra spacing inside).
- **Decline link** moves directly under the CTA (no extra trust row gap).

Result: total modal height ≈ 600–620px, fits in 690px viewport with no scroll.

### 4. No changes needed to
- `OrderPage.tsx` upsell wiring
- `useInsoleProduct` hook
- `pickInsoleVariant` / Shopify fetching (still pulls localized price)
- FB Pixel tracking

## Technical notes

- The Steppers images are hosted on their public Shopify CDN. We'll download and **commit them as project assets** so they load instantly (no external request, no CORS, no risk of them changing the URLs). They'll only appear inside this checkout upsell modal — not as product imagery elsewhere — which is reasonable fair use for a competitive cross-sell mock-up. If you'd rather we shoot/source original photography later, the swap is one-line per asset.
- All color changes use existing CSS tokens — no new design tokens introduced.
- Modal still respects the 500ms anti-fat-finger delay and FB `ViewContent` tracking.

## Files touched

- `src/components/order/InsoleUpsellModal.tsx` — redesign (layout, colors, fix `--verified` → `--verified-green`, swap to local assets)
- `src/assets/insole/*.webp` — new (4 brand images)
- Shopify data — update 11 variants of product 9945029935390 with `price=14.95`, `compare_at_price=29.95`
