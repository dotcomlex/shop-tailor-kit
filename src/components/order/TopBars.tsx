import { useEffect, useMemo, useState } from "react";
import { Truck } from "lucide-react";

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
    <div className="border-b border-[hsl(var(--hairline))] bg-[hsl(var(--soft-gray-bar))]">
      {/* Delivery estimate strip */}
      <div className="container-order flex flex-col items-center gap-1 py-2 text-center text-[12px] text-[hsl(var(--text-body))] sm:flex-row sm:justify-between sm:text-left">
        <div className="inline-flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5 text-verified" strokeWidth={2.5} />
          <span className="font-semibold uppercase tracking-wide text-[hsl(var(--text-mute))]">
            Estimated Delivery
          </span>
        </div>
        <div>
          Order Today{" "}
          <span className="font-bold text-[hsl(var(--text-strong))]">{todayLabel}</span>
          {" — "}
          Get it by{" "}
          <span className="font-bold text-[hsl(var(--text-strong))]">{deliveryRange}</span>
        </div>
      </div>

      {/* Countdown box */}
      <div className="container-order pb-3 pt-1">
        <div
          className="rounded-md border border-dashed bg-order-blue-soft px-4 py-2.5 text-center text-[13px] sm:text-[14px]"
          style={{ borderColor: "hsl(var(--order-blue))" }}
        >
          <span className="font-bold text-[hsl(var(--text-strong))]">
            First-time Buyer Offer Ends in 24 hours!
          </span>{" "}
          <span className="text-[hsl(var(--text-body))]">Time left:</span>{" "}
          <span
            className="font-extrabold tabular-nums text-save"
            aria-live="polite"
          >
            {formatHMS(seconds)}
          </span>
          .
        </div>
      </div>
    </div>
  );
}
