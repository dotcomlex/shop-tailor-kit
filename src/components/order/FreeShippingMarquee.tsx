import { Truck } from "lucide-react";

/**
 * Slim full-width red scrolling band — strong red background with white icon
 * + white text for maximum visibility. Single message ("Free shipping today
 * only") repeated with sparkle separators. Sits at the very top of the page
 * above SiteHeader as the first thing the eye lands on.
 */
export function FreeShippingMarquee() {
  const item = (
    <span className="mx-10 inline-flex items-center gap-2">
      <Truck className="h-3.5 w-3.5 text-white" strokeWidth={2.5} aria-hidden />
      Free shipping on all orders! — Sale Ends at midnight
    </span>
  );

  return (
    <div
      className="relative overflow-hidden bg-black py-2"
      aria-label="Free shipping on all orders. Sale ends at midnight."
    >
      <div
        className="flex w-max animate-[marquee_30s_linear_infinite] whitespace-nowrap text-[12px] font-semibold tracking-wide text-white motion-reduce:animate-none"
        aria-hidden
      >
        {item}
        {item}
        {item}
      </div>
    </div>
  );
}
