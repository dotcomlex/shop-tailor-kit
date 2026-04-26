## Goal
Make the Shopify cart total match what the order page advertises:
- 1 pair → $69.95 (already correct, no change)
- 2 pairs → **$116.58** (currently charges $139.90)
- 3 pairs → **$139.90** (currently charges $209.85)

## Approach: Auto-applied discount codes

Single product, single SKU, single $69.95 price stays untouched. Two discount codes do the bundle math at checkout.

### Step 1 — Create price rules + discount codes in Shopify

Use the Shopify tools to create two fixed-amount price rules, each gated on a minimum quantity, then attach a discount code to each:

**`VITALWALK-2PACK`**
- `value_type: fixed_amount`, `value: -23.32`
- `prerequisite_quantity_range: { greater_than_or_equal_to: 2 }` (applies to 2+ pairs)
- `allocation_method: across`
- `target_type: line_item`, `target_selection: all`
- `customer_selection: all`, `once_per_customer: false`

**`VITALWALK-3PACK`**
- `value_type: fixed_amount`, `value: -69.95`
- `prerequisite_quantity_range: { greater_than_or_equal_to: 3 }`
- Same allocation/target/customer settings

> Note: the `shopify--create_price_rule` tool I have access to doesn't expose `prerequisite_quantity_range` directly. I'll create the rules via the available params and, if needed, call the Shopify Admin REST API directly through the gateway to set the quantity threshold. If neither path works in this session, I'll fall back to a single 75%-off code keyed on a 2-pair minimum and a separate 80%-off code keyed on a 3-pair minimum (percentage-based, simpler).

### Step 2 — Pass the discount code into the Shopify cart

Edit **`src/lib/shopify.ts`**:

1. Update `CART_CREATE_MUTATION` to accept `discountCodes` in the `CartInput`:
   ```graphql
   mutation cartCreate($input: CartInput!) {
     cartCreate(input: $input) {
       cart { id checkoutUrl }
       userErrors { field message }
     }
   }
   ```
   (No schema change — `CartInput` already supports `discountCodes: [String!]`.)

2. Extend `createCheckoutForLines` to accept an optional `discountCodes: string[]` arg and forward it in the input.

### Step 3 — Wire it up in `OrderPage.tsx`

In `handleCheckout`, derive the discount code from the selected quantity:
```ts
const discountCodes =
  quantity === 3 ? ["VITALWALK-3PACK"] :
  quantity === 2 ? ["VITALWALK-2PACK"] :
  [];
const { checkoutUrl, error } = await createCheckoutForLines(lines, discountCodes);
```

### Step 4 — Verify

After deploy, I'll do a quick smoke test by walking through each quantity tier and confirming the checkout subtotal matches:
- 1 pair → $69.95
- 2 pairs → $116.58
- 3 pairs → $139.90

## Files touched
- `src/lib/shopify.ts` — extend mutation + function signature
- `src/components/order/OrderPage.tsx` — pass discount codes to checkout

## Shopify-side changes (via tools)
- 2 new price rules
- 2 new discount codes (one per rule)

No new dependencies, no schema changes, no new variants. Reversible — deleting the codes restores the old per-pair-only behavior.
