import { useEffect, useState, type RefObject } from "react";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency";

interface StickyCheckoutBarProps {
  total: number;
  comparePrice: number;
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
        // Show sticky bar only when the main CTA is NOT visible
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px 0px -20px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [observeRef]);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-[hsl(var(--hairline))] bg-background/95 shadow-[0_-6px_20px_-8px_rgba(0,0,0,0.12)] backdrop-blur-md transition-transform duration-300 ease-out md:hidden",
        visible ? "translate-y-0" : "translate-y-full pointer-events-none",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-[640px] items-center gap-3 px-4 py-2.5">
        {/* Total */}
        <div className="min-w-0 shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--text-mute))] leading-none">
            Total
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-[18px] font-extrabold leading-none tabular-nums text-[hsl(var(--text-strong))]">
              {format(total)}
            </span>
            {comparePrice > total && (
              <span className="text-[11px] font-medium tabular-nums text-[hsl(var(--text-mute))] line-through">
                {format(comparePrice)}
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={onCheckout}
          disabled={isCheckingOut}
          className={cn(
            "group relative flex h-12 flex-1 items-center justify-center rounded-full px-4",
            "bg-order-yellow text-[14.5px] font-extrabold tracking-tight text-[hsl(var(--text-strong))]",
            "shadow-[0_2px_0_hsl(var(--order-yellow-deep)),inset_0_1px_0_rgba(255,255,255,0.45)]",
            "transition-all duration-150",
            "active:translate-y-[1px] active:shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]",
            "disabled:cursor-not-allowed disabled:opacity-70",
          )}
        >
          <Lock className="mr-1.5 h-3.5 w-3.5" strokeWidth={2.75} />
          <span className="pointer-events-none">
            {isCheckingOut ? "Processing…" : "Complete Order"}
          </span>
          <span className="pointer-events-none ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--text-strong))] text-white">
            {isCheckingOut ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.75} />
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
