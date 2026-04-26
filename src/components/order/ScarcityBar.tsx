import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

const FULL_DAY = 24 * 60 * 60 * 1000;
const STORAGE_KEY = "vitalwalk_offer_deadline";

function getDeadline(): number {
  if (typeof window === "undefined") return Date.now() + FULL_DAY;
  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) {
    const ts = parseInt(existing, 10);
    if (!isNaN(ts) && ts > Date.now()) return ts;
  }
  const fresh = Date.now() + FULL_DAY;
  window.localStorage.setItem(STORAGE_KEY, String(fresh));
  return fresh;
}

function fmt(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600).toString().padStart(2, "0");
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

export function ScarcityBar() {
  const [remaining, setRemaining] = useState<number>(() => Math.max(0, getDeadline() - Date.now()));

  useEffect(() => {
    const id = setInterval(() => {
      const r = getDeadline() - Date.now();
      if (r <= 0) {
        // Reset for next 24h cycle so the page never shows 0
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, String(Date.now() + FULL_DAY));
        }
        setRemaining(FULL_DAY);
      } else {
        setRemaining(r);
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex items-center justify-center gap-2 rounded-lg border border-dashed bg-[hsl(0_100%_97%)] px-4 py-2.5 text-center text-[13px] sm:text-[14px]"
      style={{ borderColor: "hsl(var(--save-red))" }}
    >
      <Flame className="h-4 w-4 text-save" strokeWidth={2.5} />
      <span className="font-bold text-[hsl(var(--text-strong))]">First-time buyer offer expires in</span>
      <span className="font-extrabold tabular-nums text-save" aria-live="polite">
        {fmt(remaining)}
      </span>
    </div>
  );
}
