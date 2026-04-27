# Fix iOS auto-zoom on Alyssa chat input

## The bug
On iPhone, tapping the message textarea in the Alyssa chat causes Safari to auto-zoom into the field. The page stays zoomed in, forcing the user to manually pinch out before they can reach the Send button.

## Root cause
iOS Safari auto-zooms into any form field whose font-size is **less than 16px**. The composer textarea is currently set to `text-[15px]`, which trips this behavior. The viewport meta tag in `index.html` is correctly left unlocked (locking it would hurt accessibility), so the fix belongs on the input itself.

## The fix
One small change in `src/components/support/AlyssaChat.tsx`:

- Change the textarea class from `text-[15px]` to `text-[16px]` (the iOS no-zoom threshold).
- Visually identical at a glance, no layout shift, no other side effects.

That's it. No changes to the edge function, prompt, or anything else.

## Files touched
- `src/components/support/AlyssaChat.tsx` — composer textarea font-size only
