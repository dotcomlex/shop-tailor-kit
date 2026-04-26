import { useEffect, useMemo, useRef, useState } from "react";
import { Ruler, Lightbulb, Footprints, Check, X, MoveHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { parseShopifySize, type SizeRow } from "@/data/sizeChart";
import { useGeo } from "@/hooks/useGeo";
import { regionFor, type Region } from "@/lib/geo";
import { useIsMobile } from "@/hooks/use-mobile";

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

// Region rendering config — defines columns per region.
type RegionLayout =
  | { kind: "split"; wKey: keyof SizeRow; mKey: keyof SizeRow; prefix: string; wLabel: string; mLabel: string }
  | { kind: "unified"; key: keyof SizeRow; prefix: string; label: string };

function layoutFor(r: Region): RegionLayout {
  switch (r) {
    case "UK":
      return { kind: "unified", key: "uk", prefix: "UK", label: "Size (UK)" };
    case "EU":
      return { kind: "unified", key: "eu", prefix: "EU", label: "Size (EU)" };
    case "AU":
      return { kind: "split", wKey: "auW", mKey: "auM", prefix: "AU", wLabel: "Women", mLabel: "Men" };
    default:
      return { kind: "split", wKey: "usW", mKey: "usM", prefix: "US", wLabel: "Women", mLabel: "Men" };
  }
}

/* -------------------------------------------------------------------------- */
/* Shared body — used inside both Sheet (mobile) and Dialog (desktop)         */
/* -------------------------------------------------------------------------- */

function SizeChartBody({
  sizes,
  selectedSize,
  region,
  setRegion,
  detectedRegion,
  isMobile,
  onClose,
}: {
  sizes: string[];
  selectedSize?: string | null;
  region: Region;
  setRegion: (r: Region) => void;
  detectedRegion: Region | null;
  isMobile: boolean;
  onClose: () => void;
}) {
  const layout = layoutFor(region);
  const rows = useMemo(
    () => sizes.map((s) => ({ raw: s, parsed: parseShopifySize(s) })),
    [sizes],
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const selectedRowRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to user's size on open / when region/list changes
  useEffect(() => {
    const t = setTimeout(() => {
      selectedRowRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 80);
    return () => clearTimeout(t);
  }, [region, sizes]);

  return (
    <div className="flex h-full max-h-[85vh] flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-background px-5 pb-3 pt-4 sm:px-6 sm:pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-extrabold tracking-tight text-[hsl(var(--text-strong))] sm:text-[19px]">
              Find Your Size
            </h2>
            <p className="mt-1 text-[12.5px] text-[hsl(var(--text-mute))] sm:text-[13px]">
              All pairs are <span className="font-semibold text-[hsl(var(--text-body))]">true to size</span>.
              Pick your usual fit.
            </p>
          </div>
          {!isMobile && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1.5 text-[hsl(var(--text-mute))] transition-colors hover:bg-secondary hover:text-[hsl(var(--text-strong))]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Region tabs */}
        <div
          role="tablist"
          aria-label="Sizing region"
          className="mt-3 grid grid-cols-4 gap-1 rounded-xl bg-secondary p-1"
        >
          {REGIONS.map((r) => {
            const isActive = region === r.id;
            const isDetected = detectedRegion === r.id;
            return (
              <button
                key={r.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setRegion(r.id)}
                className={cn(
                  "relative rounded-lg px-2 py-2 text-[12.5px] font-bold tracking-tight transition-all",
                  isActive
                    ? "bg-card text-[hsl(var(--text-strong))] shadow-sm"
                    : "text-[hsl(var(--text-mute))] hover:text-[hsl(var(--text-strong))]",
                )}
              >
                {r.label}
                {isDetected && !isActive && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[hsl(var(--order-blue))] ring-2 ring-secondary" />
                )}
              </button>
            );
          })}
        </div>

        {detectedRegion && (
          <p className="mt-2 text-[11.5px] text-[hsl(var(--text-mute))]">
            Recommended for you:{" "}
            <span className="font-bold text-[hsl(var(--order-blue))]">
              {REGIONS.find((r) => r.id === detectedRegion)?.label}
            </span>
          </p>
        )}
      </div>

      {/* Scrollable size rows */}
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-2 sm:px-4"
      >
        {/* Column header */}
        <div className="flex items-center justify-between px-3 pb-1.5 pt-1 text-[10.5px] font-bold uppercase tracking-[0.08em] text-[hsl(var(--text-mute))]">
          {layout.kind === "split" ? (
            <div className="flex gap-8 sm:gap-10">
              <span className="w-12">{layout.wLabel}</span>
              <span className="w-12">{layout.mLabel}</span>
            </div>
          ) : (
            <span>Size · Unisex</span>
          )}
          <span>Match</span>
        </div>

        <ul className="space-y-1">
          {rows.map(({ raw, parsed }) => {
            const isMine = selectedSize === raw;

            // Secondary line — show the "other" reference for context.
            const secondary =
              region === "US"
                ? `EU ${parsed.eu}`
                : region === "AU"
                ? `EU ${parsed.eu}`
                : `US W ${parsed.usW} · US M ${parsed.usM}`;

            return (
              <li key={raw}>
                <div
                  ref={isMine ? selectedRowRef : undefined}
                  className={cn(
                    "relative rounded-xl border px-3 py-2.5 transition-colors sm:px-4",
                    isMine
                      ? "border-[hsl(var(--order-blue)/0.35)] bg-[hsl(var(--order-blue)/0.08)]"
                      : "border-transparent bg-secondary/40 hover:bg-secondary/70",
                  )}
                >
                  {isMine && (
                    <span
                      aria-hidden
                      className="absolute inset-y-2 left-0 w-1 rounded-full bg-[hsl(var(--order-blue))]"
                    />
                  )}

                  {/* Top: region size numbers + Yours pill */}
                  <div className="flex items-center justify-between">
                    {layout.kind === "split" ? (
                      <div className="flex min-w-0 items-baseline gap-8 sm:gap-10">
                        <div className="w-12">
                          <div
                            className={cn(
                              "text-[17px] font-extrabold tabular-nums leading-none sm:text-[18px]",
                              isMine
                                ? "text-[hsl(var(--order-blue))]"
                                : "text-[hsl(var(--text-strong))]",
                            )}
                          >
                            {parsed[layout.wKey]}
                          </div>
                          <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[hsl(var(--text-mute))]">
                            {layout.prefix}
                          </div>
                        </div>
                        <div className="w-12">
                          <div
                            className={cn(
                              "text-[17px] font-extrabold tabular-nums leading-none sm:text-[18px]",
                              isMine
                                ? "text-[hsl(var(--order-blue))]"
                                : "text-[hsl(var(--text-strong))]",
                            )}
                          >
                            {parsed[layout.mKey]}
                          </div>
                          <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[hsl(var(--text-mute))]">
                            {layout.prefix}
                          </div>
                        </div>
                        <div className="hidden text-[11.5px] tabular-nums text-[hsl(var(--text-mute))] sm:block">
                          {secondary}
                        </div>
                      </div>
                    ) : (
                      <div className="flex min-w-0 items-baseline gap-4">
                        <div className="min-w-[3.5rem]">
                          <div
                            className={cn(
                              "text-[20px] font-extrabold tabular-nums leading-none sm:text-[22px]",
                              isMine
                                ? "text-[hsl(var(--order-blue))]"
                                : "text-[hsl(var(--text-strong))]",
                            )}
                          >
                            {parsed[layout.key]}
                          </div>
                          <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[hsl(var(--text-mute))]">
                            {layout.prefix} · Unisex
                          </div>
                        </div>
                        <div className="hidden text-[11.5px] tabular-nums text-[hsl(var(--text-mute))] sm:block">
                          {secondary}
                        </div>
                      </div>
                    )}

                    <div className="shrink-0 pl-2">
                      {isMine ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--order-blue))] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white">
                          <Check className="h-3 w-3" strokeWidth={3} />
                          Yours
                        </span>
                      ) : (
                        <span className="text-[11px] tabular-nums text-[hsl(var(--text-mute))] sm:hidden">
                          {region === "US" || region === "AU" ? `EU ${parsed.eu}` : `US ${parsed.usW}`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom: foot length & width in mm */}
                  <div
                    className={cn(
                      "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-2 text-[11px] tabular-nums sm:text-[12px]",
                      isMine ? "border-[hsl(var(--order-blue)/0.25)]" : "border-border/60",
                    )}
                  >
                    <span className="inline-flex items-center gap-1 text-[hsl(var(--text-mute))]">
                      <Ruler className="h-3 w-3" strokeWidth={2.5} />
                      <span className="uppercase tracking-wide">Length</span>
                      <span
                        className={cn(
                          "ml-0.5 font-bold",
                          isMine
                            ? "text-[hsl(var(--order-blue))]"
                            : "text-[hsl(var(--text-body))]",
                        )}
                      >
                        {parsed.lengthMm} mm
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[hsl(var(--text-mute))]">
                      <MoveHorizontal className="h-3 w-3" strokeWidth={2.5} />
                      <span className="uppercase tracking-wide">Width</span>
                      <span
                        className={cn(
                          "ml-0.5 font-bold",
                          isMine
                            ? "text-[hsl(var(--order-blue))]"
                            : "text-[hsl(var(--text-body))]",
                        )}
                      >
                        {parsed.widthMm} mm
                      </span>
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>


      {/* Footer tip */}
      <div className="shrink-0 border-t border-border bg-secondary/40 px-4 py-3 sm:px-6">
        <div className="flex items-start gap-2 text-[12px] text-[hsl(var(--text-body))] sm:text-[12.5px]">
          <Footprints
            className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--order-blue))]"
            strokeWidth={2.5}
          />
          <span>
            Not sure? Measure your foot in <strong>cm</strong> and match it to the EU column for the
            most accurate fit.
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sizing Tips body                                                           */
/* -------------------------------------------------------------------------- */

function SizingTipsBody({ isMobile, onClose }: { isMobile: boolean; onClose: () => void }) {
  const tips = [
    "Pick the shoe size you most commonly wear.",
    "If you are between sizes, choose the size up.",
    "Wide feet? Our adjustable strap accommodates wider widths comfortably.",
  ];
  return (
    <div className="flex flex-col">
      <div className="border-b border-border px-5 pb-3 pt-4 sm:px-6 sm:pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-extrabold tracking-tight text-[hsl(var(--text-strong))] sm:text-[19px]">
              Expert Sizing Tips
            </h2>
            <p className="mt-1 text-[12.5px] text-[hsl(var(--text-mute))] sm:text-[13px]">
              Trusted by thousands to find the perfect fit.
            </p>
          </div>
          {!isMobile && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1.5 text-[hsl(var(--text-mute))] transition-colors hover:bg-secondary hover:text-[hsl(var(--text-strong))]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <ul className="space-y-2 px-5 py-4 sm:px-6">
        {tips.map((t, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-xl border border-border bg-secondary/40 px-3 py-3"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--order-blue))] text-white">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <span className="text-[13.5px] leading-snug text-[hsl(var(--text-body))]">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                             */
/* -------------------------------------------------------------------------- */

export function SizingDialogs({ sizes, selectedSize }: SizingDialogsProps) {
  const [chartOpen, setChartOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const { country } = useGeo();
  const isMobile = useIsMobile();

  const detectedRegion = useMemo<Region | null>(
    () => (country?.code ? regionFor(country.code) : null),
    [country],
  );
  const [region, setRegion] = useState<Region>("US");

  useEffect(() => {
    if (detectedRegion) setRegion(detectedRegion);
  }, [detectedRegion]);

  const triggers = (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px] sm:text-[15px]">
      {/* Size chart trigger */}
      {isMobile ? (
        <Sheet open={chartOpen} onOpenChange={setChartOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 font-bold text-[hsl(var(--order-blue))] underline underline-offset-4 decoration-2 hover:opacity-80"
            >
              <Ruler className="h-4 w-4" strokeWidth={2.5} />
              View Size Chart
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="flex max-h-[88vh] flex-col rounded-t-2xl p-0"
          >
            <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-muted" aria-hidden />
            <SizeChartBody
              sizes={sizes}
              selectedSize={selectedSize}
              region={region}
              setRegion={setRegion}
              detectedRegion={detectedRegion}
              isMobile
              onClose={() => setChartOpen(false)}
            />
          </SheetContent>
        </Sheet>
      ) : (
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
          <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
            <SizeChartBody
              sizes={sizes}
              selectedSize={selectedSize}
              region={region}
              setRegion={setRegion}
              detectedRegion={detectedRegion}
              isMobile={false}
              onClose={() => setChartOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      <span className="hidden h-4 w-px bg-[hsl(var(--hairline))] sm:block" aria-hidden />

      {/* Sizing tips trigger */}
      {isMobile ? (
        <Sheet open={tipsOpen} onOpenChange={setTipsOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 font-bold text-[hsl(var(--order-blue))] underline underline-offset-4 decoration-2 hover:opacity-80"
            >
              <Lightbulb className="h-4 w-4" strokeWidth={2.5} />
              Sizing Tips
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl p-0">
            <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-muted" aria-hidden />
            <SizingTipsBody isMobile onClose={() => setTipsOpen(false)} />
          </SheetContent>
        </Sheet>
      ) : (
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
          <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
            <SizingTipsBody isMobile={false} onClose={() => setTipsOpen(false)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );

  return triggers;
}
