## Problem

On mobile the trust block is three rows + a hairline divider + a vertical pipe — too many visual elements stacked tightly under the CTA. It competes with the yellow button instead of supporting it.

## Fix: one calm block, no dividers

```text
   ★★★★★  4.9  ·  60-Day Guarantee  ·  Free Shipping
       [Visa]  [MC]  [Cloudflare]  [PayPal]  [SSL]
```

- **Collapse rows 1 and 2 into a single line** — stars, rating number, then dot-separated `60-Day Guarantee · Free Shipping`. No icons on the badges (icons were doing the same job as the dots).
- **Drop the "/ 5" and "(2,847 reviews)"** on mobile — the stars + "4.9" already say it. (Full review count still lives in the dedicated reviews section below.)
- **Drop the hairline divider** above the payment logos. Use whitespace instead — `mt-2` between the text line and the logos.
- **Drop the vertical pipe divider** that was between Guarantee and Free Shipping.
- Logos stay at `opacity-60`, slightly smaller (`h-[16px]`) on mobile.
- On `sm:` and up, the rating line expands to include `/ 5 · 2,847 reviews` again — desktop has the room.

Net result: 2 quiet visual elements instead of 5. Reads in one glance.

## File

- `src/components/order/QuantityStep.tsx` — replace the entire trust-block `<div>` (~37 lines). No new imports, no new tokens. The `Truck` and `ShieldCheck` lucide imports become unused — remove them too.
