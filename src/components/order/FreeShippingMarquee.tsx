import { Truck } from "lucide-react";

/**
 * Slim full-width red scrolling band — strong red background with white icon
 * + white text for maximum visibility. Single message ("Free shipping today
 * only") repeated with sparkle separators. Sits at the very top of the page
 * above SiteHeader as the first thing the eye lands on.
 */
export function FreeShippingMarquee() {
  const item = (
    <span className="mx-6 inline-flex items-center gap-1.5">
      <Truck className="h-3.5 w-3.5 text-white" strokeWidth={2.5} aria-hidden />
      FREE SHIPPING — SALE ENDS AT MIDNIGHT
    </span>
  );

  return (
    <div
      className="relative overflow-hidden bg-black py-1.5"
      aria-label="Free shipping today only"
    >
      <div
        className="flex w-max animate-[marquee_24s_linear_infinite] whitespace-nowrap text-[11.5px] font-extrabold uppercase tracking-wider text-white motion-reduce:animate-none"
        aria-hidden
      >
        {item}<span className="text-white/60">✦</span>
        {item}<span className="text-white/60">✦</span>
        {item}<span className="text-white/60">✦</span>
        {item}<span className="text-white/60">✦</span>
        {item}<span className="text-white/60">✦</span>
        {item}<span className="text-white/60">✦</span>
      </div>
    </div>
  );
}
