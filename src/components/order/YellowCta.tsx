import { ArrowRight, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface YellowCtaProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
  className?: string;
  /** Show a small lock icon before the label (for trust on the final checkout CTA). */
  leadingLock?: boolean;
}

export function YellowCta({
  label,
  onClick,
  disabled,
  loading,
  type = "button",
  className,
  leadingLock,
}: YellowCtaProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "group relative flex h-[60px] w-full items-center justify-center gap-2 rounded-full px-6",
        "bg-order-yellow text-[18px] font-extrabold tracking-tight text-[hsl(var(--text-strong))]",
        // Soft glow + subtle inner highlight — premium, not flat
        "shadow-[0_10px_24px_-10px_hsl(var(--order-yellow-deep)/0.6),inset_0_1px_0_rgba(255,255,255,0.55)]",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-px hover:bg-[hsl(var(--order-yellow-deep))] hover:shadow-[0_14px_30px_-10px_hsl(var(--order-yellow-deep)/0.7),inset_0_1px_0_rgba(255,255,255,0.5)]",
        "active:translate-y-[1px] active:shadow-[0_4px_10px_-4px_hsl(var(--order-yellow-deep)/0.5),inset_0_1px_0_rgba(255,255,255,0.35)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--order-blue))]",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-order-yellow",
        className,
      )}
    >
      {leadingLock && !loading && (
        <Lock className="pointer-events-none h-4 w-4" strokeWidth={2.75} aria-hidden />
      )}
      <span className="pointer-events-none">{label}</span>
      <span
        className="pointer-events-none absolute right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-[hsl(var(--text-strong))] transition-all duration-200 group-hover:bg-black/15"
        aria-hidden
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            strokeWidth={2.75}
          />
        )}
      </span>
    </button>
  );
}
