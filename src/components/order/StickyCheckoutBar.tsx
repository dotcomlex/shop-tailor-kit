import { useEffect, useState, type RefObject } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
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
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px 0px -20px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [observeRef]);

  const saved = Math.max(0, comparePrice - total);
  const savePct = comparePrice > 0 ? Math.round((saved / comparePrice) * 100) : 0;

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-[hsl(var(--hairline))] bg-background/95 backdrop-blur-md transition-transform duration-300 ease-out md:hidden",
        "shadow-[0_-8px_24px_-10px_rgba(0,0,0,0.18)]",
        visible ? "translate-y-0" : "translate-y-full pointer-events-none",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-[640px] items-stretch gap-3 px-4 py-3">
        {/* Left zone — price + savings */}
        <div className="flex min-w-0 shrink-0 flex-col justify-center pr-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[20px] font-extrabold leading-none tabular-nums text-[hsl(var(--text-strong))]">
              {format(total)}
            </span>
            {comparePrice > total && (
              <span className="text-[12px] font-medium tabular-nums text-[hsl(var(--text-mute))] line-through">
                {format(comparePrice)}
              </span>
            )}
          </div>
          {saved > 0 && (
            <p className="mt-1 text-[11px] font-bold leading-none tabular-nums text-save">
              Save {format(saved)} ({savePct}%)
            </p>
          )}
        </div>

        {/* Subtle divider hairline */}
        <div className="w-px shrink-0 self-stretch bg-[hsl(var(--hairline))]" aria-hidden />

        {/* Right zone — yellow CTA */}
        <button
          type="button"
          onClick={onCheckout}
          disabled={isCheckingOut}
          className={cn(
            "group relative flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full px-5",
            "bg-order-yellow text-[15px] font-extrabold tracking-tight text-[hsl(var(--text-strong))]",
            "shadow-[0_4px_14px_-4px_hsl(var(--order-yellow-deep)/0.55),inset_0_1px_0_rgba(255,255,255,0.5)]",
            "transition-all duration-150",
            "active:translate-y-[1px] active:shadow-[0_2px_6px_-2px_hsl(var(--order-yellow-deep)/0.4),inset_0_1px_0_rgba(255,255,255,0.35)]",
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
  );
}
