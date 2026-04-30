## What's broken

Current trust strip uses a single `flex-wrap` row with three items separated by dots. On 430px viewport "Free Shipping" wraps to its own line, leaving an orphan dot and the third pill alone — looks accidental.

## Fix: two clean stacked rows, no wrap orphans

```text
★★★★★  4.9 / 5  ·  2,847 reviews
🛡 60-Day Guarantee  |  🚚 Free Shipping
```

- **Row 1** — rating only. Stars + `4.9 / 5` + dot + `2,847 reviews`. One tight line that always fits.
- **Row 2** — two badges separated by a thin vertical hairline divider (`h-3 w-px bg-hairline`) instead of a dot. Reads as deliberate.
- Container becomes `flex flex-col items-center gap-1.5` — no `flex-wrap`, so nothing can ever orphan.
- Same icons, same colors, same data source — only layout changes.

## File

- `src/components/order/QuantityStep.tsx` — replace the trust-strip `<div>` block (lines 203–241) with the two-row version above. No new imports, no new tokens.

## Why this is cleaner

- Rating gets its own row → reads as the headline social proof, not as a label competing with the badges.
- Two-item row 2 is symmetrical and balanced regardless of viewport width (320px → 430px → desktop).
- Vertical hairline divider matches the design language already used elsewhere on the page (StepHeader uses the same `--hairline` token).
