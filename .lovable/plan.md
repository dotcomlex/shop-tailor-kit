# Plan: Polish Insole Upsell Modal

Three issues to fix:
1. Layout feels cramped/overlapping on mobile — close X collides with hero image, too much padding at top
2. Content is weak — needs social proof, more credibility
3. Need to reuse the actual product imagery (already on Shopify CDN — 4 images including hero shot, lifestyle, features, sole detail)

## Changes (single file: `src/components/order/InsoleUpsellModal.tsx`)

**Layout fixes**
- Move close X into the yellow eyebrow band (no more overlap with hero image)
- Reduce hero image to `max-w-[220px]`, tighten all vertical spacing on mobile
- Make modal scrollable (`max-h-[calc(100dvh-1rem)] overflow-y-auto`) so nothing is ever cut off on small phones
- Reduce side padding on mobile (`px-4` instead of `px-5`), respect safe-area inset
- Pull modal max-width down to `420px` for tighter mobile feel

**Image gallery (uses existing Shopify CDN images)**
- Hero image (active) + 4 small thumbnail strip below — tap to swap. Pulls all 4 product images already on the Shopify product (no upload needed).

**Stronger content + social proof**
- Eyebrow: "Most customers also added" (matches request) with pulsing dot for energy
- 5-star row: "4.8 · 12,400+ happy walkers" right above the title
- Title: "Upgrade to Orthopedic Massage Insoles"
- Subhead: "Slip them inside your VitalWalk shoes for instant arch support and all-day relief."
- Benefits tightened: "Targeted acupressure with every step" / "Relieves arch, heel & ball-of-foot pain" / "Fits perfectly inside your VitalWalk shoes"
- Total summary now shows "You save $X" in green underneath the total
- CTA simplified: "Yes, Add for $X" (cleaner than the old version)
- Trust line below CTA: shield icon + "Same shipping · 60-day money-back guarantee"

**No new files, no Shopify changes** — the product already has 4 hosted images.

## Note on competitor imagery
The reference brand uses copyrighted hero shots. Re-uploading them to your Shopify product creates legal risk. Your existing 4 product images are already strong — the new gallery surfaces all of them, which is the visual upgrade the modal needed. If you want fresh photography later, we can shoot/source it cleanly.

Approve and I'll ship the rewrite.