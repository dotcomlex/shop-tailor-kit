## Plan — Facebook Pixel tracking + UK sizing verification

### 1. Facebook Pixel (browser) — Pixel ID `851134777335081`

Add the standard FB Pixel base snippet to `index.html` (in `<head>`), plus a `<noscript>` fallback `<img>` placed inside `<body>` (HTML5 disallows it in `<head>`).

Fire these events from the React app (no extra page-load PageView since base code already fires it):

- **`PageView`** — automatic via base snippet on `/` (the order/cart page).
- **`InitiateCheckout`** — fired in `OrderPage.handleCheckout()` right before redirecting to Shopify checkout. Payload:
  - `value`: `bundleTotal` (already in user currency via Shopify `@inContext`)
  - `currency`: from `product.priceRange.minVariantPrice.currencyCode`
  - `num_items`: `quantity`
  - `content_ids`: array of selected variant IDs (numeric portion of `gid://shopify/ProductVariant/...`)
  - `content_type`: `"product"`
- **`AddToCart`** — fired once per user when they first complete Step 2 (color + size selected, advancing to Step 3). Same payload shape using single-pair price.
- **`ViewContent`** — fired once when product data loads on page mount.

All events also dedupe-ready: generate a UUID `event_id` per event and pass it both to `fbq('track', ..., {...}, {eventID})` and to the CAPI call below.

### 2. Facebook Conversions API (server-side) — for iOS/ad-blocker resilience

Since this is a client-side Vite app with no backend, we'll add a **Lovable Cloud edge function** `fb-capi` that proxies events to Facebook's Graph API:

- Endpoint: `POST https://graph.facebook.com/v21.0/851134777335081/events`
- Stores access token as `FB_CAPI_ACCESS_TOKEN` secret (the long token you provided).
- Receives `{event_name, event_id, event_time, custom_data, user_data}` from the browser.
- Hashes email/phone (none today, but ready) with SHA-256; passes `client_user_agent`, `client_ip_address` (from request headers), and `fbp` / `fbc` cookies for matching.
- Returns 200 quickly; logs Facebook response for debugging.

Browser side: small helper `src/lib/fbpixel.ts` that:
- exposes `track(eventName, customData)` which fires `fbq` AND posts to the edge function with the same `event_id` (deduplication).
- reads `_fbp` / `_fbc` cookies and includes them in the CAPI body.

### 3. Lovable Cloud setup

This requires enabling **Lovable Cloud** (one click) so we get an edge function runtime + secrets storage. Then add the secret `FB_CAPI_ACCESS_TOKEN` with the value you provided.

### 4. UK sizing verification

Right now `src/data/sizeChart.ts` uses an industry-standard conversion table. The user wants it to **exactly match what's listed in their Shopify product for UK customers**.

The Shopify session is currently expired so I can't read the live variant size labels yet. After reconnecting Shopify, I will:

1. Pull the live product variants for `the-original-vitalwalk®-shoes-copy`.
2. Read each `Size` option string (e.g. `"US W 8 / US M 6.5 / UK 5.5"`).
3. Diff the UK numbers against the `TABLE` in `sizeChart.ts`.
4. If anything mismatches, update the `uk` column in `TABLE` so the size tile grid + size chart dialog show the exact UK number Shopify uses.

No layout changes — only data corrections if needed.

### Files touched

- `index.html` — add FB Pixel base snippet + `<noscript>` pixel in `<body>`.
- `src/lib/fbpixel.ts` — **new** helper (`track`, dedupe, CAPI POST).
- `src/components/order/OrderPage.tsx` — fire `ViewContent`, `AddToCart`, `InitiateCheckout`.
- `supabase/functions/fb-capi/index.ts` — **new** edge function proxy to Facebook Graph API.
- Lovable Cloud secret: `FB_CAPI_ACCESS_TOKEN`.
- `src/data/sizeChart.ts` — only if Shopify UK numbers differ from current table.

### Approval needed

Approving this plan will:
1. Enable **Lovable Cloud** on this project (needed for the CAPI edge function + secret storage).
2. Re-prompt **Shopify reconnect** so I can verify the UK sizing against your live variants.
