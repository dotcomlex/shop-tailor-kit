import { Truck } from "lucide-react";

/**
 * Slim full-width red scrolling band — single message ("Free shipping today
 * only") repeated with sparkle separators. Sits at the very top of the page
 * above SiteHeader as the first thing the eye lands on.
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
      className="relative overflow-hidden border-b border-[hsl(0_72%_42%/0.18)] bg-[hsl(0_85%_96%)] py-1.5"
      aria-label="Free shipping today only"
    >
      <div
        className="flex w-max animate-[marquee_24s_linear_infinite] whitespace-nowrap text-[11.5px] font-extrabold uppercase tracking-wider text-[hsl(0_72%_42%)] motion-reduce:animate-none"
        aria-hidden
      >
        {item}<span className="text-[hsl(0_72%_42%/0.45)]">✦</span>
        {item}<span className="text-[hsl(0_72%_42%/0.45)]">✦</span>
        {item}<span className="text-[hsl(0_72%_42%/0.45)]">✦</span>
        {item}<span className="text-[hsl(0_72%_42%/0.45)]">✦</span>
        {item}<span className="text-[hsl(0_72%_42%/0.45)]">✦</span>
        {item}<span className="text-[hsl(0_72%_42%/0.45)]">✦</span>
      </div>
    </div>
  );
}
