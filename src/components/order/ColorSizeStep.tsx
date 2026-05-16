import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShopifyProductData } from "@/lib/shopify";
import { StepHeader } from "./StepHeader";
import { YellowCta } from "./YellowCta";
import { ColorSwatch } from "./ColorSwatch";
import { ColorZoomDialog } from "./ColorZoomDialog";
import { SizeTileGrid } from "./SizeTileGrid";
import { TrueToSizeMeter } from "./TrueToSizeMeter";
import { SizingDialogs } from "./SizingDialogs";

export interface Selection {
  color: string | null;
  size: string | null;
}

interface ColorSizeStepProps {
  product: ShopifyProductData | null | undefined;
  selections: Selection[];
  onUpdate: (index: number, partial: Partial<Selection>) => void;
  onContinue: () => void;
}

function getOptionValues(product: ShopifyProductData | null | undefined, name: "color" | "size"): string[] {
  if (!product) return [];
  const opt = product.options.find((o) => o.name.replace(/:$/, "").toLowerCase() === name);
  return opt?.values ?? [];
}

export function ColorSizeStep({ product, selections, onUpdate, onContinue }: ColorSizeStepProps) {
  const colors = getOptionValues(product, "color");
  const sizes = getOptionValues(product, "size");
  const [zoom, setZoom] = useState<{ pairIndex: number; color: string } | null>(null);

  const allComplete = selections.every((s) => s.color && s.size);
  const multiPair = selections.length > 1;

  return (
    <section aria-labelledby="step-2-heading" className="animate-fade-in">
      <h2 id="step-2-heading" className="sr-only">
        Step 2: Select Color and Size
      </h2>
      <StepHeader number={2} title="Select Your Color and Size" />

      <div className="row-pad mt-4 space-y-5">
        {selections.map((sel, idx) => {
          const pairComplete = !!(sel.color && sel.size);
          return (
            <div
              key={idx}
              className={cn(
                "rounded-xl border border-border bg-card p-4 sm:p-6",
                multiPair && "shadow-sm",
              )}
            >
              {multiPair && (
                <div className="mb-4 flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-extrabold transition-colors",
                      pairComplete
                        ? "bg-verified text-white"
                        : "bg-secondary text-[hsl(var(--text-strong))]",
                    )}
                  >
                    {pairComplete ? <Check className="h-3.5 w-3.5" strokeWidth={3.5} /> : idx + 1}
                  </span>
                  <p className="text-[14px] font-extrabold tracking-tight text-[hsl(var(--text-strong))]">
                    Pair {idx + 1}
                  </p>
                </div>
              )}

              {/* Color */}
              <div className="flex items-baseline justify-between">
                <p className="text-[14px] font-extrabold tracking-tight text-[hsl(var(--text-strong))] sm:text-[15px]">
                  Color
                </p>
                {sel.color && (
                  <p className="text-[13px] font-semibold text-[hsl(var(--text-body))]">
                    {sel.color}
                  </p>
                )}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
                {colors.length === 0 && (
                  <span className="col-span-3 text-[13px] text-[hsl(var(--text-mute))] sm:col-span-4">
                    Loading colors…
                  </span>
                )}
                {colors.map((c) => (
                  <div key={c} className="flex justify-center">
                    <ColorSwatch
                      color={c}
                      selected={sel.color === c}
                      onSelect={() => onUpdate(idx, { color: c })}
                      onZoom={() => setZoom({ pairIndex: idx, color: c })}
                    />
                  </div>
                ))}
              </div>

              {/* True-to-size meter */}
              <div className="mt-6">
                <TrueToSizeMeter />
              </div>

              {/* Size */}
              <div className="mt-6 flex items-baseline justify-between">
                <p className="text-[14px] font-extrabold tracking-tight text-[hsl(var(--text-strong))] sm:text-[15px]">
                  Size
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--order-blue-soft))] px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wider text-[hsl(var(--order-blue))]">
                  <span aria-hidden>👟</span> Unisex Fit · Men &amp; Women
                </span>
              </div>
              <div className="mt-3">
                <SizeTileGrid
                  sizes={sizes}
                  value={sel.size}
                  onChange={(v) => onUpdate(idx, { size: v })}
                />
              </div>

              {/* Sizing helpers */}
              <div className="mt-4">
                <SizingDialogs sizes={sizes} selectedSize={sel.size} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="row-pad mt-5">
        <YellowCta label="Next" onClick={onContinue} disabled={!allComplete} />
      </div>
    </section>
  );
}
