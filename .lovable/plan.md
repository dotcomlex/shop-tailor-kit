# Full Funnel QA Sweep

I'll run a complete end-to-end test of the live funnel in the browser, covering every step, button, and the currency/geo behavior across the top 4 markets.

## What I'll test

### 1. Step 1 — Quantity selection
- All three bundle cards render with correct per-pair pricing and strike-through
- "MOST POPULAR" pill appears on the right card
- Save % pills are correct
- Selecting each option (1, 2, 3 pairs) advances correctly
- Sticky CTA reflects selected bundle total

### 2. Step 2 — Color & Size
- All color swatches selectable, image updates
- Size grid: each size selectable, sold-out states behave
- Sizing dialog opens and closes
- "True to size" meter renders
- For 2-pair / 3-pair bundles: confirm extra pair color/size pickers appear and gate the CTA until filled

### 3. Insole upsell modal
- Pops after Step 2 / before Step 3
- "Yes, add" and "No thanks" both work
- Insole price matches selected shoe size variant
- Currency on insole matches localized currency

### 4. Step 3 — Review & Checkout
- Order summary totals match Step 1 selection
- Insole line appears only if accepted
- Scarcity bar, guarantee, checklist, reviews, FAQ all render
- Sticky checkout bar appears after FAQ scroll
- "Complete My Order" creates Shopify cart and redirects to checkout

### 5. Checkout (Shopify)
- Lands on Shopify checkout in correct currency
- Line items show correct color/size attributes for each pair
- Insole present if added
- Totals match what Step 3 displayed (no drift)

### 6. Currency & Geo — top 4 markets
For US, CA, AU, GB I'll verify:
- Currency symbol/code on Steps 1–3
- Insole modal price
- Sticky bar price
- Shopify checkout opens in matching currency with matching totals

I'll simulate each country by overriding the geo cache (localStorage) and reloading, then walk the funnel.

### 7. Misc UI
- Header / nav links
- Recent purchase toasts
- Support chat opens/sends a message
- Mobile viewport (390x844) layout sanity check on each step

## Deliverable

A pass/fail report per area with screenshots of any issues found, and (if I find a bug) a separate follow-up to fix it — no code changes will be made during this plan.

Approve and I'll start the sweep.