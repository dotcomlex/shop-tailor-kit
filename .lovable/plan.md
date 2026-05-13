## Two changes + a verification pass

### 1. Hide the variant pack shot until a color is picked

Right now the gallery is `[pack, lifestyle1, lifestyle2, lifestyle3]` and the hero defaults to the pack. You want the **first lifestyle image** in the hero on open, and the pack shot to only appear once the user taps Black or White.

**Implementation in `SocksUpsellModal.tsx`:**

```ts
// Before (always 4 tiles)
const gallery = [
  { src: packSrc, ... },
  ...LIFESTYLE_IMAGES.map(...),
];

// After (3 tiles until colorTouched, then 4 with pack first)
const gallery = colorTouched
  ? [{ src: packSrc, alt: `${product.title} — ${color}`, key: `pack:${color}` },
     ...LIFESTYLE_IMAGES.map((img, i) => ({ src: img.src, alt: img.alt, key: `life:${i}` }))]
  : LIFESTYLE_IMAGES.map((img, i) => ({ src: img.src, alt: img.alt, key: `life:${i}` }));
```

- Default `activeImg` stays `0` → first lifestyle shows in hero
- Color tap handler already calls `setActiveImg(0)` → that now lands on the newly-prepended pack shot
- `safeIdx = Math.min(activeImg, gallery.length - 1)` already handles the array shrinking/growing
- Reset on modal open (`setColorTouched(false); setActiveImg(0);`) is already in place

### 2. Fill the right-column white space below the SAVE pill

On 390px, the right column ends at the green pill while the left column extends through the thumbnail row — leaving ~70px dead space.

**Add a compact 3-row "what you get" stack** directly under the SAVE pill (inside the right column, before the closing `</div>` of the hero column):

```tsx
<ul className="mt-2.5 space-y-1">
  {[
    "3 pairs included",
    "Free US shipping",
    "60-day guarantee",
  ].map((line) => (
    <li key={line} className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[hsl(var(--text-body))]">
      <Check className="h-2.5 w-2.5 shrink-0 text-[hsl(var(--verified-green))]" strokeWidth={3.5} />
      <span>{line}</span>
    </li>
  ))}
</ul>
```

- 3 lines × ~14px line-height + 10px top margin ≈ 60px → matches the gap
- Uses existing `Check` icon import; no new color tokens
- Selected vs unselected is N/A — these are static
- Mobile (390px): right column ≈ 175px, longest line "60-day guarantee" ≈ 100px at 10.5px → fits with margin
- Tablet/desktop: same component, scales naturally because column is fluid

Note: this is **distinct** from the bottom trust line (`Free shipping · 60-day money-back · Doctor-recommended`) which sits under the CTA — that stays. The new stack is hero-density; the bottom line is CTA-reassurance. Slight wording overlap is fine — a/b research consistently shows trust signals reinforce when repeated near both the price and the CTA.

### 3. Verification pass (no code changes, just sanity checks)

- **Currency on the page**: `OrderPage` already pulls `bundle.priceRange.minVariantPrice.currencyCode` from `useVitalWalkProduct`, which is fetched via `fetchVitalWalkBundles(country)` → uses `@inContext(country:)`. ✅
- **Currency in socks upsell**: `fetchSocksProduct(country)` already passes country → `variant.price.currencyCode` flows into `formatMoney(unitPrice, currency)`. ✅
- **Currency in insoles upsell**: same pattern via `fetchInsoleProduct(country)`. ✅
- **Cart → Shopify checkout**: `createShopifyCart` is called with `country` → sets `buyerIdentity.countryCode` → checkout URL opens in the right market with the right currency. ✅
- **One thing to spot-check after the edit**: open modal → confirm hero starts on lifestyle, tap Black → confirm hero swaps to black pack shot and 4 thumbs render; tap White → swaps; close + reopen → resets to lifestyle. Verify CTA price + "You save X" still show in EUR/GBP/etc. when geo is non-US (browser console will show `[currency]` warning if Shopify falls back to USD).

## Files

- `src/components/order/SocksUpsellModal.tsx` — gallery construction (one ternary swap) + 3-row trust stack insert (~12 lines)

No other files touched. Funnel/checkout/pixel/cart wiring untouched.
