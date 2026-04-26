import { useEffect, useState } from "react";
import { Ruler, Lightbulb, Footprints } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { parseShopifySize, type SizeRow } from "@/data/sizeChart";
import { useGeo } from "@/hooks/useGeo";
import { regionFor, type Region } from "@/lib/geo";

interface SizingDialogsProps {
  sizes: string[];
  selectedSize?: string | null;
}

const REGIONS: { id: Region; label: string }[] = [
  { id: "US", label: "US" },
  { id: "UK", label: "UK" },
  { id: "EU", label: "EU" },
  { id: "AU", label: "AU/NZ" },
];

function columnsFor(r: Region): { key: keyof SizeRow; label: string }[] {
  switch (r) {
    case "UK":
      return [
        { key: "uk", label: "UK Women" },
        { key: "uk", label: "UK Men" },
      ];
    case "EU":
      return [
        { key: "eu", label: "EU Women" },
        { key: "eu", label: "EU Men" },
      ];
    case "AU":
      return [
        { key: "au", label: "AU Women" },
        { key: "au", label: "AU Men" },
      ];
    default:
      return [
        { key: "usW", label: "US Women" },
        { key: "usM", label: "US Men" },
      ];
  }
}

export function SizingDialogs({ sizes, selectedSize }: SizingDialogsProps) {
  const [chartOpen, setChartOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const { country } = useGeo();
  const [region, setRegion] = useState<Region>("US");

  useEffect(() => {
    setRegion(regionFor(country?.code));
  }, [country]);

  const cols = columnsFor(region);
  const rows = sizes.map((s) => ({ raw: s, parsed: parseShopifySize(s) }));

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px] sm:text-[15px]">
      <Dialog open={chartOpen} onOpenChange={setChartOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 font-bold text-[hsl(var(--order-blue))] underline underline-offset-4 decoration-2 hover:opacity-80"
          >
            <Ruler className="h-4 w-4" strokeWidth={2.5} />
            View Size Chart
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-left text-[18px] font-extrabold tracking-tight">
              Size Chart
            </DialogTitle>
          </DialogHeader>

          <p className="text-[13px] text-[hsl(var(--text-body))]">
            <span className="font-bold text-[hsl(var(--text-strong))]">Find your size below.</span>{" "}
            All pairs are true to size.
          </p>

          {/* Region tabs */}
          <div
            role="tablist"
            aria-label="Sizing region"
            className="grid grid-cols-4 gap-1 rounded-lg bg-secondary p-1"
          >
            {REGIONS.map((r) => (
              <button
                key={r.id}
                role="tab"
                aria-selected={region === r.id}
                onClick={() => setRegion(r.id)}
                className={cn(
                  "rounded-md px-2 py-1.5 text-[12.5px] font-bold tracking-tight transition-colors",
                  region === r.id
                    ? "bg-card text-[hsl(var(--text-strong))] shadow-sm"
                    : "text-[hsl(var(--text-mute))] hover:text-[hsl(var(--text-strong))]",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <table className="w-full text-left text-[14px]">
              <thead className="sticky top-0 bg-secondary text-[11.5px] uppercase tracking-wide text-[hsl(var(--text-mute))]">
                <tr>
                  {cols.map((c) => (
                    <th key={c.label} className="px-3 py-2.5 font-bold">{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map(({ raw, parsed }, idx) => {
                  const isMine = selectedSize === raw;
                  return (
                    <tr
                      key={raw}
                      className={cn(
                        "h-11",
                        isMine
                          ? "bg-[hsl(var(--order-blue)/0.08)]"
                          : idx % 2 === 1
                            ? "bg-secondary/40"
                            : "",
                      )}
                    >
                      {cols.map((c, i) => (
                        <td
                          key={i}
                          className={cn(
                            "px-3 py-2 tabular-nums",
                            isMine
                              ? "font-extrabold text-[hsl(var(--order-blue))]"
                              : "font-semibold text-[hsl(var(--text-strong))]",
                          )}
                        >
                          {parsed[c.key] || "—"}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-[12.5px] text-[hsl(var(--text-body))]">
            <Footprints className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--order-blue))]" strokeWidth={2.5} />
            <span>
              Not sure? Measure your foot in <strong>cm</strong> and match it to the EU column for the most
              accurate fit.
            </span>
          </div>
        </DialogContent>
      </Dialog>

      <span className="hidden h-4 w-px bg-[hsl(var(--hairline))] sm:block" aria-hidden />

      <Dialog open={tipsOpen} onOpenChange={setTipsOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 font-bold text-[hsl(var(--order-blue))] underline underline-offset-4 decoration-2 hover:opacity-80"
          >
            <Lightbulb className="h-4 w-4" strokeWidth={2.5} />
            Sizing Tips
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-left text-[18px] font-extrabold tracking-tight">
              Expert Sizing Tips
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-[14px] text-[hsl(var(--text-body))]">
            <p>These tips have helped thousands of our customers find the perfect fit:</p>
            <p className="flex items-start gap-2">
              <span className="text-verified">✅</span>
              <span>Pick the shoe size you most commonly wear.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-verified">✅</span>
              <span>If you are between sizes, choose the size up.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-verified">✅</span>
              <span>Wide feet? Our adjustable strap accommodates wider widths comfortably.</span>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
