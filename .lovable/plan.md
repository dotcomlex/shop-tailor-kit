# Brand Color, Trust Placement & Live Currency Conversion

## 1. Replace blue accent with brand green `#0F483A`

The `--order-blue` token is used everywhere as the primary accent (step headers, selected cards, size-chart highlights, links, swatch rings, ShieldCheck icons, etc.). I'll repoint the token instead of hunting every component — one change cascades cleanly.

**File: `src/index.css`**
- `--order-blue: 226 67% 54%` → `--order-blue: 165 66% 17%` *(this is `#0F483A` in HSL)*
- `--order-blue-soft: 215 100% 96%` → `--order-blue-soft: 165 40% 95%` *(matching very-pale green tint for substrips, Shipping Protection icon bg, countdown bg)*
- `--ring: 226 67% 54%` → `--ring: 165 66% 17%` *(focus rings stay on-brand)*

Because every component already references `hsl(var(--order-blue))` / `bg-order-blue` / `bg-order-blue-soft`, no component edits are needed for the recolor. The result: step headers, selected quantity card, size-chart highlights, swatch rings, "View size chart" links, and the ShieldCheck pill all turn forest green.

I'll also rename the comment in `index.css` from "step bars + selected card" to reflect brand green so future devs know it's the brand color, not just "blue."

## 2. Move "SECURE SSL · GUARANTEED SAFE CHECKOUT" to Step 3 only

Currently `<TrustRow />` is rendered at the bottom of **both** Step 1 (`QuantityStep.tsx`) and Step 2 (`ColorSizeStep.tsx`), so it appears under each step. It should live only under the final checkout button in Step 3.

**Files:**
- `src/components/order/QuantityStep.tsx` — remove `<TrustRow />` render (line ~139) and the import (line ~4).
- `src/components/order/ColorSizeStep.tsx` — remove `<TrustRow />` render (line ~129) and the import (line ~6).
- `src/components/order/UpgradeStep.tsx` — add `<TrustRow />` directly **below** the "Secure checkout · Powered by Shopify · 60-day money-back" microline, above the payment-methods pill. Import `TrustRow` at the top.

This consolidates all trust signals at the moment of conversion (right under the "Complete My Order" CTA) instead of sprinkling them after every step.

## 3. Automatic currency converter

**Approach:** Use Shopify's native multi-currency at checkout (already happens — Shopify auto-converts based on shopper IP at the checkout page) **plus** an on-page live preview so users see prices in their local currency *before* clicking checkout.

### 3a. Currency utility — new file `src/lib/currency.ts`
- `SUPPORTED_CURRENCIES`: map of `{ US: 'USD', GB: 'GBP', CA: 'CAD', AU: 'AUD', NZ: 'NZD', DE/FR/IT/ES/NL/...: 'EUR', SE: 'SEK', NO: 'NOK', DK: 'DKK', CH: 'CHF', PL: 'PLN' }` keyed by ISO-2 country code (reusing the same country list already in `src/lib/geo.ts`).
- `currencyForCountry(code)`: returns the currency code, defaulting to `USD`.
- `fetchRates()`: fetches USD-base rates from `https://open.er-api.com/v6/latest/USD` (free, no key, CORS-enabled). Caches result in `localStorage` with a 6-hour TTL under key `vitalwalk_fx`. Falls back to a hardcoded snapshot of common rates if the API fails (so the page never breaks).
- `formatPrice(amountUsd, currency, rate)`: uses `Intl.NumberFormat(locale, { style: 'currency', currency })` to render correctly localized output (e.g., `£59.95`, `€56,40`, `A$92.50`, `C$84.20`).

### 3b. Hook — new file `src/hooks/useCurrency.ts`
- Combines `useGeo()` + `fetchRates()`.
- Returns `{ currency, rate, format(amountUsd), loading, isConverted }`.
- `isConverted` = `true` when currency ≠ `USD` (so we can show a "Charged in USD at checkout · ~£X.XX shown" disclaimer).

### 3c. Wire into price displays

**`src/components/order/OrderSummary.tsx`** — primary surface:
- Read `useCurrency()`.
- Show subtotal, protection, total in **localized currency** as the headline.
- Below the total, show muted line: `≈ $XX.XX USD · charged at checkout` when `isConverted` is true. This is honest (Shopify charges in store currency) and reassuring.

**`src/components/order/QuantityStep.tsx`** — bundle option prices (`opt.perPair`, `opt.compare`):
- Use `format()` so the three quantity cards show prices in the shopper's currency.

**`src/components/order/SavingsHero.tsx`** — "You're saving $X today" and "vs $Y retail":
- Use `format()` for both numbers.

**`src/components/order/UpgradeStep.tsx`** — "Add Shipping Protection — $5.95":
- Use `format()` for the protection price.

### 3d. Currency indicator in header
**`src/components/order/SiteHeader.tsx`** — add a small right-aligned chip: `🇬🇧 GBP` (flag + currency code) so users immediately see the page has adapted to them. Click does nothing for now (read-only indicator); we can add a manual override later if desired.

### 3e. Important caveat shown to user
At the very bottom of `OrderSummary` when converted, render a single 11px muted line:
> *Prices shown in {CURRENCY} for reference. Final charge is processed by Shopify at checkout in your local currency.*

This avoids any legal/UX risk of a mismatch between displayed and charged amounts (Shopify's checkout handles the actual conversion at its own rate).

## Files touched
- **Edit** `src/index.css` — repoint `--order-blue`, `--order-blue-soft`, `--ring` to brand green
- **Edit** `src/components/order/QuantityStep.tsx` — remove TrustRow, add currency formatting
- **Edit** `src/components/order/ColorSizeStep.tsx` — remove TrustRow
- **Edit** `src/components/order/UpgradeStep.tsx` — add TrustRow under microline, currency-format protection price
- **Edit** `src/components/order/OrderSummary.tsx` — currency-format all rows + add disclaimer
- **Edit** `src/components/order/SavingsHero.tsx` — currency-format saved/retail
- **Edit** `src/components/order/SiteHeader.tsx` — add flag+currency chip on the right
- **New** `src/lib/currency.ts` — country→currency map, rate fetch w/ cache + fallback, formatter
- **New** `src/hooks/useCurrency.ts` — combines geo + rates into a single hook

## Out of scope (will not touch)
- Shopify checkout itself (already auto-converts by IP at checkout — no API change needed)
- Manual currency-switcher UI (can add later if user wants override control)
- Server-side rate caching (client cache is sufficient for this volume)
