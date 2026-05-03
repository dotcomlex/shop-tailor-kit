## Problem

The toasts "stop working" after a bit of testing because two pieces of state live in `sessionStorage` and survive every page reload inside the same tab:

1. **`vw_purchase_toast_count`** — once it reaches the per-session cap (currently 5), no more toasts ever fire until the tab is closed.
2. **`vw_purchase_toast_dismissed`** — once you click the ✕ a single time, toasts are silenced for the rest of the tab session, even after a hard refresh.

That matches what we just saw: one toast appeared, you dismissed it, refreshed the page, and nothing came back.

## Fix

Switch both counters from `sessionStorage` to in-memory refs scoped to the component mount. They still cap a single page view (so we can never spam) but reset cleanly on every reload — which is the behavior we actually want for a landing page funnel.

### Edit `src/components/order/RecentPurchaseToasts.tsx`

- Remove `SESSION_COUNT_KEY`, `SESSION_DISMISSED_KEY`, and `MAX_PER_SESSION`.
- Add `MAX_PER_PAGEVIEW = 6`.
- Replace the `sessionStorage` reads/writes for the count with a `countRef = useRef(0)`.
- The dismissed-flag already uses a ref (`dismissedRef`) — just stop seeding it from `sessionStorage` and stop persisting it. Dismiss now means "silence for this page view only".
- Keep timing as-is (8–15s first, 22–40s subsequent, 5.5s visible).

### Sanity-test plan after the change

1. Hard refresh the order page → first toast appears within ~15s.
2. Wait → 2nd toast appears within ~40s. Continue until cap (6).
3. Dismiss one → no more toasts on that page view.
4. Refresh → toasts work again from scratch (this is the regression we're fixing).
5. Switch to `?country=DE` → no toasts (out-of-market gating still correct).
6. Advance to Step 3 → toasts paused (still correct).

## What stays the same

- Geo gating to US/UK/AU/CA only
- Bottom-left placement, animation, copy, icons
- Pause on Step 3
- Dismiss button behavior within the page view

No other files change.