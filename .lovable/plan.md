# Step 3 polish — bolder savings + "Today only" free shipping

## 1. Bolder savings highlight — `OrderSummary.tsx`
Replace the small italic line under Total ("You're saving $X today.") with a green pill badge that sits **above** the Total row, full-width-aligned to the right:

```
[ ✓ You saved $97.95 · 70% off ]            ← new pill
Total                              $42.00
```

- Pill style: `bg-verified/10 text-verified` with a check icon, rounded-full, semibold, ~11px.
- Percent is computed from `saved / compare` (same data the strike-through already uses).
- Drops the existing italic line.

## 2. "Today only" on free shipping — `OrderSummary.tsx`
Next to the green `FREE` value on the Shipping row, add a small muted tag: `Today only`. Keeps the line visually balanced — label on the left, "FREE · Today only" on the right.

Stays display-only; no business-logic or Shopify changes. No new files.

## Files
- `src/components/order/OrderSummary.tsx` — savings pill above Total, "Today only" microcopy on shipping line
