import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

const OFFER_WINDOW = 10 * 60 * 1000;
const STORAGE_KEY = "vitalwalk_offer_deadline_v2";

function getDeadline(): number {
  if (typeof window === "undefined") return Date.now() + OFFER_WINDOW;
  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) {
    const ts = parseInt(existing, 10);
    if (!isNaN(ts) && ts > Date.now()) return ts;
  }
  const fresh = Date.now() + OFFER_WINDOW;
  window.localStorage.setItem(STORAGE_KEY, String(fresh));
  return fresh;
}

function fmt(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

/**
 * Slim global page-top urgency bar. Shares the deadline key with
 * ScarcityBar so both timers tick identically.
 */
export function GlobalUrgencyBar() {
  const [remaining, setRemaining] = useState<number>(() =>
    Math.max(0, getDeadline() - Date.now()),
  );

  useEffect(() => {
    const id = setInterval(() => {
      const r = getDeadline() - Date.now();
      if (r <= 0) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, String(Date.now() + OFFER_WINDOW));
        }
        setRemaining(OFFER_WINDOW);
      } else {
        setRemaining(r);
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full bg-[hsl(0_72%_42%)] text-white">
      <div className="container-edge flex items-center justify-center gap-2 py-1.5 text-center text-[12px] sm:text-[13px]">
        <Flame className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
        <span className="font-semibold uppercase tracking-wide">
          Flash sale ends in
        </span>
        <span
          className="font-extrabold tabular-nums"
          aria-live="polite"
        >
          {fmt(remaining)}
        </span>
        <span className="hidden text-white/70 sm:inline" aria-hidden>
          ·
        </span>
        <span className="hidden font-semibold sm:inline">
          Free shipping today
        </span>
      </div>
    </div>
  );
}
