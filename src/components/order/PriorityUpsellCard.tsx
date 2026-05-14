import { Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency";

interface PriorityUpsellCardProps {
  /** Localized price in the buyer's currency (already FX-converted by Shopify). */
  price: number | null;
  selected: boolean;
  onToggle: (next: boolean) => void;
}

/**
 * One-click priority-processing add-on. Sits between OrderSummary and the
 * IncludedChecklist on Step 3 — visible while the customer reviews their
 * total, but doesn't push the CTA below the fold.
 */
export function PriorityUpsellCard({
  price,
  selected,
  onToggle,
}: PriorityUpsellCardProps) {
  const { format } = useCurrency();
  const priceLabel = price != null ? format(price) : null;

  return (
    <button
      type="button"
      onClick={() => onToggle(!selected)}
      aria-pressed={selected}
      className={cn(
        "group relative flex w-full items-center gap-3 overflow-hidden rounded-lg border px-3.5 py-3 text-left transition-all duration-150 sm:px-4",
        "active:scale-[0.995]",
        // Soft yellow wash so the card stands out from the neutral cards
        // above and below — same accent family as the CTA.
        "bg-[hsl(var(--order-yellow)/0.10)]",
        selected
          ? "border-verified/70 ring-1 ring-verified/40 shadow-[0_4px_14px_-8px_hsl(var(--verified)/0.55)]"
          : "border-[hsl(var(--order-yellow-deep)/0.35)] hover:border-[hsl(var(--order-yellow-deep)/0.6)]",
      )}
    >
      {/* Subtle top-left shimmer for depth */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[hsl(var(--order-yellow)/0.18)] to-transparent"
      />

      {/* Icon disc */}
      <span
        className={cn(
          "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
          selected
            ? "bg-verified text-white"
            : "bg-[hsl(var(--order-yellow)/0.35)] text-[hsl(var(--text-strong))]",
        )}
      >
        <Zap className="h-4 w-4" strokeWidth={2.75} fill="currentColor" />
      </span>

      <div className="relative min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[13.5px] font-extrabold tracking-tight text-[hsl(var(--text-strong))] sm:text-[14px]">
            Priority Processing
          </span>
          {priceLabel && (
            <span className="shrink-0 text-[13px] font-bold tabular-nums text-[hsl(var(--text-strong))]">
              +{priceLabel}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[11.5px] leading-snug text-[hsl(var(--text-body))] sm:text-[12px]">
          Skip the line — your order ships first ⚡
        </p>
      </div>

      {/* Toggle pill */}
      <span
        className={cn(
          "relative ml-1 flex h-7 shrink-0 items-center justify-center rounded-full border px-2.5 text-[11.5px] font-bold uppercase tracking-wider transition-colors",
          selected
            ? "border-verified bg-verified text-white"
            : "border-[hsl(var(--order-yellow-deep)/0.55)] bg-white/60 text-[hsl(var(--text-body))] group-hover:border-[hsl(var(--text-strong))]",
        )}
      >
        {selected ? (
          <>
            <Check className="mr-1 h-3 w-3" strokeWidth={3.5} />
            Added
          </>
        ) : (
          "Add"
        )}
      </span>
    </button>
  );
}
