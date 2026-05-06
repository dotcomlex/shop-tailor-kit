import { useCurrency } from "@/hooks/useCurrency";

interface OrderSummaryProps {
  subtotal: number;
  saved: number;
  quantity?: number;
}

export function OrderSummary({ subtotal, saved, quantity }: OrderSummaryProps) {
  const total = subtotal;
  const compare = subtotal + saved;
  const { format } = useCurrency();
  const perPair = quantity && quantity > 0 ? subtotal / quantity : 0;

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3.5 sm:px-5 sm:py-4">
      {/* Calm per-pair anchor — frames the price as a normal unit price
          rather than a discount. Only shown for multi-pair bundles. */}
      {quantity && quantity > 1 && perPair > 0 && (
        <div className="mb-3 flex items-baseline justify-between border-b border-[hsl(var(--hairline))] pb-3 text-[13px] text-[hsl(var(--text-mute))]">
          <span className="font-medium">
            {format(perPair)}/pair · {quantity} pairs
          </span>
          <span className="text-[12px]">Bundle pricing</span>
        </div>
      )}

      <div className="space-y-2 text-[14px]">
        {/* Subtotal with strike-through compare. Strike is the only loud
            signal left — no green % pill competing with it. */}
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

        <Row label="Shipping" value="FREE" valueClass="text-verified font-bold" />
      </div>

      <div className="mt-3 border-t border-[hsl(var(--hairline))] pt-3">
        <div className="flex items-baseline justify-between">
          <span className="text-[16px] font-extrabold text-[hsl(var(--text-strong))]">Total</span>
          <span className="text-[24px] font-extrabold tabular-nums text-[hsl(var(--text-strong))] sm:text-[22px]">
            {format(total)}
          </span>
        </div>

        {/* Demoted savings footnote — visible for skimmers, no shouty
            pill, no green emphasis. Reads like a calm receipt note. */}
        {saved > 0 && (
          <p className="mt-1.5 text-right text-[12px] italic text-[hsl(var(--text-mute))]">
            You're saving {format(saved)} today.
          </p>
        )}
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
