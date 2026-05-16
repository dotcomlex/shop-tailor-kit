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
 * Slim Step 1 urgency strip — shares the same deadline key as ScarcityBar
 * so both timers stay in sync. Wording differs ("Sale ends" vs.
 * "Reserved for you") so they read as distinct moments in the funnel.
 */
export function Step1UrgencyStrip() {
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
    <div className="flex items-center justify-center gap-1.5 rounded-md bg-[hsl(0_85%_97%)] px-3 py-1.5 text-center text-[12px] sm:text-[12.5px]">
      <Flame className="h-3.5 w-3.5 text-save" strokeWidth={2.5} aria-hidden />
      <span className="font-semibold text-[hsl(var(--text-body))]">
        Sale ends in
      </span>
      <span className="font-extrabold tabular-nums text-save" aria-live="polite">
        {fmt(remaining)}
      </span>
    </div>
  );
}
