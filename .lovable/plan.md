## Fix: Sticky checkout bar appears too early

Right now the mobile sticky CTA pops in the moment the main "Complete My Order" button scrolls off screen — which happens immediately as the user starts reading reviews/FAQs. You want it to stay hidden through that content and only slide up once they've actually scrolled near the bottom.

## Change

**`src/components/order/StickyCheckoutBar.tsx`**

Flip the visibility model:

- Remove the `observeRef` (main CTA) trigger — it's what's causing the early appearance.
- Use a single `showAtRef` sentinel. The bar becomes visible only once that sentinel enters the viewport.
- Keep the page actually scrollable past it — the bar stays visible from that point down to the true end of the page.

```ts
// New logic
const visible = nearBottom;
```

**`src/components/order/UpgradeStep.tsx`**

- Add a new `showAtRef` placed right before the FAQ block's last item (or just after the FAQ block, before payment badges section ends). This is the "user has consumed the page" marker.
- Pass `showAtRef` to `StickyCheckoutBar` instead of `observeRef`.
- Drop the `ctaWrapperRef` observation entirely.

Concretely, place the sentinel just after `<FaqBlock />`:

```tsx
<FaqBlock />
<div ref={showAtRef} aria-hidden className="h-px w-full" />
```

So the sticky bar appears once the user reaches the end of the FAQs — exactly the moment they're "done scrolling" and likely ready to checkout — and remains until they scroll back up.

## Result

- Sticky bar stays hidden through reviews + FAQs (no more premature flash).
- Slides in cleanly near the bottom of the page as a final nudge.
- No layout/whitespace changes; purely a trigger swap.