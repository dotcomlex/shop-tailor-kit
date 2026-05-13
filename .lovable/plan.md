## Issue
The socks upsell shows size sub-labels like:
- S/M → "US W 5.5–8 · US M 5–7.5"
- L/XL → "US W 8–15 · US M 8–14"

A UK shopper sees no UK range, so they can't tell which bucket fits them. The matching logic in `socksBucketFromShoeSize` already handles UK correctly (UK ≤ 6.5 = S/M, else L/XL); only the **display label** is missing UK.

No Shopify variant change is required — the socks product only has S/M and L/XL options, and they cover all UK sizes via the bucket math.

## Change
In `src/components/order/SocksUpsellModal.tsx`, append UK ranges to the two bucket labels:

```ts
const SIZE_BUCKET_SUBLABEL: Record<SocksSizeBucket, string> = {
  "S/M":  "US W 5.5–8 · US M 5–7.5 · UK 3–6.5",
  "L/XL": "US W 8.5–15 · US M 8–14 · UK 7–13",
};
```

(Also tighten the W boundary to 8.5 in the L/XL label so the two ranges don't visually overlap at 8 — the underlying bucket math is unchanged.)

That's the entire fix. One file, one constant.
