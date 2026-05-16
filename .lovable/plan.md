# Cleaner savings — inline tag on Subtotal row

## `OrderSummary.tsx`
- Remove the standalone savings pill block above Total.
- On the Subtotal row, keep the existing right-side stack: `[strike compare] [bold price]`. Add a small green `−75%` tag directly to the right of the price (or wrap under on narrow viewports — single flex row, `flex-wrap`).
  - Style: `text-[11px] font-bold text-verified bg-verified/10 rounded-md px-1.5 py-0.5`, no icon, no dollar amount.
  - Percent: `Math.round(saved / compare * 100)`.
- No other changes — Total row stays clean, "Today only" stays on shipping line.

Single file, display-only.
