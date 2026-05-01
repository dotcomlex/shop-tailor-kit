import { useEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseShopifySize, type SizeRow } from "@/data/sizeChart";
import { useGeo } from "@/hooks/useGeo";
import { defaultSizeSystem, regionFor, type SizeSystem } from "@/lib/geo";

interface SizeTileGridProps {
  sizes: string[];
  value: string | null;
  onChange: (value: string) => void;
  disabledSizes?: Set<string>;
}

const STORAGE_KEY = "vitalwalk_size_system";
export const SIZE_SYSTEM_CHANGE_EVENT = "vitalwalk:size-system-change";

const SYSTEM_OPTIONS: Array<{ id: SizeSystem; label: string; short: string }> = [
  { id: "usW", label: "Women's US", short: "W US" },
  { id: "usM", label: "Men's US", short: "M US" },
  { id: "uk", label: "UK", short: "UK" },
  { id: "eu", label: "EU", short: "EU" },
];

function valueFor(parsed: SizeRow, system: SizeSystem): string {
  switch (system) {
    case "usW": return parsed.usW;
    case "usM": return parsed.usM;
    case "uk": return parsed.uk;
    case "eu": return parsed.eu;
  }
}

function readStoredSystem(): SizeSystem | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "usW" || v === "usM" || v === "uk" || v === "eu") return v;
    return null;
  } catch {
    return null;
  }
}

function writeStoredSystem(s: SizeSystem) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, s);
    window.dispatchEvent(new CustomEvent(SIZE_SYSTEM_CHANGE_EVENT, { detail: s }));
  } catch {
    /* noop */
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

  // System: stored choice wins, else geo default. Re-evaluate when geo arrives.
  const [system, setSystem] = useState<SizeSystem>(() => readStoredSystem() ?? "usW");
  const [userPicked, setUserPicked] = useState<boolean>(() => readStoredSystem() !== null);

  useEffect(() => {
    if (!userPicked && country?.code) {
      setSystem(defaultSizeSystem(region));
    }
  }, [country?.code, region, userPicked]);

  const handleSystemChange = (s: SizeSystem) => {
    setSystem(s);
    setUserPicked(true);
    writeStoredSystem(s);
  };

  const tiles = useMemo(
    () =>
      sizes.map((raw) => {
        const parsed = parseShopifySize(raw);
        return {
          raw,
          parsed,
          display: valueFor(parsed, system),
          disabled: disabledSizes?.has(raw) ?? false,
        };
      }),
    [sizes, system, disabledSizes],
  );

  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const segRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onTileKeyDown = (e: React.KeyboardEvent, idx: number) => {
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

  const onSegKeyDown = (e: React.KeyboardEvent, idx: number) => {
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % SYSTEM_OPTIONS.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + SYSTEM_OPTIONS.length) % SYSTEM_OPTIONS.length;
    else return;
    e.preventDefault();
    segRefs.current[next]?.focus();
    handleSystemChange(SYSTEM_OPTIONS[next].id);
  };

  if (sizes.length === 0) {
    return (
      <p className="text-[13px] text-[hsl(var(--text-mute))]">Loading sizes…</p>
    );
  }

  const selectedTile = tiles.find((t) => t.raw === value);

  return (
    <div>
      {/* Region / system picker */}
      <div className="mb-3">
        <p className="mb-2 text-[12px] font-semibold text-[hsl(var(--text-mute))]">
          Show sizes in
        </p>
        <div
          role="radiogroup"
          aria-label="Choose your sizing system"
          className="grid grid-cols-4 gap-1 rounded-xl bg-secondary p-1"
        >
          {SYSTEM_OPTIONS.map((opt, i) => {
            const active = system === opt.id;
            return (
              <button
                key={opt.id}
                ref={(el) => (segRefs.current[i] = el)}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                onClick={() => handleSystemChange(opt.id)}
                onKeyDown={(e) => onSegKeyDown(e, i)}
                className={cn(
                  "relative rounded-lg px-1 py-2 text-[12px] font-extrabold tracking-tight transition-all duration-150",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-1",
                  active
                    ? "bg-[hsl(var(--order-blue))] text-white shadow-sm"
                    : "text-[hsl(var(--text-body))] hover:bg-background/70",
                )}
              >
                <span className="hidden sm:inline">{opt.label}</span>
                <span className="sm:hidden">{opt.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tile grid — one big number per tile */}
      <div
        role="radiogroup"
        aria-label="Select your size — fits both women and men"
        className="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-2.5"
      >
        {tiles.map((t, i) => {
          const selected = value === t.raw;
          return (
            <button
              key={t.raw}
              ref={(el) => (refs.current[i] = el)}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-disabled={t.disabled || undefined}
              aria-label={`Women's US ${t.parsed.usW}, also Men's US ${t.parsed.usM}, UK ${t.parsed.uk}, EU ${t.parsed.eu}${t.disabled ? " — out of stock" : ""}`}
              disabled={t.disabled}
              tabIndex={selected || (!value && i === 0) ? 0 : -1}
              onClick={() => !t.disabled && onChange(t.raw)}
              onKeyDown={(e) => onTileKeyDown(e, i)}
              className={cn(
                "group relative flex aspect-square items-center justify-center rounded-lg border-2 bg-background text-center transition-all duration-150",
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

              <span
                className={cn(
                  "text-[22px] font-extrabold leading-none tabular-nums tracking-tight sm:text-[24px]",
                  selected
                    ? "text-[hsl(var(--order-blue))]"
                    : "text-[hsl(var(--text-strong))]",
                )}
              >
                {t.display}
              </span>
            </button>
          );
        })}
      </div>

      {/* Confirmation strip — full mapping for confidence */}
      {selectedTile && (
        <div
          className="mt-3 flex items-center gap-2 rounded-md bg-[hsl(var(--order-blue-soft))] px-3 py-2 text-[12.5px] font-medium text-[hsl(var(--order-blue))] animate-fade-in"
          role="status"
        >
          <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} />
          <span className="min-w-0 flex-1">
            <span className="font-extrabold">
              Women's US {selectedTile.parsed.usW}
            </span>
            <span className="opacity-60"> = </span>
            <span className="font-extrabold">
              Men's US {selectedTile.parsed.usM}
            </span>
            <span className="opacity-70">
              {" · "}UK {selectedTile.parsed.uk} · EU {selectedTile.parsed.eu}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
