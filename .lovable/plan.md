# Sort insole sizes numerically + final QA

## Problem
In the upsell modal's size picker, variants render in Shopify's storage order (which lines up with Women's US), so when the user switches to Men's US, UK, or EU the displayed numbers come out scrambled (e.g. `... 14, 15, 16, 5`).

## Fix (`src/components/order/InsoleUpsellModal.tsx`)
In the size grid (lines 456–479), sort variants by the **numeric value of the displayed size in the currently selected system** before rendering:

```tsx
{[...product.variants]
  .map((v) => ({ v, display: valueFor(parseShopifySize(v.title), system) }))
  .sort((a, b) => {
    const na = parseFloat(a.display);
    const nb = parseFloat(b.display);
    if (Number.isNaN(na) && Number.isNaN(nb)) return a.display.localeCompare(b.display);
    if (Number.isNaN(na)) return 1;
    if (Number.isNaN(nb)) return -1;
    return na - nb;
  })
  .map(({ v, display }) => /* same button as before */)}
```

`parseFloat` handles half sizes (`"7.5"`, `"38.5"`) correctly, and the NaN guards keep any non-numeric labels at the end without crashing.

## Final QA pass
After the fix I'll re-walk the funnel one more time:
- Open the upsell modal, expand the size picker, toggle through W US / M US / UK / EU and confirm every system renders ascending (5, 5.5, 6, 6.5, …).
- Verify selected size stays selected when the system is switched.
- Reconfirm currency parity: modal price/compare/save line, "You save … on insoles", CTA total, and the Shopify checkout total all match in the detected currency (USD on this preview).
- Confirm `channel=online_store` is still on the generated checkout URL and it opens cleanly.

## Files touched
- `src/components/order/InsoleUpsellModal.tsx` (size grid sorting only)

No new deps, no schema changes.
