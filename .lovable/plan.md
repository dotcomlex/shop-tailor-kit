## Goal

Show size info that's accurate for **everyone** (US Men, US Women, UK, EU) but stays compact and skimmable inside the small size tiles.

## Two changes in `SocksUpsellModal.tsx`

### 1. Replace single-line `SIZE_HINTS` with a 2-line structured object

```ts
const SIZE_HINTS: Record<SocksSizeBucket, { line1: string; line2: string }> = {
  "S/M":  { line1: "US M 5–7.5 · W 5.5–8", line2: "UK 4–6.5 · EU 37–40" },
  "L/XL": { line1: "US M 8–14 · W 8–15",   line2: "UK 7–13 · EU 41–47" },
};
```

Source: Armadilo product spec (US M / US W / UK confirmed); EU bands derived from standard conversion (US M 5 ≈ EU 37, US M 8 ≈ EU 41, US M 14 ≈ EU 47).

### 2. Render two tiny lines under the bucket label

In the size button (around line 324–335), replace the single `<span>` showing `{SIZE_HINTS[b]}` with a two-line stack:

```tsx
<span className="text-[10px] font-semibold leading-tight ...">
  {SIZE_HINTS[b].line1}
</span>
<span className="text-[10px] font-medium leading-tight opacity-80 ...">
  {SIZE_HINTS[b].line2}
</span>
```

- Both lines `text-[10px]`, `leading-tight` (≈12px line-height) so the tile grows by ~12px total
- Selected state: white at 80% / 65% opacity for hierarchy
- Unselected: `text-[hsl(var(--text-mute))]` for both, second line at 75% opacity

### 3. Update the caption next to the "Size" label

Change `Men's US` → `US · UK · EU` so the header advertises that all systems are shown.

## Visual result (390px mobile)

```
┌─────────────────────┐  ┌─────────────────────┐
│ S/M                 │  │ L/XL                │
│ US M 5–7.5 · W 5.5–8│  │ US M 8–14 · W 8–15  │
│ UK 4–6.5 · EU 37–40 │  │ UK 7–13 · EU 41–47  │
└─────────────────────┘  └─────────────────────┘
```

Each tile fits in the 170px-half column at 390px viewport; the longest line is ~22 chars at 10px → ~110px wide, well within bounds.

## Files

- `src/components/order/SocksUpsellModal.tsx` — `SIZE_HINTS` shape change + size button JSX (~10 lines) + one caption swap

Nothing else moves. `socksBucketFromShoeSize` / `pickSocksVariant` still use the same "S/M" | "L/XL" keys.
