## Goal
Make the recent-purchase toasts feel more alive by showing the first one sooner and shortening the gap between toasts — without crossing into spammy territory.

## Change

**Edit** `src/components/order/RecentPurchaseToasts.tsx` — adjust the timing constants only. No UI, no logic changes.

| Constant | Current | New |
|---|---|---|
| `FIRST_DELAY_MIN` | 25s | **8s** |
| `FIRST_DELAY_MAX` | 40s | **15s** |
| `NEXT_DELAY_MIN` | 50s | **22s** |
| `NEXT_DELAY_MAX` | 95s | **40s** |
| `VISIBLE_MS` | 6s | **5.5s** (slightly snappier) |
| `MAX_PER_SESSION` | 4 | **5** (one extra, since they cycle faster) |

## Result
- First toast: ~8–15s after page load (was 25–40s).
- Following toasts: every ~22–40s (was 50–95s).
- Still capped per session, still dismissible, still hidden on Step 3, still geo-aware to US/UK/AU/CA only.

## What I will NOT change
- Pool content, copy, icons, placement, animation
- Geo gating
- Dismiss / sessionStorage behavior
- Step 3 pause

If after testing it still feels slow (or now too fast), we can dial these numbers again — they're the only knobs that need to move.