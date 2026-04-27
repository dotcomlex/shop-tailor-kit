import { useCurrency } from "@/hooks/useCurrency";

interface OrderSummaryProps {
  subtotal: number;
  saved: number;
}

export function OrderSummary({ subtotal, saved }: OrderSummaryProps) {
  const total = subtotal;
  const compare = subtotal + saved;
  const savedPct = compare > 0 ? Math.round((saved / compare) * 100) : 0;
  const { format } = useCurrency();

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3.5 sm:px-5 sm:py-4">
      <div className="space-y-2 text-[14px]">
        {/* Subtotal with strike-through compare */}
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

        {/* Savings row */}
        {saved > 0 && (
          <div className="flex items-baseline justify-between">
            <span className="text-[hsl(var(--text-body))]">You save</span>
            <span className="tabular-nums font-extrabold text-verified">
              −{format(saved)}{savedPct > 0 && (
                <span className="ml-1 text-[12px] font-bold">({savedPct}% OFF)</span>
              )}
            </span>
          </div>
        )}

        <Row label="Shipping" value="FREE" valueClass="text-verified font-bold" />
      </div>

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

function Row({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[hsl(var(--text-body))]">{label}</span>
      <span className={`tabular-nums font-semibold text-[hsl(var(--text-strong))] ${valueClass ?? ""}`}>
        {value}
      </span>
    </div>
  );
}
