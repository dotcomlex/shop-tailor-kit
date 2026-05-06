import { useEffect, useState, type RefObject } from "react";
import { ArrowRight, Loader2, Lock } from "lucide-react";
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
  /** Ref to footer/end-of-content sentinel — bar hides once this enters view. */
  hideAtRef?: RefObject<HTMLElement | null>;
}

export function StickyCheckoutBar({
  total,
  comparePrice,
  onCheckout,
  isCheckingOut,
  observeRef,
  hideAtRef,
}: StickyCheckoutBarProps) {
  const { format } = useCurrency();
  const [ctaOffscreen, setCtaOffscreen] = useState(false);
  const [endReached, setEndReached] = useState(false);

  useEffect(() => {
    const el = observeRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => setCtaOffscreen(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -20px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [observeRef]);

  useEffect(() => {
    const el = hideAtRef?.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => setEndReached(entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hideAtRef]);

  const visible = ctaOffscreen && !endReached;
  const showCompare = typeof comparePrice === "number" && comparePrice > total;
  const saved = showCompare ? (comparePrice as number) - total : 0;

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 md:hidden transition-all duration-300 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none h-6 w-full bg-gradient-to-t from-background to-transparent"
      />
      <div
        className="border-t border-[hsl(var(--hairline))] bg-background/95 backdrop-blur-md shadow-[0_-12px_32px_-12px_rgba(0,0,0,0.22)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto max-w-[640px] px-4 pt-2.5 pb-3">
          <div className="flex items-stretch gap-3">
            <div className="flex min-w-0 shrink-0 flex-col justify-center">
              <div className="flex items-baseline gap-1.5">
                {showCompare && (
                  <span className="text-[11.5px] font-medium tabular-nums text-[hsl(var(--text-mute))] line-through">
                    {format(comparePrice as number)}
                  </span>
                )}
                <span className="text-[22px] font-extrabold leading-none tabular-nums text-[hsl(var(--text-strong))]">
                  {format(total)}
                </span>
              </div>
              <span className="mt-1 text-[10.5px] font-semibold uppercase tracking-wider text-[hsl(var(--text-mute))]">
                Total · Free shipping
              </span>
            </div>

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
                  <Lock className="h-4 w-4" strokeWidth={2.75} aria-hidden />
                  <span>Complete Order</span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    strokeWidth={2.75}
                  />
                </>
              )}
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-1.5 text-[10.5px] font-medium text-[hsl(var(--text-mute))]">
            <span>Secure SSL checkout</span>
            <span aria-hidden>·</span>
            <span>60-day guarantee</span>
            {saved > 0 && (
              <>
                <span aria-hidden>·</span>
                <span className="text-[hsl(var(--text-body))]">
                  You save <span className="font-semibold tabular-nums">{format(saved)}</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
