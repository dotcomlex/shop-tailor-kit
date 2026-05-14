## Re-order post-CTA trust elements

Right now under the "Complete My Order" button:

```text
[ Complete My Order ]
60-Day Guarantee card
🔒 Secure SSL checkout · Powered by Shopify
Payment badges
```

The microline is floating below the guarantee card, disconnected from the button it's meant to support. Swap so the microline sits *immediately* under the CTA — that's where it belongs (it's a button-level reassurance, not a guarantee-level one).

### New order

```text
[ Complete My Order ]
🔒 Secure SSL checkout · Powered by Shopify
60-Day Guarantee card
Payment badges
```

### Files touched
- `src/components/order/UpgradeStep.tsx` — move the `<RiskFreeGuarantee />` block from directly under the CTA to between the microline and the payment badges.

### Out of scope
- No copy changes, no styling changes, nothing else moves.