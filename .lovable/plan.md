# Priority upsell — stable layout, subtle toggle

## Problem
The "Added · Remove ×" pill is much wider than "Add", which squeezes the title onto two lines and breaks the `+$4.95` price alignment when the user toggles the card.

## Fix — `PriorityUpsellCard.tsx`
Replace the changing-width text pill with a **fixed-size circular checkbox** on the right:

- Unselected: 24px white circle with thin slate border, no fill.
- Selected: 24px circle filled with `verified` green + white check icon.
- Same width either state → title stays on one line, price stays glued to the right edge.
- The entire card is still the toggle (`onToggle(!selected)`); aria-label still announces "Add"/"Remove Priority Processing".

Add a small `Added` micro-label that fades in **under** the description when selected — keeps confirmation visible without bloating the right side:

```
[⚡]  Priority Processing                          +$4.95   (○)
     Skip the line — your order ships first ⚡
     ✓ Added                                              (green)
```

When unselected, the third line is absent → card height collapses, no awkward space.

No layout, color, or border changes elsewhere. No props change.

## Files
- `src/components/order/PriorityUpsellCard.tsx`
