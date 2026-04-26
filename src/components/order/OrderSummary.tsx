import { useCurrency } from "@/hooks/useCurrency";

interface OrderSummaryProps {
  subtotal: number;
  saved: number;
}

export function OrderSummary({ subtotal, saved }: OrderSummaryProps) {
  const total = subtotal;
  const { format } = useCurrency();

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3.5 sm:px-5 sm:py-4">
      <div className="space-y-2 text-[14px]">
        <Row label="Subtotal" value={format(subtotal)} />
        <Row label="Shipping" value="FREE" valueClass="text-verified font-bold" />
      </div>

      <div className="mt-3 border-t border-[hsl(var(--hairline))] pt-3">
        <div className="flex items-baseline justify-between">
          <span className="text-[16px] font-extrabold text-[hsl(var(--text-strong))]">Total</span>
          <span className="text-[24px] font-extrabold tabular-nums text-[hsl(var(--text-strong))] sm:text-[22px]">
            {format(total)}
          </span>
        </div>
        <div className="mt-1 flex items-baseline justify-between text-[12.5px]">
          <span className="font-semibold text-[hsl(var(--text-mute))]">You saved</span>
          <span className="font-extrabold tabular-nums text-verified">{format(saved)}</span>
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
