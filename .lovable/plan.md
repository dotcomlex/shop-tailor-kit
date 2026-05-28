# Sanity check: get.vitalwalk.store → order.vitalwalk.store

Read-only verification across the two live domains. No edits, no checkout test (already done in the earlier passes for US/GB/AU/CA).

## What I'll check

**1. get.vitalwalk.store**
- Loads with 200, no blank screen
- Hero/CTA renders cleanly at the user's viewport
- The "Claim / Get" CTA points at `order.vitalwalk.store` (not the old `cart.` domain)
- No red console errors, no broken images
- Localized currency renders (geo → currency pipeline working)

**2. order.vitalwalk.store**
- Loads with 200
- Step 1/2/3 all render, no stuck skeletons
- Prices render in local currency (no USD flash, no `[currency] Shopify returned USD` warning)
- 1pr / 2pr / 3pr bundle tiles all show prices
- Color swatches + size grid populate from Shopify
- Sticky checkout bar + summary stay in sync
- No console errors, no failed network requests (Shopify Storefront, geo edge fn, FB pixel)

**3. Cross-domain handoff**
- Clicking the CTA on `get.` lands on `order.` with the same geo/currency
- No flash-of-USD between the two pages

## Output

A short pass/fail report:

```
get.vitalwalk.store   | loads ✓ | currency ✓ | CTA → order ✓ | console clean ✓
order.vitalwalk.store | loads ✓ | currency ✓ | bundles ✓     | console clean ✓
Handoff               | geo preserved ✓
```

Plus a flag list for anything that's broken or noisy (warnings, slow requests, fallback to USD, etc.). If everything is clean I'll just say "all good".

## Scope

- One pass at the current viewport (1067×781)
- US geo by default (whatever the sandbox IP resolves to)
- No checkout creation, no order placement, no code changes
