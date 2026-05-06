# Send each pair as its own variant in Shopify

## What you're seeing today

When a customer buys a 2-Pair or 3-Pair bundle, Shopify gets **one** line item:

- Variant: just Pair 1's color + size
- Pair 2 / Pair 3 are written into a **note** at the bottom

Your supplier's system doesn't read the note, so Pairs 2 and 3 are invisible to them.

## What I'll change

After this fix, a 2-Pair order with Pair 1 = Black / W9 and Pair 2 = Sand / W8 will look like this in Shopify:

```text
VitalWalk 2-Pair Bundle — Black / US W 9 / Pair 1     qty 1     $XX.XX
VitalWalk 2-Pair Bundle — Sand  / US W 8 / Pair 2     qty 1     $0.00
                                                       Total:    $XX.XX
```

Each pair is its own real variant with its own color and size. The supplier sees them directly — no notes, no setup on their end.

## Answers to your questions

**"Is anything changing in the funnel?"**
No. The customer sees the exact same thing — same prices, same total, same checkout, same Shopify-hosted payment page. The change is only in how Shopify records the order behind the scenes.

**"Are the variants going to be Pair 1 and Pair 2?"**
Yes, exactly. I'll add a simple third option to each bundle product called **"Pair"** with values **"Pair 1"**, **"Pair 2"**, **"Pair 3"**. The customer never sees this option — it's only used by us when building the cart line.

**"Why did you add the hidden tag?"**
Removed. Forget it. Not needed.

## The setup, plain and simple

On the **2-Pair Bundle** product:
- Existing variants stay as they are, just labeled `Pair 1` (full bundle price).
- I add matching `Pair 2` variants for every color + size, priced **$0.00**.

On the **3-Pair Bundle** product:
- Existing variants → `Pair 1` (full bundle price).
- New `Pair 2` and `Pair 3` variants for every color + size, priced **$0.00**.

The 1-Pair product is untouched.

When a 2-pair order goes through:
- Pair 1 line uses the `Pair 1` variant (carries the full bundle price)
- Pair 2 line uses the `Pair 2` variant ($0)
- Total = bundle price ✓
- Supplier sees both pairs as real variants ✓

## Steps I'll do

1. Read all current variants on the 2-Pair and 3-Pair bundles.
2. Add the `Pair` option and create the `Pair 2` (and `Pair 3` for the 3-pack) variants at $0 for every color + size.
3. Update the cart-building code in `OrderPage.tsx` to send one line per pair using these variants.
4. Keep the customer-side note for backwards readability — but it's no longer the source of truth.

## Quick check after deploy

Place a test 2-pair and a test 3-pair order with **different** colors and sizes per pair. Confirm Shopify shows one line per pair with the right color/size, and the order total matches the bundle price (not 2× or 3×).
