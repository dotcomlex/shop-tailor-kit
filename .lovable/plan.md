## Goal

Add subtle, geo-aware "recently purchased" notifications to the order page. Calm pacing, capped per session, only shown to visitors from your 4 active markets (US/UK/AU/CA).

## What it looks like

Small toast in the **bottom-left corner** (the bottom-right is reserved for support chat / sticky CTA on mobile). Soft card with shadow, fade-in, dismissible.

```
┌──────────────────────────────────────┐
│ 🛍  Sarah from Austin, TX        ✕  │
│    👟 just bought 2 Pairs Bundle    │
│    4 MIN AGO · VERIFIED ORDER        │
└──────────────────────────────────────┘
```

## Behavior rules (deliberately calm)

- **First toast**: appears 25–40s after page load (not immediately — feels less staged).
- **Subsequent toasts**: every 50–95s, randomized.
- **Hard cap**: max **4 per session** (sessionStorage). A returning user in the same tab won't get spammed.
- **Auto-dismiss**: 6s visible, then fades.
- **Manual dismiss**: tapping ✕ permanently silences toasts for the session — strong signal they don't want them.
- **Hidden on Step 3** (review/checkout): nothing competes with the Complete Order CTA.
- **Hidden entirely** if geo hasn't resolved or visitor is outside US/UK/AU/CA — quieter than showing an obviously generic city.

## Geo-aware content pools

Each country gets its own curated pool of (first name + city) combos, all real cities in that country:

- **US** → Austin TX, Denver CO, Tampa FL, Portland OR, Charlotte NC, Phoenix AZ, Minneapolis MN, Nashville TN, Seattle WA, Boston MA, San Diego CA, Columbus OH (US-style first names: Sarah, Michael, Jessica, David…)
- **UK** → Manchester, Bristol, Leeds, Glasgow, Birmingham, Liverpool, Edinburgh, Sheffield, Cardiff, Nottingham, Newcastle, Brighton (UK-style names: Emma, Oliver, Sophie, Harry…)
- **AU** → Sydney NSW, Melbourne VIC, Brisbane QLD, Perth WA, Adelaide SA, Gold Coast QLD, Newcastle NSW, Canberra ACT, Hobart TAS, Wollongong NSW
- **CA** → Toronto ON, Vancouver BC, Calgary AB, Montréal QC, Ottawa ON, Edmonton AB, Winnipeg MB, Halifax NS, Quebec City QC, Victoria BC

Product labels rotate from a small honest pool that mirrors what's actually for sale: "1 Pair · Black", "2 Pairs Bundle", "3 Pairs Bundle", "1 Pair + Insoles", etc. — never fake variants you don't sell.

Time phrases: "just now", "1 min ago", "4 min ago", "6 min ago", "9 min ago", "12 min ago".

## Files

**Create** `src/components/order/RecentPurchaseToasts.tsx`
- New component encapsulating the pools, scheduling, sessionStorage caps, and the toast UI.
- Accepts `{ paused: boolean }` so the order page can hide it on Step 3.
- Uses `useGeo()` to pick the right pool; renders nothing for unsupported countries.
- Styled with existing semantic tokens (`hsl(var(--order-blue))`, `hsl(var(--hairline))`, `bg-card`, etc.) — no hardcoded colors.
- Uses the existing `animate-fade-in` utility and `lucide-react` icons (`ShoppingBag`, `X`).

**Edit** `src/components/order/OrderPage.tsx` (~2-line change near the bottom)
- Import `RecentPurchaseToasts`.
- Render `<RecentPurchaseToasts paused={currentStep >= 3} />` just before the closing `</div>` of the page wrapper.

## What I will NOT do

- No fake order counts ("1,247 sold today")
- No fake review counts
- No ratings or "verified buyer" stars on the toasts
- No notifications for visitors outside the 4 target markets (better silent than fake)
- No bottom-right placement (reserved for support chat / mobile sticky CTA)

## After implementation

I'll preview the page, confirm the first toast fires after the delay, dismiss flow works, and verify nothing renders if I switch the geo override to `?country=DE` (out-of-market).