import { cn } from "@/lib/utils";
import { StepHeader } from "./StepHeader";
import { YellowCta } from "./YellowCta";
import { BundleThumb } from "./BundleThumb";
import { useCurrency } from "@/hooks/useCurrency";
import { useVitalWalkBundles } from "@/hooks/useVitalWalkProduct";
import type { ShopifyProductData } from "@/lib/shopify";

export type Quantity = 1 | 2 | 3;

interface BundleOption {
  qty: Quantity;
  name: string;
  savePct: number;
  ribbon?: { label: string; tone: "popular" | "best" };
}

const OPTIONS: BundleOption[] = [
  { qty: 1, name: "1 Pair VitalWalk® Shoes", savePct: 70 },
  {
    qty: 2,
    name: "2 Pairs VitalWalk® Shoes",
    savePct: 75,
    ribbon: { label: "MOST POPULAR", tone: "popular" },
  },
  {
    qty: 3,
    name: "3 Pairs VitalWalk® Shoes",
    savePct: 80,
    ribbon: { label: "BEST DEAL", tone: "best" },
  },
];

interface QuantityStepProps {
  quantity: Quantity;
  onQuantityChange: (q: Quantity) => void;
  onContinue: () => void;
}

/**
 * Read the localized total/compare for a bundle product directly from the
 * Shopify @inContext response. These are the EXACT same numbers Shopify
 * will charge at checkout — no FX math, no rounding drift.
 */
function readLocalizedTotals(product: ShopifyProductData | null | undefined) {
  if (!product) return null;
  const total = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareRaw = parseFloat(product.compareAtPriceRange.minVariantPrice.amount);
  if (!Number.isFinite(total)) return null;
  // If compare is missing/zero, fall back to total so the strike-through hides.
  const compare = Number.isFinite(compareRaw) && compareRaw > 0 ? compareRaw : total;
  return { total, compare };
}

export function QuantityStep({ quantity, onQuantityChange, onContinue }: QuantityStepProps) {
  const { format } = useCurrency();
  const { data: bundles } = useVitalWalkBundles();

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

      <div className="row-pad">
        <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:mt-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--order-blue-soft))] px-2.5 py-1 text-[11.5px] font-extrabold uppercase tracking-wider text-[hsl(var(--order-blue))]">
            <span aria-hidden>👟</span> Unisex — fits Men &amp; Women
          </span>
        </div>

        <ul className="mt-3 space-y-2.5">
          {OPTIONS.map((opt) => {
            const selected = quantity === opt.qty;
            const ribbonClass =
              opt.ribbon?.tone === "best"
                ? "bg-[hsl(var(--order-blue))] text-white"
                : "bg-[hsl(var(--order-blue))] text-white";

            const totals = readLocalizedTotals(bundles?.[opt.qty]);
            // Headline = exact Shopify bundle total (matches checkout to
            // the cent). Per-pair is shown as a small secondary line on
            // 2/3-pair cards only — it anchors the upgrade value without
            // creating a mismatch between Step 1 and Step 3.
            const totalFormatted = totals ? format(totals.total) : "";
            const compareFormatted =
              totals && totals.compare > totals.total ? format(totals.compare) : "";
            const perPairFormatted =
              totals && opt.qty > 1 ? format(totals.total / opt.qty) : "";

            return (
              <li key={opt.qty} className="relative pt-2.5">
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
                    "flex w-full items-center gap-2.5 rounded-xl border-2 bg-card p-3 text-left transition-all sm:gap-4 sm:p-4",
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
                    <p className="text-[17px] font-extrabold leading-tight tracking-tight text-[hsl(var(--text-strong))] sm:text-[17px]">
                      {opt.name}
                    </p>
                    <p className="mt-1 text-[14px] font-extrabold text-save">
                      Save {opt.savePct}%
                    </p>
                  </div>

                  {/* Price column — per-pair is the headline anchor on
                      Step 1 (funnel psychology). The exact Shopify bundle
                      total is shown later (OrderSummary / sticky bar /
                      checkout button). */}
                  <div className="shrink-0 text-right">
                    {perPairCompareFormatted ? (
                      <p className="text-[13px] font-semibold tabular-nums text-[hsl(var(--text-mute))] line-through">
                        {perPairCompareFormatted}
                      </p>
                    ) : (
                      <p className="h-[18px] w-16 ml-auto rounded bg-[hsl(var(--text-mute)/0.15)] animate-pulse" aria-hidden />
                    )}
                    {perPairFormatted ? (
                      <p className="mt-0.5 text-[20px] font-extrabold leading-none tabular-nums text-[hsl(var(--text-strong))] sm:text-[20px]">
                        {perPairFormatted}
                      </p>
                    ) : (
                      <p className="mt-1 h-[20px] w-20 ml-auto rounded bg-[hsl(var(--text-mute)/0.15)] animate-pulse" aria-hidden />
                    )}
                    <p className="mt-1 text-[11px] font-medium tabular-nums text-[hsl(var(--text-mute))]">
                      /pair
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-4">
          <YellowCta label="Select Your Color and Size" onClick={onContinue} />
        </div>
      </div>
    </section>
  );
}

// Backwards-compat export — kept as an empty array since pricing is now
// fully sourced from Shopify. Existing imports won't break.
export const BUNDLE_OPTIONS = OPTIONS;
