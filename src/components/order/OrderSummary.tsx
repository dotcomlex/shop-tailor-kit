import { Check } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

interface OrderSummaryProps {
  subtotal: number;
  saved: number;
  quantity?: number;
  /** Optional one-click add-on amount (e.g. priority processing). */
  addOnTotal?: number;
  /** Display label for the add-on line. */
  addOnLabel?: string;
}

export function OrderSummary({
  subtotal,
  saved,
  quantity,
  addOnTotal = 0,
  addOnLabel,
}: OrderSummaryProps) {
  const { format } = useCurrency();
  const qty = quantity ?? 1;
  const total = subtotal + addOnTotal;
  const compare = subtotal + saved;
  const perPair = qty > 0 ? subtotal / qty : 0;

  // Shipping cost is intentionally NOT computed here. Shopify reveals the
  // exact rate once the customer enters their address — surfacing it on
  // the funnel hurt CVR. We keep a soft, qualitative line instead.
  const shipsFree = true;
  const showAddOn = addOnTotal > 0 && !!addOnLabel;

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3.5 sm:px-5 sm:py-4">
      {qty > 1 && perPair > 0 && (
        <div className="mb-3 flex items-baseline justify-between border-b border-[hsl(var(--hairline))] pb-3 text-[13px] text-[hsl(var(--text-mute))]">
          <span className="font-medium">
            {format(perPair)}/pair · {qty} pairs
          </span>
          <span className="text-[12px]">Bundle pricing</span>
        </div>
      )}

      <div className="space-y-2 text-[14px]">
        <div className="flex items-baseline justify-between">
          <span className="text-[hsl(var(--text-body))]">Subtotal</span>
          <span className="flex items-baseline gap-2">
            {saved > 0 && (
              <span className="text-[12.5px] tabular-nums text-[hsl(var(--text-mute))] line-through">
                {format(compare)}
              </span>
            )}
            <span className="tabular-nums font-semibold text-[hsl(var(--text-strong))]">
              {format(subtotal)}
            </span>
          </span>
        </div>

        {showAddOn && (
          <div className="flex items-baseline justify-between animate-fade-in">
            <span className="text-[hsl(var(--text-body))]">{addOnLabel}</span>
            <span className="tabular-nums font-semibold text-[hsl(var(--text-strong))]">
              +{format(addOnTotal)}
            </span>
          </div>
        )}

        {shipsFree && (
          <div className="flex items-baseline justify-between">
            <span className="text-[hsl(var(--text-body))]">Shipping</span>
            <span className="flex items-baseline gap-1.5">
              <span className="tabular-nums font-bold text-verified">FREE</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--text-mute))]">
                Today only
              </span>
            </span>
          </div>
        )}
      </div>

      {saved > 0 && (
        <div className="mt-3 flex justify-end">
          <span className="inline-flex items-center gap-1 rounded-full bg-verified/10 px-2.5 py-1 text-[11.5px] font-bold text-verified">
            <Check className="h-3 w-3" strokeWidth={3} />
            You saved {format(saved)} · {Math.round((saved / compare) * 100)}% off
          </span>
        </div>
      )}

      <div className="mt-3 border-t border-[hsl(var(--hairline))] pt-3">
        <div className="flex items-baseline justify-between">
          <span className="text-[16px] font-extrabold text-[hsl(var(--text-strong))]">Total</span>
          <span className="text-[24px] font-extrabold tabular-nums text-[hsl(var(--text-strong))] sm:text-[22px]">
            {format(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
