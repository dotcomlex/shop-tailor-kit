## Issue

On mobile, after the yellow "Select Your Color and Size" CTA there's a large empty white strip before the small "© 2026 VitalWalk" footer line. It makes the page look unfinished.

## Cause

Two stacked paddings produce the gap on Step 1:
- Main content has `pb-6` (24px bottom padding)
- The body background below the page extends because the page is shorter than the viewport on tall phones (iPhone 14 Pro Max etc.)
- Footer adds another `py-4` (16px top + 16px bottom)

Combined with the fact that Step 1 is short content on a tall phone, the page doesn't fill the screen and the white footer area looks like dead space.

## Fix

**1. Tighten bottom spacing on Step 1 (mobile only)**
- Reduce main `pb-6` → `pb-3` on mobile (desktop unchanged).
- Reduce footer `py-4` → `py-3` on mobile (desktop unchanged).

**2. Make the page always fill the viewport**
- Add `min-h-screen` + flex column to the outer wrapper so the footer sits at the bottom of the screen on tall phones, eliminating the awkward floating gap. Main grows to fill remaining space.

**3. Match the page background through the empty area**
- The dead space currently shows the white footer background. Switching to `min-h-screen` keeps the soft gray page bg consistent until the footer sits flush at the bottom.

## File

- `src/components/order/OrderPage.tsx` — wrap with `min-h-screen flex flex-col`, set main to `flex-1`, reduce mobile bottom padding on main and footer.

## Result

On phones, Step 1 fills the screen cleanly: bundle cards, yellow CTA, then the footer sits right below — no awkward white strip. Steps 2 and 3 are unaffected (they're already long enough to fill the screen, and Step 3 keeps its `pb-32` to clear the sticky checkout bar). Desktop is unchanged.