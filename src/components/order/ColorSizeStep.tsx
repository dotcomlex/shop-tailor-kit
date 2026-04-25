import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { ShopifyProductData } from "@/lib/shopify";
import { StepHeader } from "./StepHeader";
import { YellowCta } from "./YellowCta";
import { TrustRow } from "./TrustRow";
import { ColorSwatch } from "./ColorSwatch";
import { SizeSelect } from "./SizeSelect";

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
  const [chartOpen, setChartOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);

  const colors = getOptionValues(product, "color");
  const sizes = getOptionValues(product, "size");

  const allComplete = selections.every((s) => s.color && s.size);

  return (
    <section aria-labelledby="step-2-heading" className="animate-fade-in">
      <h2 id="step-2-heading" className="sr-only">
        Step 2: Select Color and Size
      </h2>
      <StepHeader number={2} title="Select Your Color and Size" />

      <div className="mt-4 space-y-6">
        {selections.map((sel, idx) => (
          <div
            key={idx}
            className={cn(
              "rounded-lg border border-border bg-card p-4 sm:p-5",
              selections.length > 1 && "shadow-sm",
            )}
          >
            {selections.length > 1 && (
              <p className="mb-3 text-[13px] font-bold uppercase tracking-wide text-[hsl(var(--text-mute))]">
                Pair {idx + 1}
              </p>
            )}

            <p className="text-[14px] font-semibold text-[hsl(var(--text-strong))]">
              {idx + 1}. Select Color:
              {sel.color && <span className="ml-1 font-normal text-[hsl(var(--text-body))]">{sel.color}</span>}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {colors.length === 0 && (
                <span className="text-[13px] text-[hsl(var(--text-mute))]">Loading colors…</span>
              )}
              {colors.map((c) => (
                <ColorSwatch
                  key={c}
                  color={c}
                  selected={sel.color === c}
                  onSelect={() => onUpdate(idx, { color: c })}
                />
              ))}
            </div>

            <p className="mt-5 text-[14px] font-semibold text-[hsl(var(--text-strong))]">
              {idx + 1}. Select Size:
            </p>
            <div className="mt-2.5">
              <SizeSelect
                sizes={sizes}
                value={sel.size}
                onChange={(v) => onUpdate(idx, { size: v })}
              />
            </div>
          </div>
        ))}

        <p className="text-center text-[13px] text-[hsl(var(--text-mute))]">
          👟 Sizing is currently displayed in US sizes
        </p>

        {/* Size chart */}
        <Collapsible open={chartOpen} onOpenChange={setChartOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border border-border bg-card px-4 py-3 text-left text-[14px] font-semibold text-[hsl(var(--text-strong))] transition-colors hover:bg-secondary">
            Size Chart
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", chartOpen && "rotate-180")}
              strokeWidth={2}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden">
            <div className="mt-2 overflow-x-auto rounded-md border border-border bg-card">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-secondary text-[hsl(var(--text-mute))]">
                  <tr>
                    <th className="px-3 py-2 font-semibold">US Women</th>
                    <th className="px-3 py-2 font-semibold">US Men</th>
                    <th className="px-3 py-2 font-semibold">UK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sizes.map((s) => (
                    <tr key={s}>
                      {parseSizeRow(s).map((cell, i) => (
                        <td key={i} className="px-3 py-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Sizing tips */}
        <Collapsible open={tipsOpen} onOpenChange={setTipsOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border border-border bg-card px-4 py-3 text-left text-[14px] font-semibold text-[hsl(var(--text-strong))] transition-colors hover:bg-secondary">
            Expert Sizing Tips
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", tipsOpen && "rotate-180")}
              strokeWidth={2}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden">
            <div className="mt-2 space-y-2 rounded-md border border-border bg-card px-4 py-3 text-[14px] text-[hsl(var(--text-body))]">
              <p>
                It's super simple. We have two sizing tips which have proven to help our customers find the
                perfect size:
              </p>
              <p className="flex items-start gap-2">
                <span className="text-verified">✅</span>
                <span>Pick the shoe size you most commonly wear.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-verified">✅</span>
                <span>If you are between sizes, choose the size up.</span>
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="mt-5">
        <YellowCta label="Next" onClick={onContinue} disabled={!allComplete} />
        <TrustRow />
      </div>
    </section>
  );
}

/**
 * Shopify size strings look like "US W 7 / US M 6 / UK 5" — split into 3 cells.
 */
function parseSizeRow(raw: string): [string, string, string] {
  const parts = raw.split("/").map((p) => p.trim());
  const w = parts.find((p) => /^US\s*W/i.test(p))?.replace(/^US\s*W\s*/i, "") ?? "";
  const m = parts.find((p) => /^US\s*M/i.test(p))?.replace(/^US\s*M\s*/i, "") ?? "";
  const uk = parts.find((p) => /^UK/i.test(p))?.replace(/^UK\s*/i, "") ?? "";
  return [w, m, uk];
}
