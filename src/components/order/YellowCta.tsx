import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface YellowCtaProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
  className?: string;
}

export function YellowCta({
  label,
  onClick,
  disabled,
  loading,
  type = "button",
  className,
}: YellowCtaProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "group relative flex h-[60px] w-full items-center justify-center rounded-full px-6",
        "bg-order-yellow text-[18px] font-bold text-[hsl(var(--text-strong))]",
        "shadow-[0_2px_0_hsl(var(--order-yellow-deep))]",
        "transition-all duration-200",
        "hover:bg-[hsl(var(--order-yellow-deep))] hover:shadow-[0_3px_0_hsl(var(--order-yellow-deep))]",
        "active:translate-y-[1px] active:shadow-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--order-blue))]",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-order-yellow",
        className,
      )}
    >
      <span className="pointer-events-none">{label}</span>
      <span className="pointer-events-none absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--text-strong))] text-white">
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
        )}
      </span>
    </button>
  );
}
