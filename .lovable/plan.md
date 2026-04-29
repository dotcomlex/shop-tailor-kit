# Multi-currency price/discount sanity check

## What I verified in the code

The funnel's pricing is authored in **USD** as constants in `QuantityStep.tsx`:

| Bundle | Price (USD) | Compare (USD) | Save % |
|---|---|---|---|
| 1 pair | $69.95 | $233.17 | 70% |
| 2 pair | $116.58 | $466.33 | 75% |
| 3 pair | $139.90 | $699.50 | 80% |

Every on-page price is rendered through `useCurrency().format(usdAmount)`, which:
1. Reads Shopify's localized base price (Shopify Markets returns the product price in GBP/AUD/EUR/etc. via `@inContext`).
2. Computes `rate = localizedBase / 69.95`.
3. Multiplies every USD figure by that same rate.

**Result:** ratios are preserved. 70/75/80% savings stay 70/75/80% in every currency. Compare price always = ~3.33× total. So visually nothing will look "off" to UK/AU/EU shoppers — the strikethrough, the per-pair, the subtotal, the "you save" line, and the % all scale together cleanly.

## The one real risk: checkout total vs. funnel total in non-USD

The funnel auto-applies discount codes `VITALWALK-2PACK` and `VITALWALK-3PACK` at Shopify checkout to make the cart match the advertised bundle total. These codes were created in Shopify's USD context.

- If they're **percentage** discounts (e.g. 50% off / 60% off) → they scale correctly in every currency. Safe.
- If they're **fixed-amount USD** discounts (e.g. "$23.32 off") → in GBP/AUD checkout the discount converts but the *base* price is also localized, so the post-discount total can drift a few cents/pounds from the funnel's displayed total. Shoppers may see a small mismatch on the Shopify checkout page.

I couldn't inspect the price rules just now (Shopify session expired in this environment). Once approved, I'll re-auth and:

1. Read both `VITALWALK-2PACK` and `VITALWALK-3PACK` price rules.
2. Confirm whether they're percentage-based (ideal) or fixed-amount (risky for non-USD).
3. If fixed-amount: convert them to **percentage** discounts that produce the same total in USD — e.g. 2-pack should be 50% off (`$233.18 → $116.58 implies 50%`), 3-pack should be 80% off … and verify against the actual product/compare-at price in Shopify so the math lines up.
4. Spot-check by simulating a checkout in a non-USD market to confirm the totals match.

## What I'm NOT changing

- The funnel UI, copy, percentages, or compare prices — they're already mathematically consistent across currencies.
- The currency conversion logic in `useCurrency` — it's correctly tied to Shopify's localized response, so no rounding surprises on-page.

## Steps

1. Reconnect Shopify session.
2. Inspect `VITALWALK-2PACK` and `VITALWALK-3PACK` price rules.
3. Report back what type they are.
4. If they're fixed-amount, convert them to equivalent percentage discounts so checkout totals stay in sync with the funnel in GBP, AUD, EUR, CAD, etc.
5. No code changes expected unless step 4 reveals a mismatch — and even then it's a Shopify-side discount fix, not a funnel code change.
