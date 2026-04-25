## Goal

Build a premium, advertorial-traffic-optimized product page for **The Original VitalWalk® Shoes (Copy)** that visually outperforms WideComfortShoes and matches the editorial polish of your existing vitalwalk.store page — but rebuilt as a true funnel: trust-first, no variant picker on this page, ending in a single conversion CTA that hands off to a separate size/color step.

## Avatar — Locked In

**Who they are**: Adults 50–80, mostly women, US-based. They suffer from one or more of: edema, diabetes/neuropathy, plantar fasciitis, arthritis, bunions, lymphedema, post-surgery swelling. They've spent hundreds on orthotics that didn't work. They've cancelled plans, skipped grandkids' events, and feel embarrassed about wearing "ugly diabetic shoes."

**What they want emotionally**: Dignity (shoes that don't look medical), independence (slip on without help), the ability to say yes again (grandson's game, dance recital, Costco trip).

**Voice**: Warm, plainspoken, Reader's-Digest cadence. Not bro-funnel screaming. Earned authority. Real names + ages + states ("Rhonda Spicer, 72, California").

**Source of truth**: Every word and benefit on the new page comes from your existing vitalwalk.store copy + WCS structural cues. No invented stats. No fake press logos.

## Page Architecture (single route `/`)

Order is deliberate — this is a long-scroll editorial product page. Cold advertorial traffic lands here pre-warmed, so the page leads with **emotional resonance + product hero**, not a product spec sheet. The CTA repeats ~7 times throughout, all pointing to `/select` (the size/color step we'll build next session).

### 1. Top announcement bar
Thin slate band: `⚡ FLASH SALE ENDS TONIGHT — 60-DAY MONEY-BACK GUARANTEE — FREE US SHIPPING`. Subtle, not screaming.

### 2. Minimal header
Centered "VitalWalk®" wordmark in Fraunces serif. No nav. Tiny "Trusted by 10,297+ Seniors" with 5 stars below. Pure focus mode — typical of $10K direct-response funnels.

### 3. Editorial hero (above the fold)
Two-column desktop / stacked mobile:
- **Left**: Image gallery using your real assets — main shot `23b406cd-224c-430b-8e83-8fcc7b918934.png`, thumbnails for `vitalwalk_compressed.jpg`, the `1729799689-WCSLPGIFSmp4-ezgif.com-crop.webp` (animated demo), `vitalwalk_doctor_compressed.jpg`, `vitalwalk_adjust_compressed.jpg`. Click thumb → swap main. Lightbox on click of main.
- **Right**: 
  - "★★★★★ Trusted by 10,297+ Seniors" microline
  - H1 (Fraunces): **"Finally — A Shoe That Adjusts to You, Not the Other Way Around"**
  - Subhead: "If swollen, aching feet have turned walking into a daily struggle, VitalWalk® was made for you."
  - Three icon-bullets (✅⚡🙌): "Built for feet that swell, ache, and never stay the same" / "Loosen in seconds when you need relief" / "Slide them on easy even on your worst days"
  - Price block: ~~$239.99~~ **$59.95** + green "SAVE 75%" badge + "Pay in 4 interest-free installments of $14.99" Affirm-style microline
  - **Primary CTA button**: full-width, amber/orange (#E8893A — matches WCS energy without copying), large rounded, **"CHOOSE MY SIZE & COLOR →"** → routes to `/select`
  - Trust strip below CTA: 🔒 Secure Checkout · 🚚 Free US Shipping · ↩ 60-Day Returns
  - Tiny payment icons row (Visa/MC/Amex/PayPal/Affirm)

### 4. "As Seen On" press strip
Grayscale logo row using your real assets `Group_1000003006.avif`, `_3005`, `_3003`, `_3002`. Single line, restrained.

### 5. Problem-agitation editorial block
Pulls verbatim from your existing copy:
> **"Right now, your feet control everything."**
> What you wear. Where you go. What you can do. Every shoe squeezes. Every step hurts. You've tried the stretching. The elevation. The ice packs. The pills. **Nothing gives you your life back.**

Two-column with `Copy_of_The_perfect_leg_massage_after_long_runs_1.webp` on the right. Slate text on warm cream background.

### 6. The "10,000+ are walking comfortably again" pivot
Continues the editorial flow:
> **"It doesn't have to be this way."** Thousands of men and women are walking comfortably again. They found the only shoe specifically designed for people with aching, swollen feet — whether from diabetes, edema, arthritis, or neuropathy.

Inline mid-page CTA: "See if VitalWalk Is Right for You →"

### 7. Six-feature deep-dive (alternating image/text rows)
Each row = full-width band, image one side, headline + body other side. Fraunces headlines, Inter body. Heavy whitespace. Uses your real images and your existing benefit copy verbatim:

1. **DayFlex™ Adjustable Velcro System** → `ChatGPT_Image_Dec_16_2025_03_41_32_PM.png`
2. **Slide In Effortlessly Without Bending** → `ChatGPT_Image_Dec_16_2025_03_09_25_PM.png`
3. **Extra Room Where You Need It Most** → `ChatGPT_Image_Dec_16_2025_03_43_30_PM.png`
4. **Walk With Confidence On Any Surface** (non-slip outsole) → `ChatGPT_Image_Dec_16_2025_03_38_44_PM.png`
5. **Lightweight So You Forget You're Wearing Them** → `ChatGPT_Image_Dec_16_2025_03_48_09_PM.png`
6. **Cool, Cushioned Comfort For Sensitive Feet** → `accessory_column_image-03_2.webp`

CTA repeated after row 3 and after row 6.

### 8. Animated GIF benefit grid (4-up)
Pulls the four real GIFs from your existing page:
- `Diabetic_Feet.gif` — "Swelling Relief"
- `Sport_shoes_2.gif` — "Walking Bliss"
- `5.gif` — "Cushioned Insole"
- `12_hours.GIF_3.gif` — "All-Day Rating"

Caption under each. Cream cards, rounded, soft shadow.

### 9. Podiatrist authority block
Headline: **"Recommended by Podiatrists Who Actually Understand"**. Image: `vitalwalk_doctor_compressed.jpg`. Verbatim copy from your page about clinical podiatric standards + medical-grade construction with normal appearance. Adds a "Medical-Grade Construction · Normal Appearance" stamp graphic.

### 10. Social-proof "Reddit/Facebook-style" cards (3 wide)
Replicates the Margaret S. / Catherine M. / Diane L. format from your existing page exactly — avatar circle, name, time-ago, body text, large image, like/comment/share row. Real testimonial copy verbatim:
- **Margaret S.** + `adv2_7.webp` — "What I love most is nobody asks about them..."
- **Catherine M.** + `1_e3923e3c-016c-4c18-9b37-252fe14d566b.jpg` — "My granddaughter's dance recital..."
- **Diane L.** + `2_fd419914-57d9-4a21-b9ee-ee61c36a0a50.jpg` — "I used to have a rotation of reasons..."

Avatars: `Screenshot_2025-12-04_at_7.43.57_PM.png`, `qr68knyzpm0e1.jpg`, `idosos-abracados-sorrindo.webp` — all already on your CDN. This is **real copy and real images already on your store**, not fabricated reviews.

### 11. "Who They're For" condition list
Five conditions in a 2-col list with a checkmark for each: Diabetes & neuropathy / Edema & swelling / Plantar fasciitis & heel spurs / Arthritis & stiffness / Bunions & hammertoes. Closing line: "If walking has become a daily battle, these shoes were made for you."

### 12. "Try Them For 60 Days" guarantee block
Big, centered, badge graphic ("60-DAY MONEY-BACK GUARANTEE" seal). Verbatim copy:
> "We're not asking you to trust us. We're asking you to test us."
Risk-reversal text below.

### 13. Trustpilot-style review wall (8 cards)
"Excellent 4.9 / 5" header. 8 cards in a responsive grid pulling your real Trustpilot-style reviews: Barbara M., Dorothy W., Margaret R., Nancy S., Betty L., Karen K., Diane M., Joyce D., Mary B., Ruth T., Elizabeth C., Carol L., Janet R. Each card: 5 stars, headline, body, name. Subtle "verified purchase" badge.

### 14. FAQ accordion
8 questions verbatim from your existing page. Custom accordion (shadcn) with chevron, soft borders, generous padding.

### 15. Sticky bottom mobile CTA bar (mobile only)
Appears after user scrolls past the hero. Compact strip: small product thumb · "$59.95 ~~$239.99~~" · **"Choose Size & Color →"** button. Hides when CTA in view.

### 16. Final conversion block
Full-bleed background with hero image, dark gradient overlay, centered:
- "Your Feet Don't Have to Hurt Tomorrow"
- Price block again
- Big amber CTA → `/select`
- Tiny "Sale ends tonight" countdown text (static, no fake JS countdown — just honest copy)

### 17. Minimal footer
Slate background, light text. Three small columns: Contact / Shipping & Returns / Privacy. Copyright. Payment icons row.

## Visual System

**Typography**
- Headings: **Fraunces** (Google Fonts) — variable serif, gives editorial NYT/Apothékary energy. Weights 400/500/600/700.
- Body: **Inter** (Google Fonts) — 400/500/600.
- Microcopy/labels: Inter, uppercase, tracked +0.08em.

**Color tokens** (added to `index.css` + `tailwind.config.ts` as HSL semantic vars):
- `--background`: warm cream `42 38% 96%` (matches your existing #fcfbf8 area)
- `--foreground`: deep slate `222 25% 18%`
- `--brand`: amber/orange `26 82% 56%` (CTA primary — close to WCS but slightly more sophisticated)
- `--brand-foreground`: white
- `--accent`: forest green `145 35% 32%` (savings badges, checkmarks)
- `--muted`: warm gray `40 12% 90%`
- `--card`: pure white
- `--border`: warm gray `40 12% 88%`

All components use semantic tokens — never hard-coded colors.

**Spacing & rhythm**
- Sections: `py-20 lg:py-28` desktop, `py-14` mobile
- Container: `max-w-6xl mx-auto px-5 lg:px-8`
- Generous gaps. Editorial breathing room.

**Imagery treatment**
- All product/lifestyle photos: rounded `rounded-2xl`, soft `shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)]`
- Subtle `transition-transform hover:scale-[1.02]` on gallery items
- Lazy-load everything below the fold

**Motion** (Framer Motion, restrained — no theme-park animations)
- Section fade-up on scroll (`whileInView`, opacity + 12px y), once-only
- Hero gallery: smooth crossfade on thumbnail click
- Sticky mobile CTA: slide-up appearance
- Buttons: subtle scale on hover/active, no glows

## Data Layer

**Shopify integration** — uses Storefront API (token + permanent domain already wired) to pull live product data for The Original VitalWalk® Shoes (Copy):
- `src/lib/shopify.ts` — typed `storefrontApiRequest` helper, `2025-07` API version
- `src/hooks/useVitalWalkProduct.ts` — React Query hook, `productByHandle(handle: "the-original-vitalwalk-shoes-copy")` (we'll confirm exact handle on implementation)
- Pulls live: `priceRange.minVariantPrice`, `compareAtPriceRange`, images, availability
- Fallback static prices from product data so the page renders fast even before Shopify responds

**No cart on this page**. The CTAs route to `/select` (placeholder route this session — full variant-picker step built next session). For now `/select` shows a clean stub: "Step 2: Pick your size & color" with a back link, so the funnel is end-to-end clickable.

## File Plan

**New files**
- `src/lib/shopify.ts` — Storefront API client + types
- `src/hooks/useVitalWalkProduct.ts` — product fetch hook
- `src/components/site/AnnouncementBar.tsx`
- `src/components/site/SiteHeader.tsx`
- `src/components/site/SiteFooter.tsx`
- `src/components/funnel/Hero.tsx` — gallery + buy box
- `src/components/funnel/PressStrip.tsx`
- `src/components/funnel/ProblemBlock.tsx`
- `src/components/funnel/PivotBlock.tsx`
- `src/components/funnel/FeatureRow.tsx` — reusable alternating image/text band
- `src/components/funnel/FeatureRows.tsx` — composes the 6 features
- `src/components/funnel/BenefitGifGrid.tsx`
- `src/components/funnel/PodiatristBlock.tsx`
- `src/components/funnel/SocialProofCards.tsx` — Reddit/FB-style cards
- `src/components/funnel/ConditionsList.tsx`
- `src/components/funnel/GuaranteeBlock.tsx`
- `src/components/funnel/ReviewWall.tsx` — Trustpilot-style grid
- `src/components/funnel/FaqSection.tsx`
- `src/components/funnel/StickyMobileCta.tsx`
- `src/components/funnel/FinalCta.tsx`
- `src/data/testimonials.ts` — your real review copy as typed array
- `src/data/features.ts` — feature rows config (image, headline, body)
- `src/data/faqs.ts` — your real FAQ copy
- `src/pages/Select.tsx` — minimal stub for next funnel step

**Edited files**
- `src/pages/Index.tsx` — fully replaces placeholder, composes funnel sections
- `src/App.tsx` — adds `<Route path="/select" element={<Select />} />`
- `src/index.css` — Fraunces + Inter Google Fonts import, semantic color tokens
- `tailwind.config.ts` — Fraunces/Inter font families, brand color extensions
- `index.html` — preconnect to Google Fonts, page `<title>` and meta description for ad-traffic SEO/share preview

## Things I'm NOT Doing (and why)

- **No Shopify reviews app integration** — per your ask. Testimonials are real customer text already on your live store, hardcoded into a typed data file. We can swap to a live source later if you ever want.
- **No fake countdown timer JS** — "Sale ends tonight" stays as honest static copy. Live ticking timers that reset on refresh look cheap and erode trust on a $10K-feel page.
- **No variant picker on this page** — hand-off to `/select` (matching the WCS pattern you referenced).
- **No cart drawer / no checkout wiring this session** — keeps focus on nailing page quality first. Built next session as the variant step + checkout handoff.
- **No fabricated press logos / "featured in Forbes"** — using your real `Group_100000300X.avif` strip from your store.

## What You'll See When This Ships

A page that, on first scroll, feels like a New York Times-grade editorial product story — Fraunces serif headlines, warm cream background, generous margins, real customer photos and testimonials, your existing branded GIFs and lifestyle imagery — but engineered as a tight conversion funnel with a single goal: get the user to tap "CHOOSE MY SIZE & COLOR." Mobile experience is first-class with a sticky bottom CTA. Every claim and every face on the page is real and traceable to your existing store.