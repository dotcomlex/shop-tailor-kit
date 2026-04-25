import { useEffect, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";

const FULL_DAY = 24 * 60 * 60;

function formatHMS(total: number) {
  const t = Math.max(0, total);
  const h = Math.floor(t / 3600).toString().padStart(2, "0");
  const m = Math.floor((t % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

const DATE_FMT = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" });

export function TopBars() {
  const [seconds, setSeconds] = useState(FULL_DAY);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s <= 1 ? FULL_DAY : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const { todayLabel, deliveryRange } = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 8);
    const end = new Date(today);
    end.setDate(today.getDate() + 12);
    return {
      todayLabel: DATE_FMT.format(today),
      deliveryRange: `${DATE_FMT.format(start)} - ${DATE_FMT.format(end)}`,
    };
  }, []);

  return (
    <div className="border-b border-border bg-[hsl(var(--soft-gray-bar))]">
      {/* Delivery estimate strip */}
      <div className="container-order flex flex-col gap-1 py-2 text-[12px] text-[hsl(var(--text-mute))] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
          <span className="font-medium">Estimated Delivery</span>
        </div>
        <div>
          Order Today{" "}
          <span className="font-semibold text-[hsl(var(--text-strong))]">{todayLabel}</span>
          {" — "}
          Get It By{" "}
          <span className="font-semibold text-[hsl(var(--text-strong))]">{deliveryRange}</span>
        </div>
      </div>

      {/* Countdown box */}
      <div className="container-order pb-3 pt-2">
        <div
          className="rounded-md border border-dashed bg-order-blue-soft px-4 py-2.5 text-center text-[14px] text-[hsl(var(--text-strong))]"
          style={{ borderColor: "hsl(var(--order-blue))" }}
        >
          <span className="font-semibold">First-time Buyer Offer Ends in 24 hours!</span>{" "}
          Time left:{" "}
          <span className="font-bold text-save" aria-live="polite">
            {formatHMS(seconds)}
          </span>
          .
        </div>
      </div>
    </div>
  );
}
