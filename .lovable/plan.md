# Harden upsell size-system sync + final triple-check QA

The "EU instead of M US" symptom you saw is most likely a stale browser cache, but the underlying code does have a real fragility that could reproduce it under the right conditions. I want to fix that root cause and then walk the whole funnel one more time.

## Why it can still happen (root cause)

In `src/components/order/InsoleUpsellModal.tsx` (lines 111–114):

```tsx
const system: SizeSystem = useMemo(
  () => readStoredSystem() ?? defaultSizeSystem(regionFor(country?.code)),
  [country?.code],
);
```

`system` is captured once when the modal first mounts (as part of the order page) and only refreshes if `country?.code` changes. If a non-US shopper lands first → modal mounts with `system = "eu"` → they later switch to **M US** in the shoe step → `SizeTileGrid.writeStoredSystem` updates localStorage but never broadcasts → the modal still renders **EU** on open.

## Fix

### 1. `src/components/order/SizeTileGrid.tsx` — broadcast changes
Dispatch a custom event whenever the user picks a system so other components in the same tab can react:

```tsx
export const SIZE_SYSTEM_CHANGE_EVENT = "vitalwalk:size-system-change";

function writeStoredSystem(s: SizeSystem) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, s);
    window.dispatchEvent(new CustomEvent(SIZE_SYSTEM_CHANGE_EVENT, { detail: s }));
  } catch { /* noop */ }
}
```

### 2. `src/components/order/InsoleUpsellModal.tsx` — make `system` reactive
Replace the frozen `useMemo` with state that:
- Re-reads localStorage every time the modal opens.
- Subscribes to the broadcast event (and cross-tab `storage` events).
- Falls back to the geo default only when nothing is stored.

```tsx
const [system, setSystem] = useState<SizeSystem>(
  () => readStoredSystem() ?? defaultSizeSystem(regionFor(country?.code)),
);

useEffect(() => {
  if (open) {
    setSystem(readStoredSystem() ?? defaultSizeSystem(regionFor(country?.code)));
  }
}, [open, country?.code]);

useEffect(() => {
  const refresh = () =>
    setSystem(readStoredSystem() ?? defaultSizeSystem(regionFor(country?.code)));
  window.addEventListener(SIZE_SYSTEM_CHANGE_EVENT, refresh);
  window.addEventListener("storage", refresh);
  return () => {
    window.removeEventListener(SIZE_SYSTEM_CHANGE_EVENT, refresh);
    window.removeEventListener("storage", refresh);
  };
}, [country?.code]);
```

This guarantees the modal's header label, per-pair size text, and the expanded size grid all render in whatever system the customer is actively using on the shoe step — every time, regardless of geo or load order.

## Triple-check QA pass (after the fix)

Walked end-to-end on both an EU geo and a US geo, mobile + desktop:

**Size system sync**
- Switch through W US → M US → UK → EU on the shoe step.
- Open the upsell modal each time and confirm:
  - Header reads the matching system label (e.g. "Insole sizes · Men's US").
  - Per-pair tile shows the size in that system (e.g. `10` for M US, not `42.5` or `7.5`).
  - Expanded grid lists sizes in that system, sorted ascending (5, 5.5, 6, …).
- The Shopify variant actually selected stays correct regardless of display system (matching is on the underlying variant, labels are purely cosmetic).

**Currency parity (full funnel)**
- Order page shoe price, savings hero, sticky checkout bar, upsell modal unit price + compare-at + "You save …" line + CTA total, and the final Shopify checkout total all match in the detected currency (USD on this preview, plus a spot-check on EUR and GBP).

**Checkout integrity**
- Cart is created via Storefront API `cartCreate` (no manual permalinks).
- Generated checkout URL carries `channel=online_store`.
- Opens in a new tab via `window.open(url, '_blank')`.
- Final Shopify total = shoes + insoles (when accepted), shoes only (when declined).

**Modal mechanics**
- Hero video autoplays muted/looped on open.
- Decline link is delayed until `armed` (no accidental dismissal).
- Selected variant persists when switching size system mid-flow.
- ESC / outside-click are blocked until `armed`.

## Files touched

- `src/components/order/SizeTileGrid.tsx` — broadcast custom event on system change.
- `src/components/order/InsoleUpsellModal.tsx` — reactive `system` state + listeners.

No schema changes, no new dependencies.
