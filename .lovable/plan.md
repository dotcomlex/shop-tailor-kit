# Priority upsell — clearer title + tighter price

## `PriorityUpsellCard.tsx`

**Title copy:** "Priority Processing" → "Add Priority Processing?"  
Makes the action explicit for older customers.

**Price layout:** Stop using `justify-between` in the title row — it pushes `+$4.95` all the way to the far edge of the text block (next to the checkbox), which looks disconnected. Instead, place the price **inline right after the title** with a small gap:

```
[⚡]  Add Priority Processing?  +$4.95              (○)
     Skip the line — your order ships first ⚡
     ✓ Added                                          (when on)
```

Implementation:
- Wrap title + price in a single `<span className="inline-flex flex-wrap items-baseline gap-x-2">`.
- Price styling unchanged (`text-[13px] font-bold tabular-nums`), but maybe drop one shade so it reads as secondary to the title.
- Drops the `justify-between` from the inner header row.

No other changes. Same file.
