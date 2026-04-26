
# Fix: Sticky CTA bar is hiding the last FAQs

## What's broken
Looking at your screenshot, the sticky "Complete Order" bar is **floating over the bottom of the FAQ block**, covering the last two questions ("How fast will my order arrive?" and "What if they don't fit…"). There's no way to scroll past them — the page ends right behind the bar, so the bottom ~90px of content is permanently obscured.

The cause: `StickyCheckoutBar` is `position: fixed` (taken out of normal flow), but nothing in `UpgradeStep.tsx` reserves equivalent space at the bottom of the page. The page thinks it ends at the last FAQ — but the bar sits on top of it.

## The fix — minimal, surgical

### 1. Reserve bottom space when the sticky bar is mounted
In `src/components/order/UpgradeStep.tsx`, add a bottom spacer to the section so content can scroll fully clear of the sticky bar on mobile only (the bar is `md:hidden`).

The bar is ~76px tall (52px button + 12px×2 padding) plus iOS safe-area inset. We'll reserve `pb-28` (~112px) on mobile, which gives a comfortable ~30px gap between the last FAQ and the top of the bar — feels intentional, not cramped.

Change on the root `<section>`:
```tsx
<section
  aria-labelledby="step-3-heading"
  className="animate-fade-in pb-28 md:pb-0"
>
```

That's it. One className. The `md:pb-0` ensures desktop (where the sticky bar is hidden) doesn't get unnecessary blank space.

### 2. Also account for iOS safe-area
The sticky bar already uses `paddingBottom: env(safe-area-inset-bottom)` internally, but the spacer above doesn't. On iPhones with a home indicator, we want the spacer to grow to match. Use an inline style on the section:

```tsx
<section
  aria-labelledby="step-3-heading"
  className="animate-fade-in pb-28 md:pb-0"
  style={{ paddingBottom: "calc(7rem + env(safe-area-inset-bottom))" }}
>
```

(The Tailwind `pb-28` becomes a fallback for the `md:` breakpoint where we override back to `0`. We'll use a small responsive style trick — or just keep it simple with a media-query-aware inline calc. Cleanest: keep `pb-28 md:pb-0` and let the bar's own safe-area padding handle the inset — 112px is already generous enough that the home indicator won't visually clash.)

**Decision:** go with the simple `pb-28 md:pb-0` — no inline style needed. 112px clears the bar (76px) + the home indicator (~34px) on every iPhone with room to spare.

## Why this is the right fix (and not the alternatives)

- ❌ **Don't** make the sticky bar shorter — it was just redesigned to be premium and tap-friendly. Shrinking it undoes that work.
- ❌ **Don't** hide the bar when the user reaches the bottom — that creates a janky disappear/reappear loop and removes the CTA exactly when commitment is highest.
- ❌ **Don't** add `mb-28` to `FaqBlock` — that only fixes Step 3, but the same pattern is needed page-wide. Putting it on the `<section>` of `UpgradeStep` is the correct scope (the sticky bar only mounts on Step 3 anyway).
- ✅ **Do** reserve bottom padding on the step that owns the sticky bar — single source of truth, scoped correctly, one-line change.

## Files

| File | Change |
|---|---|
| `src/components/order/UpgradeStep.tsx` | Add `pb-28 md:pb-0` to the root `<section>` className so the last FAQs are scroll-reachable above the sticky bar. |

No other files affected. No new dependencies. Pure layout fix.
