## Goal

On mobile (≈390×750 effective viewport after the iOS URL bar), the customer should land on Step 1 and see **everything** — header, the 3 bundle cards, and the yellow CTA — without scrolling. Step 2 and beyond can scroll normally. At the same time, body / label text should feel comfortable to read on a real iPhone (closer to 16px, not 12–13px).

---

## Why it scrolls today

At 390px width, current Step 1 stacks to roughly:

| Block | ~Height |
|---|---|
| SiteHeader | 52px |
| Step header (blue + green sub-strip) | 88px |
| "Unisex" pill row (`mt-2`) | 32px |
| 3 bundle cards (`p-2.5`, gap 2.5, thumb 64px) | ~310px |
| Yellow CTA + `mt-4` | 76px |
| **Total** | **~558px** above the footer/padding |

Add the iOS Safari address bar (~90–110px on first paint) and the bottom home-bar safe area (~34px), and the CTA + bottom of the third card get pushed below the fold — which is exactly the "scrolling on Step 1" the user is reporting.

Two small typography problems on top of that:
- Bundle name is `text-[15px]` on mobile, save % is `13px`, struck price is `12px`, "/ea" is `11px`. On a real Retina screen those read noticeably small.
- The "Unisex — fits Men & Women" pill is `10.5px` uppercase — also feels tiny.

---

## Plan

### 1. Make Step 1 fit the mobile viewport (no scroll on landing)

In `src/components/order/QuantityStep.tsx`:
- Tighten the wrapping spacing on mobile only (keep desktop generous):
  - "Unisex" pill row: `mt-2` → `mt-1.5`
  - Bundle list `mt-3 space-y-2.5` → `mt-2 space-y-2` on mobile, restore `sm:space-y-2.5`
  - CTA wrapper `mt-4` → `mt-3 sm:mt-4`
- Slim the bundle cards on mobile:
  - `p-2.5` → `p-2 sm:p-4`
  - `gap-2.5` → `gap-2 sm:gap-4`
- Shrink the bundle thumbnail on mobile (in `BundleThumb` — switch from a fixed ~64px to ~52px on `<sm`, keep current size from `sm:` up). I'll confirm the exact prop/class when implementing.
- Shrink the ribbon offset so cards can sit closer (`pt-2.5` → `pt-2`).

In `src/components/order/StepHeader.tsx`:
- Reduce vertical padding on mobile only:
  - Title bar `py-3.5` → `py-2.5 sm:py-3.5`
  - Sub-strip `py-2` → `py-1.5 sm:py-2`

In `src/components/order/SiteHeader.tsx`:
- `py-2.5 sm:py-3.5` → `py-2 sm:py-3.5` and logo `h-7` → `h-6 sm:h-9` (saves ~8–10px without hurting brand presence).

In `src/components/order/OrderPage.tsx`:
- The `<main>` currently uses `pt-2 sm:pt-4`. Keep as is, but add `space-y-3 md:space-y-8` to the inner stack (currently `space-y-4`) so Step 1 hugs the header on mobile.

Together this trims ~70–90px on mobile — enough to put the whole Step 1 above the iOS fold even with the address bar showing.

### 2. Bump readable text sizes (mobile-first, no desktop regressions)

All sizes below are mobile values; current `sm:` desktop values are kept unchanged.

In `QuantityStep.tsx`:
- Bundle name: `text-[15px]` → `text-[16px]`
- "Save X%": `text-[13px]` → `text-[14px]`
- Struck compare price: `text-[12px]` → `text-[13px]`
- Big per-pair price: `text-[18px]` → `text-[19px]`
- "/ea" suffix: `text-[11px]` → `text-[12px]`
- "Unisex — fits Men & Women" pill: `text-[10.5px]` → `text-[11.5px]`

In `StepHeader.tsx`:
- Title `text-[17px]` → `text-[18px]` on mobile (matches desktop).
- Sub-strip `text-[13px]` → `text-[14px]`.
- "Bundle and Save!" right label `text-[13px]` → `text-[13.5px]` (kept compact so it doesn't wrap on small phones).

In `SiteHeader.tsx`:
- Currency pill `text-[11px]` → `text-[12px]`
- "Need help?" link `text-[12px]` → `text-[13px]`

These bumps are small (1–2px each) but add up to a noticeably more comfortable read on a real iPhone, while staying within the design system's hierarchy.

### 3. Verify (default-mode, after approval)

Once the changes are in:
- Use the browser tool at 390×844 (iPhone 14/15) and 375×812 (iPhone SE/mini) to screenshot the landing view and confirm the yellow "Select Your Color and Size" CTA is visible without scrolling.
- Sanity-check 320×568 (smallest supported) — if Step 1 is *still* slightly clipped at that size, the CTA arrow will be partially visible, which is acceptable and signals scroll-ability.
- Confirm Step 2 / Step 3 layouts haven't been visually affected on `sm:` and up.

---

## Out of scope (intentionally)

- No changes to Step 2 or Step 3 typography — user said scrolling there is fine, and bumping fonts there risks pushing the size grid to wrap.
- Not touching the global `body { font-size: 16px }` baseline — it's already 16px; the perceived smallness is from component-level overrides, which is what we're fixing.
- No layout changes to the bundle thumbnails' visual style, just the mobile dimension.
