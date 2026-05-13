## Funnel Audit — Findings & Recommended Fixes

I walked the funnel end-to-end (geo → product fetch → step 1/2/3 → upsell modals → checkout). The bucket math, pixel events, price-sync guard, and step gating all look correct. The bottlenecks are network/load-time, not logic. Two clear wins, plus a few small polish items.

---

### 1. `useGeo` fan-out — 12 redundant edge-function calls per page load (HIGH IMPACT)

**Symptom (visible in network log):** `GET /functions/v1/geo` fires **12 times** within ~1 second on first load.

**Cause:** 12 components/hooks call `useGeo()`. Each instance independently runs `detectCountry()` in its own `useEffect`. There's a localStorage cache, but a brand-new visitor (no cache) gets all 12 firing in parallel, and even cached visitors trigger 12 background revalidations.

**Fix:** Make `detectCountry()` a singleton — coalesce concurrent calls into one in-flight promise:

```ts
// src/lib/geo.ts
let inflight: Promise<DetectedCountry | null> | null = null;
export async function detectCountry() {
  if (inflight) return inflight;
  inflight = (async () => { /* existing body */ })()
    .finally(() => { inflight = null; });
  return inflight;
}
```

Same treatment for `revalidateInBackground`. Result: **1 geo call instead of 12**, faster TTFB on the first bundle query, less Supabase usage.

---

### 2. Lazy-load post-interaction code (MEDIUM IMPACT — smaller initial JS)

These components are in the initial bundle but only render after the user takes an action:
- `SocksUpsellModal` + `InsoleUpsellModal` — only after "Complete Order" click
- `SizingDialogs` (size chart, fit guide) — only on "Need help?" tap
- `AlyssaChat` (in `SupportChatProvider`) — only on chat-bubble click
- `RecentPurchaseToasts` — fires on a delay; can defer

**Fix:** `React.lazy()` + `Suspense` for these four. Estimated initial JS savings: ~30–50 KB gzipped (Radix Dialog already in main, but chat + toast + size-chart copy add up). Faster LCP, faster TTI on mobile.

---

### 3. Preload the LCP hero image (SMALL — measurable LCP gain)

The shoe hero (`23b406cd-…png` at the top of `ProductPanel`) is the LCP element. Add to `index.html`:

```html
<link rel="preload" as="image"
  href="https://cdn.shopify.com/s/files/1/0843/7143/9902/files/23b406cd-224c-430b-8e83-8fcc7b918934.png"
  fetchpriority="high" />
```

Already have `preconnect` to `cdn.shopify.com` ✓. Adding the preload typically shaves 200–400 ms off mobile LCP.

---

### 4. Preconnect to Supabase edge (SMALL)

`vsbvrchqdvzwggsrgcrm.supabase.co` is hit on first paint (geo) and again later (fb-capi). Add:

```html
<link rel="preconnect" href="https://vsbvrchqdvzwggsrgcrm.supabase.co" crossorigin />
```

Saves ~100–150 ms of TLS handshake on the very first geo call (which is in the critical path of the bundle fetch when there's no geo cache).

---

### 5. Tiny polish

- **`fbevents.js` script** in `<head>` is fine (it's async-injected) — no change needed, just confirming.
- **`useGeo` `loading` state** isn't read by any consumer right now — harmless, but could be removed.
- **Socks upsell labels** — shipped last turn ✓.

---

### Out of scope (intentionally not touching)

- Pixel event mapping, price-sync guard, RLS, Shopify variant logic — all working correctly.
- No code-splitting of routes — the app is essentially a single page; route-splitting wouldn't help.

---

### Suggested order of execution

1. `geo.ts` singleton (the big one — kills 11 redundant requests).
2. `index.html` preload + preconnect (1-line wins).
3. `React.lazy` the 4 post-interaction components.

Want me to ship all three, or just #1 + #2 first and benchmark before doing the lazy-load refactor?