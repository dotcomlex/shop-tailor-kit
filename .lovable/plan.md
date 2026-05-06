## Goal

Step 1 stays visually identical to today. Only one swap: the price headline becomes the **per-pair price** instead of the bundle total. The strike-through above it becomes the **per-pair retail** (no label, no extra text — just the struck number, exactly like today).

## Card — before vs after

```text
BEFORE (2 pairs)         AFTER (2 pairs)
─────────────────        ─────────────────
$219.80     ← strike     $199.83     ← strike
$109.90     ← headline   $54.95 /ea  ← headline
$54.95/pair ← sub                    (sub-line removed)
```

- 1 pair → strike `$199.83`, headline `$59.95 /ea`
- 2 pairs → strike `$199.83`, headline `$54.95 /ea`
- 3 pairs → strike `$199.83`, headline `$49.95 /ea`

The red `Save 70% / 75% / 80%` pill stays. MOST POPULAR / BEST DEAL ribbons stay. Spacing, fonts, colors stay. No new labels, no "if bought separately", no extra savings line.

## File touched

`src/components/order/QuantityStep.tsx` only.

In `readLocalizedTotals`, add:
- `perPair` = live tier per-pair price (already available).
- `perPairCompare = perPair / (1 - savePct)` so the strike stays consistent across all three cards.

In the price column:
- Strike line → `format(perPairCompare)`
- Headline → `format(perPair)` + small muted `/ea` suffix
- Delete the small `{perPair}/pair` sub-line

## Out of scope

Step 3, sticky bar, cart payload, currency/geo, pixels, sales toasts — all untouched.