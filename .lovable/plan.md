## Problem

On a real phone (Step 1), the page can be scrolled up/down even though there's nothing more to see. This doesn't show in the desktop preview because the issue is caused by mobile browser chrome (Safari/Chrome address bar).

## Root cause

In `OrderPage.tsx` we use:

```
<div className="flex min-h-screen flex-col …">
  …
  <main className="flex-1 …">
```

`min-h-screen` resolves to `min-height: 100vh`. On iOS Safari & Android Chrome, `100vh` equals the viewport **with the address bar hidden** — i.e. it's *taller than what you can actually see* when the bar is visible. The `flex-1` `<main>` then stretches to fill that oversized height, which makes the page scrollable by exactly the height of the browser toolbar even when content fits.

This is why scroll appears on a phone but not in the in-app preview (which uses a fixed-size iframe with no dynamic browser chrome).

## Fix

Switch from `100vh` to the dynamic viewport unit `100dvh`, which always equals the *currently visible* viewport (it shrinks/grows as the address bar shows/hides). When content is short, the page fills exactly the visible area and there is nothing to scroll. When content is tall (Steps 2/3), normal scrolling still works as expected.

### File: `src/components/order/OrderPage.tsx`

- Replace the wrapper class `flex min-h-screen flex-col` with `flex min-h-[100dvh] flex-col`.
- No other changes. Footer placement, step transitions, sticky checkout bar, and currency logic all stay intact.

### Why this is safe

- `100dvh` is supported on all iOS 15.4+ / Android Chrome 108+ browsers (essentially every device that will see the ad).
- Older browsers fall back to ignoring the value; the `<main>` keeps its natural height, which is the same behavior the page had before we introduced `min-h-screen`. No regression.
- No JS, no resize listeners, no layout shift on toolbar show/hide — purely a CSS swap.

## What stays the same

- Currency converter, geo detection, Shopify checkout, Facebook pixel events — all untouched.
- Edge-to-edge mobile headers from the previous change — untouched.
- Footer-pinned-to-bottom behavior on tall screens — preserved (now even more accurate).

## Out of scope

No content changes, no spacing changes, no new components. Single one-line class swap.
