import { useState } from "react";
import { Ruler, Lightbulb } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SizingDialogsProps {
  sizes: string[];
}

function parseSizeRow(raw: string): [string, string, string] {
  const parts = raw.split("/").map((p) => p.trim());
  const w = parts.find((p) => /^US\s*W/i.test(p))?.replace(/^US\s*W\s*/i, "") ?? "";
  const m = parts.find((p) => /^US\s*M/i.test(p))?.replace(/^US\s*M\s*/i, "") ?? "";
  const uk = parts.find((p) => /^UK/i.test(p))?.replace(/^UK\s*/i, "") ?? "";
  return [w, m, uk];
}

export function SizingDialogs({ sizes }: SizingDialogsProps) {
  const [chartOpen, setChartOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);

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
          <p className="text-[13px] text-[hsl(var(--text-mute))]">All sizes shown in US.</p>
          <div className="overflow-x-auto rounded-md border border-border bg-card">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-secondary text-[12px] uppercase tracking-wide text-[hsl(var(--text-mute))]">
                <tr>
                  <th className="px-3 py-2 font-bold">US Women</th>
                  <th className="px-3 py-2 font-bold">US Men</th>
                  <th className="px-3 py-2 font-bold">UK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sizes.map((s, idx) => (
                  <tr key={s} className={idx % 2 === 1 ? "bg-secondary/40" : ""}>
                    {parseSizeRow(s).map((cell, i) => (
                      <td key={i} className="px-3 py-2 font-semibold tabular-nums text-[hsl(var(--text-strong))]">
                        {cell || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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
            <p>
              These two tips have helped thousands of our customers find the perfect fit:
            </p>
            <p className="flex items-start gap-2">
              <span className="text-verified">✅</span>
              <span>Pick the shoe size you most commonly wear.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-verified">✅</span>
              <span>If you are between sizes, choose the size up.</span>
            </p>
            <p className="rounded-md bg-secondary px-3 py-2 text-[13px] text-[hsl(var(--text-mute))]">
              👟 Sizing is currently displayed in US sizes
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
