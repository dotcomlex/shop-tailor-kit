import { useMemo, useRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseShopifySize, type SizeRow } from "@/data/sizeChart";
import { useGeo } from "@/hooks/useGeo";
import { regionFor, type Region } from "@/lib/geo";

interface SizeTileGridProps {
  sizes: string[];
  value: string | null;
  onChange: (value: string) => void;
  disabledSizes?: Set<string>;
}

type TileMode =
  | { kind: "dual"; left: { label: string; value: string }; right: { label: string; value: string } }
  | { kind: "single"; label: string; value: string };

interface TileLabels {
  mode: TileMode;
  ariaLabel: string;
}

function labelsFor(parsed: SizeRow, region: Region): TileLabels {
  switch (region) {
    case "UK":
      // Unisex numbering — show one number, no duplication
      return {
        mode: { kind: "single", label: "UK", value: parsed.uk },
        ariaLabel: `UK ${parsed.uk} (unisex) — EU ${parsed.eu}`,
      };
    case "EU":
      return {
        mode: { kind: "single", label: "EU", value: parsed.eu },
        ariaLabel: `EU ${parsed.eu} (unisex) — UK ${parsed.uk}`,
      };
    case "AU":
      return {
        mode: {
          kind: "dual",
          left: { label: "W", value: parsed.auW },
          right: { label: "M", value: parsed.auM },
        },
        ariaLabel: `Women's AU ${parsed.auW} or Men's AU ${parsed.auM}`,
      };
    default:
      return {
        mode: {
          kind: "dual",
          left: { label: "W", value: parsed.usW },
          right: { label: "M", value: parsed.usM },
        },
        ariaLabel: `Women's US ${parsed.usW} or Men's US ${parsed.usM}`,
      };
  }
}

export function SizeTileGrid({
  sizes,
  value,
  onChange,
  disabledSizes,
}: SizeTileGridProps) {
  const { country } = useGeo();
  const region = regionFor(country?.code);

  const tiles = useMemo(
    () =>
      sizes.map((raw) => {
        const parsed = parseShopifySize(raw);
        return {
          raw,
          parsed,
          labels: labelsFor(parsed, region),
          disabled: disabledSizes?.has(raw) ?? false,
        };
      }),
    [sizes, region, disabledSizes],
  );

  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    const cols = window.matchMedia("(min-width: 640px)").matches ? 5 : 4;
    let next = idx;
    switch (e.key) {
      case "ArrowRight": next = Math.min(idx + 1, tiles.length - 1); break;
      case "ArrowLeft":  next = Math.max(idx - 1, 0); break;
      case "ArrowDown":  next = Math.min(idx + cols, tiles.length - 1); break;
      case "ArrowUp":    next = Math.max(idx - cols, 0); break;
      case "Home":       next = 0; break;
      case "End":        next = tiles.length - 1; break;
      default: return;
    }
    e.preventDefault();
    refs.current[next]?.focus();
  };

  if (sizes.length === 0) {
    return (
      <p className="text-[13px] text-[hsl(var(--text-mute))]">Loading sizes…</p>
    );
  }

  const selectedTile = tiles.find((t) => t.raw === value);

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Select your size — fits both women and men"
        className="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-2.5"
      >
        {tiles.map((t, i) => {
          const selected = value === t.raw;
          const labelClass = cn(
            "text-[10px] font-bold uppercase leading-none tracking-[0.08em]",
            selected
              ? "text-[hsl(var(--order-blue))]/70"
              : "text-[hsl(var(--text-mute))]",
          );
          const numberClass = cn(
            "mt-1 text-[18px] font-extrabold leading-none tabular-nums tracking-tight sm:text-[19px]",
            selected
              ? "text-[hsl(var(--order-blue))]"
              : "text-[hsl(var(--text-strong))]",
          );

          return (
            <button
              key={t.raw}
              ref={(el) => (refs.current[i] = el)}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-disabled={t.disabled || undefined}
              aria-label={`${t.labels.ariaLabel}${t.disabled ? " — out of stock" : ""}`}
              disabled={t.disabled}
              tabIndex={selected || (!value && i === 0) ? 0 : -1}
              onClick={() => !t.disabled && onChange(t.raw)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "group relative flex aspect-[1.35/1] items-center justify-center rounded-lg border-2 bg-background px-1 py-2 text-center transition-all duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2",
                t.disabled
                  ? "cursor-not-allowed border-border opacity-55"
                  : selected
                    ? "border-[hsl(var(--order-blue))] bg-[hsl(var(--order-blue-soft))] shadow-[0_2px_0_0_hsl(var(--order-blue)/0.08)]"
                    : "border-border hover:border-[hsl(var(--text-strong))] hover:bg-secondary/50 active:scale-[0.97]",
              )}
            >
              {/* Strikethrough for disabled */}
              {t.disabled && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-2 rounded-md"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top right, transparent calc(50% - 1px), hsl(var(--text-mute) / 0.55) calc(50% - 1px), hsl(var(--text-mute) / 0.55) calc(50% + 1px), transparent calc(50% + 1px))",
                  }}
                />
              )}

              {/* Selected check badge */}
              {selected && (
                <span
                  aria-hidden
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--order-blue))] text-white shadow-sm animate-scale-in"
                >
                  <Check className="h-3 w-3" strokeWidth={3.5} />
                </span>
              )}

              {t.labels.mode.kind === "single" ? (
                <div className="flex flex-col items-center justify-center">
                  <span className={labelClass}>{t.labels.mode.label}</span>
                  <span className={numberClass}>{t.labels.mode.value}</span>
                </div>
              ) : (
                <div className="flex w-full items-center justify-around gap-1">
                  <div className="flex flex-col items-center">
                    <span className={labelClass}>{t.labels.mode.left.label}</span>
                    <span className={numberClass}>{t.labels.mode.left.value}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={labelClass}>{t.labels.mode.right.label}</span>
                    <span className={numberClass}>{t.labels.mode.right.value}</span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Confirmation strip — shows BOTH women's and men's so every shopper sees their fit */}
      {selectedTile && (
        <div
          className="mt-3 flex items-center gap-2 rounded-md bg-[hsl(var(--order-blue-soft))] px-3 py-2 text-[12.5px] font-medium text-[hsl(var(--order-blue))] animate-fade-in"
          role="status"
        >
          <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} />
          <span className="min-w-0 flex-1">
            <span className="font-extrabold">
              Women's {selectedTile.parsed.usW}
            </span>
            <span className="opacity-60"> = </span>
            <span className="font-extrabold">
              Men's {selectedTile.parsed.usM}
            </span>
            <span className="opacity-70">
              {" · "}EU {selectedTile.parsed.eu} · UK {selectedTile.parsed.uk}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
