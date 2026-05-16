import { Truck } from "lucide-react";

/**
 * Slim full-width scrolling band — single message ("Free shipping today only")
 * hammered home. Sits directly under the GlobalUrgencyBar so all top-of-page
 * urgency messaging reads as one cohesive strip.
 */
export function FreeShippingMarquee() {
  const item = (
    <span className="mx-6 inline-flex items-center gap-1.5">
      <Truck className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
      FREE SHIPPING — TODAY ONLY
    </span>
  );

  return (
    <div
      className="relative overflow-hidden border-b border-[hsl(var(--verified-green)/0.15)] bg-[hsl(var(--verified-green)/0.08)] py-1.5"
      aria-label="Free shipping today only"
    >
      <div
        className="flex w-max animate-[marquee_24s_linear_infinite] whitespace-nowrap text-[11.5px] font-extrabold uppercase tracking-wider text-verified motion-reduce:animate-none"
        aria-hidden
      >
        {item}<span className="text-verified/40">✦</span>
        {item}<span className="text-verified/40">✦</span>
        {item}<span className="text-verified/40">✦</span>
        {item}<span className="text-verified/40">✦</span>
        {item}<span className="text-verified/40">✦</span>
        {item}<span className="text-verified/40">✦</span>
      </div>
    </div>
  );
}
