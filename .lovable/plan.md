## Goal

Make the page feel native on mobile — green section headers and content extend to the screen edges (like the competitor screenshot), with comfortable breathing room inside each card.

## The root cause

Right now there's a 16px gutter wrapping the entire page (`.container-order` adds `px-4` on mobile). That gutter pushes the green headers, bundle cards, and all sections inward — leaving a visible strip of background on both sides. The competitor's page has zero outer gutter on mobile, so their blue header bars run flush to the screen edges and the content feels properly sized.

## What will change

**1. Remove the outer mobile gutter (edge-to-edge layout)**
- On mobile, the main content column will go flush to the screen edges (0px outer padding).
- The site header and footer keep a small gutter so the logo/currency pill don't kiss the edge.
- On tablet/desktop (≥640px) the existing comfortable gutter stays — nothing changes for larger screens.

**2. Square off the step headers on mobile**
- The green "1. Select Quantity / Bundle and Save!" bar will lose its rounded corners on mobile (matching competitor) and stretch fully edge-to-edge. Rounded corners return on tablet+.

**3. Add internal padding to the content rows so nothing feels cramped**
- Bundle option cards, the color/size step, the upgrade step, and the order summary each get a small inner horizontal padding (~12px) on mobile so text and prices don't touch the edges. Net effect: the colored bars touch the edges, but the white card content sits with proper breathing room — exactly like the WCS reference.

**4. Slightly larger price + name typography on mobile**
- Bundle name bumps from 16px → 17px and price from 19px → 20px on mobile so the row feels less "tight" (matching the competitor's confident sizing).

## Files touched

- `src/index.css` — adjust `.container-order` (no horizontal padding on mobile, restore on `sm:`); add a new `.container-edge` helper for header/footer that keeps a gutter.
- `src/components/order/StepHeader.tsx` — remove `rounded-lg` on mobile (apply only at `sm:`).
- `src/components/order/OrderPage.tsx` — wrap each step in a small mobile-only inner padding wrapper so card content stays comfortable while the header bars run edge-to-edge.
- `src/components/order/SiteHeader.tsx` — switch to the gutter-preserving container so the header doesn't go edge-to-edge.
- `src/components/order/QuantityStep.tsx` — slight typography bump for name/price on mobile.

## What stays the same

- Desktop/tablet layout is unchanged.
- All currency, geo-detection, checkout, and Shopify logic is untouched.
- Colors, fonts, and brand styling are unchanged.

## Result

On a phone, your page will look like the WCS reference: the green section bars run flush to both edges of the screen, the bundle cards sit comfortably inside with proper padding, and nothing feels squeezed. Desktop is unaffected.