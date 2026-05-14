import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface StickyCheckoutBarProps {
  total?: number;
  comparePrice?: number;
  quantity?: number;
  onCheckout: () => void;
  isCheckingOut: boolean;
  /** Ref to the main CTA — sticky button only appears once it's offscreen. */
  ctaRef?: RefObject<HTMLElement | null>;
}

export function StickyCheckoutBar({
  onCheckout,
  isCheckingOut,
  ctaRef,
}: StickyCheckoutBarProps) {
  const [ctaOffscreen, setCtaOffscreen] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(false);

  useEffect(() => {
    const el = ctaRef?.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => setCtaOffscreen(!entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ctaRef]);

  const lastY = useRef(typeof window !== "undefined" ? window.scrollY : 0);
  const ticking = useRef(false);
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - lastY.current;
        if (Math.abs(dy) > 2) {
          setScrollingDown(dy > 0);
          lastY.current = y;
        }
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = ctaOffscreen && scrollingDown;

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden flex justify-center px-5 pb-4 transition-all duration-300 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
      )}
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <button
        type="button"
        onClick={onCheckout}
        disabled={isCheckingOut || !visible}
        className={cn(
          "pointer-events-auto group relative flex h-[54px] w-full max-w-[320px] items-center justify-center gap-2 rounded-full px-6",
          "bg-order-yellow text-[16px] font-extrabold tracking-tight text-[hsl(var(--text-strong))]",
          "shadow-[0_14px_32px_-10px_hsl(var(--order-yellow-deep)/0.55),0_4px_14px_-4px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.55)]",
          "transition-all duration-150",
          "active:translate-y-[1px]",
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
  );
}
