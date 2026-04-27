import { useEffect, useState, type RefObject } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency";

interface StickyCheckoutBarProps {
  total: number;
  /** Strike-through retail price shown above the live total. */
  comparePrice?: number;
  onCheckout: () => void;
  isCheckingOut: boolean;
  /** Ref to the main "Complete My Order" CTA — bar shows only when this is off-screen. */
  observeRef: RefObject<HTMLElement | null>;
}

export function StickyCheckoutBar({
  total,
  comparePrice,
  onCheckout,
  isCheckingOut,
  observeRef,
}: StickyCheckoutBarProps) {
  const { format } = useCurrency();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = observeRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px 0px -20px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [observeRef]);

  const showCompare = typeof comparePrice === "number" && comparePrice > total;

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 md:hidden transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "translate-y-full pointer-events-none",
      )}
    >
      {/* Soft fade-in gradient above the bar so content scrolls into it gracefully */}
      <div
        aria-hidden
        className="pointer-events-none h-4 w-full bg-gradient-to-t from-background to-transparent"
      />
      <div
        className="border-t border-[hsl(var(--hairline))] bg-background/95 backdrop-blur-md shadow-[0_-8px_24px_-10px_rgba(0,0,0,0.18)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-[640px] items-stretch gap-3 px-4 py-3">
          {/* Left zone — compare price, total */}
          <div className="flex min-w-0 shrink-0 flex-col justify-center pr-3">
            {showCompare && (
              <span className="text-[11px] font-medium tabular-nums text-[hsl(var(--text-mute))] line-through">
                {format(comparePrice as number)}
              </span>
            )}
            <span className="text-[22px] font-extrabold leading-none tabular-nums text-[hsl(var(--text-strong))]">
              {format(total)}
            </span>
            <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--text-mute))]">
              Total
            </span>
          </div>

          {/* Subtle divider hairline */}
          <div className="w-px shrink-0 self-stretch bg-[hsl(var(--hairline))]" aria-hidden />

          {/* Right zone — yellow CTA */}
          <button
            type="button"
            onClick={onCheckout}
            disabled={isCheckingOut}
            className={cn(
              "group relative flex h-[54px] flex-1 items-center justify-center gap-2 rounded-full px-5",
              "bg-order-yellow text-[16px] font-extrabold tracking-tight text-[hsl(var(--text-strong))]",
              "shadow-[0_8px_20px_-8px_hsl(var(--order-yellow-deep)/0.6),inset_0_1px_0_rgba(255,255,255,0.55)]",
              "transition-all duration-150",
              "active:translate-y-[1px] active:shadow-[0_3px_8px_-3px_hsl(var(--order-yellow-deep)/0.4),inset_0_1px_0_rgba(255,255,255,0.35)]",
              "disabled:cursor-not-allowed disabled:opacity-70",
            )}
          >
            {isCheckingOut ? (
              <>
                <span>Processing…</span>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.75} />
              </>
            ) : (
              <>
                <span>Complete Order</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={2.75}
                />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
