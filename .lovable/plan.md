Flip the primary upsell back to insoles by changing one line in `src/components/order/OrderPage.tsx`:

```ts
// line 36
const UPSELL_PRIMARY: "socks" | "insoles" = "insoles";
```

This restores the original flow:
1. Complete Order → Insole upsell modal (as before)
2. Decline insoles → Socks modal shows as secondary offer (existing fallback)
3. Decline socks → Shopify checkout

The socks modal design and all its logic remain untouched — it just moves back to the decline-path slot it occupied before the A/B test. No other files need changes.