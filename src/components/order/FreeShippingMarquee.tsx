import { Truck, ShieldCheck, Clock } from "lucide-react";

/**
 * Single scrolling banner replacing the repeated per-card "FREE SHIPPING"
 * pills. Adds urgency ("today only") without cluttering the bundle cards.
 *
 * Pure CSS keyframes (defined in index.css as `marquee`). Pauses under
 * `prefers-reduced-motion`.
 */
export function FreeShippingMarquee() {
  const items = (
    <>
      <span className="mx-5 inline-flex items-center gap-1.5">
        <Truck className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
        FREE SHIPPING — TODAY ONLY
      </span>
      <span className="text-verified/40" aria-hidden>✦</span>
      <span className="mx-5 inline-flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
        60-DAY MONEY-BACK GUARANTEE
      </span>
      <span className="text-verified/40" aria-hidden>✦</span>
      <span className="mx-5 inline-flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
        SHIPS IN 24H
      </span>
      <span className="text-verified/40" aria-hidden>✦</span>
    </>
  );

  return (
    <div
      className="relative overflow-hidden border-y border-[hsl(var(--verified-green)/0.15)] bg-[hsl(var(--verified-green)/0.08)] py-1.5"
      aria-label="Free shipping today only, 60-day money-back guarantee, ships in 24 hours"
    >
      <div
        className="flex w-max animate-[marquee_28s_linear_infinite] whitespace-nowrap text-[11.5px] font-extrabold uppercase tracking-wider text-verified motion-reduce:animate-none"
        aria-hidden
      >
        {items}
        {items}
      </div>
    </div>
  );
}
