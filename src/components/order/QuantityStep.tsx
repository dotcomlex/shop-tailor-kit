import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { StepHeader } from "./StepHeader";
import { YellowCta } from "./YellowCta";
import { TrustRow } from "./TrustRow";
import { BundleThumb } from "./BundleThumb";

export type Quantity = 1 | 2 | 3;

interface BundleOption {
  qty: Quantity;
  name: string;
  perPair: number;
  total: number;
  compare: number;
  savePct: number;
  badgeAbove?: string;
  badgeRight?: { label: string; tone: "popular" | "best" };
}

const OPTIONS: BundleOption[] = [
  {
    qty: 1,
    name: "1 Pair VitalWalk® Shoes",
    perPair: 59.95,
    total: 59.95,
    compare: 119.9,
    savePct: 50,
  },
  {
    qty: 2,
    name: "2 Pairs VitalWalk® Shoes",
    perPair: 53.95,
    total: 107.9,
    compare: 239.8,
    savePct: 55,
    badgeAbove: "MOST POPULAR",
    badgeRight: { label: "Most Popular", tone: "popular" },
  },
  {
    qty: 3,
    name: "3 Pairs VitalWalk® Shoes",
    perPair: 47.96,
    total: 143.88,
    compare: 359.7,
    savePct: 60,
    badgeRight: { label: "Best Deal", tone: "best" },
  },
];

interface QuantityStepProps {
  quantity: Quantity;
  onQuantityChange: (q: Quantity) => void;
  onContinue: () => void;
}

export function QuantityStep({ quantity, onQuantityChange, onContinue }: QuantityStepProps) {
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

      <ul className="mt-4 space-y-3">
        {OPTIONS.map((opt) => {
          const selected = quantity === opt.qty;
          return (
            <li key={opt.qty} className="relative">
              {opt.badgeAbove && (
                <span className="absolute right-3 top-3 z-10 rounded-sm bg-order-blue px-2.5 py-0.5 text-[10.5px] font-extrabold tracking-wider text-white shadow-sm sm:text-[11px]">
                  {opt.badgeAbove}
                </span>
              )}
              <button
                type="button"
                onClick={() => onQuantityChange(opt.qty)}
                aria-pressed={selected}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border-2 bg-card p-3 text-left transition-all sm:gap-4 sm:p-4",
                  selected
                    ? "border-order-blue shadow-[0_0_0_3px_hsl(var(--order-blue)/0.08)]"
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

                {/* thumb (stacked pairs) */}
                <BundleThumb count={opt.qty} />

                {/* name + save */}
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-extrabold leading-tight tracking-tight text-[hsl(var(--text-strong))] sm:text-[17px]">
                    {opt.name}
                  </p>
                  <p className="mt-1 text-[13px] font-extrabold text-save sm:text-[14px]">
                    Save {opt.savePct}%
                  </p>
                </div>

                {/* price */}
                <div className="shrink-0 text-right">
                  <p className="text-[16px] font-extrabold tabular-nums text-[hsl(var(--text-strong))] sm:text-[18px]">
                    ${opt.perPair.toFixed(2)}
                    <span className="text-[12px] font-medium text-[hsl(var(--text-mute))]">/ea</span>
                  </p>
                  {opt.badgeRight && (
                    <p
                      className={cn(
                        "mt-0.5 inline-flex items-center gap-1 text-[11px] font-extrabold sm:text-[12px]",
                        opt.badgeRight.tone === "popular" ? "text-verified" : "text-[hsl(var(--order-blue))]",
                      )}
                    >
                      <Star className="h-3 w-3 fill-current" strokeWidth={0} />
                      {opt.badgeRight.label}
                    </p>
                  )}
                  <p className="mt-0.5 text-[12px] font-semibold tabular-nums text-save line-through opacity-80 sm:text-[13px]">
                    ${opt.compare.toFixed(2)}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-5">
        <YellowCta label="Select Your Color and Size" onClick={onContinue} />
        <TrustRow />
      </div>
    </section>
  );
}

export const BUNDLE_OPTIONS = OPTIONS;
