## Plan: Simplify Socks Size Labels

### What
Update the size sub-labels in the socks upsell modal to show a cleaner, region-focused range that covers the main customer base (US, UK, CA, AU).

### Why
The current labels include US M ranges that overlap loosely with the actual size chart. A UK shopper also can't tell which bucket fits them. The underlying bucket-matching logic is already correct — this is purely a display fix to build buyer confidence.

### Changes
1. In `src/components/order/SocksUpsellModal.tsx`, update the `SIZE_HINTS` constant:

```ts
const SIZE_HINTS: Record<SocksSizeBucket, string> = {
  "S/M":  "US W 5–8 · UK 2.5–5.5",
  "L/XL": "US W 8.5–14.5 · UK 6–12",
};
```

- S/M: Covers US Women 5–8 and UK 2.5–5.5 (which also covers AU Women and AU Men since AU sizes map to US W and UK respectively).
- L/XL: Covers US Women 8.5–14.5 and UK 6–12.
- Removed US M and EU references to keep the selection simple and uncluttered.

No Shopify product variants, backend logic, or size-chart data changes are required.

### Files to edit
- `src/components/order/SocksUpsellModal.tsx` (one constant, two strings)