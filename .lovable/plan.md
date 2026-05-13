## Plan

1. **Stabilize the socks modal image gallery**
   - Keep a single, consistent carousel/gallery list instead of rebuilding it after color selection.
   - Preserve all intended images in the thumbnail strip and main gallery at all times.
   - Make the modal always open on the first lifestyle image.
   - When the shopper picks White or Black, only switch the active main image to that color’s variant image automatically; do not add/remove gallery items or create a separate variant-only state.

2. **Rebalance the right-side header block on mobile**
   - Adjust the title/price area so it fills the current white space more naturally.
   - Add a bit more top breathing room above the product title.
   - Increase the visual weight of the current price and compare-at price and position the price block slightly lower so the right column feels vertically centered next to the image.
   - Keep the result clean and sales-focused without adding extra filler content.

3. **Validate the upsell flow on mobile**
   - Check that the socks modal opens with the lifestyle image first.
   - Verify that selecting a color switches the hero image normally while keeping the rest of the carousel visible.
   - Verify the modal still accepts/declines correctly and does not disturb the rest of the checkout funnel.

## Technical details

- The current issue comes from the gallery array being conditionally rebuilt based on `colorTouched`, which changes the carousel contents after selection.
- I’ll replace that with a stable gallery model and separate the concept of:
  - **default opening image** = first lifestyle image
  - **selected color image** = active hero target after color selection
- Layout changes will stay inside `SocksUpsellModal.tsx` and remain frontend-only.