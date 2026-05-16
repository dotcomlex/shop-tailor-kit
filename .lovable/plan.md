# Swatch layout: 2 × 2 on mobile

Change `ColorSizeStep.tsx` color grid from `grid-cols-3 sm:grid-cols-4` to `grid-cols-2 sm:grid-cols-4`. Keep swatches at the current 108px/132px size. Result on mobile: 2 large swatches per row, 2 rows total — Black no longer orphaned. Desktop unchanged (single row of 4).

Update the empty/loading state colspan from `col-span-3 sm:col-span-4` to `col-span-2 sm:col-span-4`.

Single file, single edit.
