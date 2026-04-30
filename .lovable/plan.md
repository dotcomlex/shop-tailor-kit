## What I'm adding

A third row to the trust block under the Step 1 CTA: the payment / security logo strip you uploaded (Visa, MasterCard, Cloudflare, PayPal, SSL). And a tightening pass on the whole block so it reads as one cohesive trust unit.

## Final layout

```text
                ★★★★★  4.9 / 5  ·  2,847 reviews
            🛡 60-Day Guarantee  |  🚚 Free Shipping
            ──────────────────────────────────────────
              [Visa] [MasterCard] [Cloudflare] [PayPal] [SSL]
```

- **Row 1** — star rating (unchanged).
- **Row 2** — guarantee + free shipping badges (unchanged).
- **Row 3 (NEW)** — payment/security logo strip, separated from rows 1–2 by a hairline rule so it reads as a dedicated "secure checkout" zone.

## Files

### Asset
- `src/assets/trust-badges.png` — the uploaded image (already copied into the project).

### `src/components/order/QuantityStep.tsx`
- Add `import trustBadges from "@/assets/trust-badges.png";`
- Append the new row below the existing two-row trust block:

```tsx
<div className="mt-1 w-full border-t border-[hsl(var(--hairline))] pt-2.5">
  <img
    src={trustBadges}
    alt="Secure checkout — Verified by Visa, MasterCard SecureCode, Cloudflare, PayPal Verified, SSL Secured"
    loading="lazy"
    decoding="async"
    className="mx-auto block h-[18px] w-auto max-w-full opacity-70 sm:h-[22px]"
  />
</div>
```

- Bump the parent gap from `gap-1.5` → `gap-2` so the three rows breathe evenly.
- `loading="lazy" decoding="async"` so the badges never block first paint.
- `opacity-70` keeps the logos quiet (they're already grayscale) — they support the page, they don't shout over the CTA.
- `h-[18px]` on mobile, `h-[22px]` on desktop — fits comfortably from 320px up.

## What I will NOT touch

- No new colors / tokens.
- No changes to rows 1 or 2 styling beyond the parent gap.
- Image is a single optimized PNG — no SVG conversion needed for the desired effect.
