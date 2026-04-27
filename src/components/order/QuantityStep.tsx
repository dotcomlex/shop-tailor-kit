import { cn } from "@/lib/utils";
import { StepHeader } from "./StepHeader";
import { YellowCta } from "./YellowCta";
import { BundleThumb } from "./BundleThumb";
import { useCurrency } from "@/hooks/useCurrency";

export type Quantity = 1 | 2 | 3;

interface BundleOption {
  qty: Quantity;
  name: string;
  perPair: number;
  total: number;
  compare: number;
  savePct: number;
  ribbon?: { label: string; tone: "popular" | "best" };
}

const OPTIONS: BundleOption[] = [
  {
    qty: 1,
    name: "1 Pair VitalWalk® Shoes",
    perPair: 69.95,
    total: 69.95,
    compare: 233.17,
    savePct: 70,
  },
  {
    qty: 2,
    name: "2 Pairs VitalWalk® Shoes",
    perPair: 58.29,
    total: 116.58,
    compare: 466.33,
    savePct: 75,
    ribbon: { label: "MOST POPULAR", tone: "popular" },
  },
  {
    qty: 3,
    name: "3 Pairs VitalWalk® Shoes",
    perPair: 46.63,
    total: 139.9,
    compare: 699.5,
    savePct: 80,
    ribbon: { label: "BEST DEAL", tone: "best" },
  },
];

interface QuantityStepProps {
  quantity: Quantity;
  onQuantityChange: (q: Quantity) => void;
  onContinue: () => void;
}

export function QuantityStep({ quantity, onQuantityChange, onContinue }: QuantityStepProps) {
  const { format } = useCurrency();
  return (
    <section aria-labelledby="step-1-heading">
      <h2 id="step-1-heading" className="sr-only">
        Step 1: Select Quantity
      </h2>
      <StepHeader
        number={1}
        title="Select Quantity"
        rightLabel="Bundle and Save!"
        subStrip="You can select color and size on next step"
      />

      <div className="mt-1.5 flex flex-wrap items-center gap-2 sm:mt-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--order-blue-soft))] px-2.5 py-1 text-[11.5px] font-extrabold uppercase tracking-wider text-[hsl(var(--order-blue))]">
          <span aria-hidden>👟</span> Unisex — fits Men &amp; Women
        </span>
      </div>

      <ul className="mt-2 space-y-2 sm:mt-3 sm:space-y-2.5">
        {OPTIONS.map((opt) => {
          const selected = quantity === opt.qty;
          const ribbonClass =
            opt.ribbon?.tone === "best"
              ? "bg-[hsl(var(--order-blue))] text-white"
              : "bg-[hsl(var(--order-blue))] text-white";
          return (
            <li key={opt.qty} className="relative pt-2 sm:pt-2.5">
              {opt.ribbon && (
                <span
                  className={cn(
                    "absolute right-3 top-0 z-10 rounded-md px-2 py-[3px] text-[10px] font-extrabold tracking-wider shadow-sm",
                    ribbonClass,
                  )}
                >
                  {opt.ribbon.label}
                </span>
              )}
              <button
                type="button"
                onClick={() => onQuantityChange(opt.qty)}
                aria-pressed={selected}
                className={cn(
                  "flex w-full items-center gap-2 rounded-xl border-2 bg-card p-2 text-left transition-all sm:gap-4 sm:p-4",
                  selected
                    ? "border-order-blue"
                    : "border-border hover:border-[hsl(var(--text-mute))]",
                )}
              >
                {/* radio */}
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    selected ? "border-order-blue bg-order-blue" : "border-[hsl(var(--text-mute))]",
                  )}
                  aria-hidden
                >
                  {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>

                {/* thumb */}
                <BundleThumb count={opt.qty} />

                {/* name + save */}
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-extrabold leading-tight tracking-tight text-[hsl(var(--text-strong))] sm:text-[17px]">
                    {opt.name}
                  </p>
                  <p className="mt-1 text-[14px] font-extrabold text-save">
                    Save {opt.savePct}%
                  </p>
                </div>

                {/* price — clean stack: struck → big price → /ea */}
                <div className="shrink-0 text-right">
                  <p className="text-[13px] font-semibold tabular-nums text-[hsl(var(--text-mute))] line-through">
                    {format(opt.compare)}
                  </p>
                  <p className="mt-0.5 text-[19px] font-extrabold leading-none tabular-nums text-[hsl(var(--text-strong))] sm:text-[20px]">
                    {format(opt.perPair)}
                    <span className="ml-0.5 text-[12px] font-medium text-[hsl(var(--text-mute))]">/ea</span>
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 sm:mt-4">
        <YellowCta label="Select Your Color and Size" onClick={onContinue} />
      </div>
    </section>
  );
}

export const BUNDLE_OPTIONS = OPTIONS;
