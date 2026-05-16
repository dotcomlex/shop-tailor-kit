import { cn } from "@/lib/utils";
import { Check, Maximize2 } from "lucide-react";
import { COLOR_FALLBACK_HEX, imageForColor } from "@/data/swatchImages";

interface ColorSwatchProps {
  color: string;
  selected: boolean;
  onSelect: () => void;
  onZoom?: () => void;
}

export function ColorSwatch({ color, selected, onSelect, onZoom }: ColorSwatchProps) {
  const imgUrl = imageForColor(color, 320);
  const fallback = COLOR_FALLBACK_HEX[color] ?? "#999";

  return (
    <div className="group relative flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onSelect}
        aria-label={color}
        aria-pressed={selected}
        title={color}
        className="relative focus-visible:outline-none"
      >
        <span
          className={cn(
            "relative flex h-[140px] w-[140px] items-center justify-center rounded-full bg-white p-[2px] transition-all duration-150 sm:h-[160px] sm:w-[160px]",
            selected
              ? "ring-[3px] ring-[hsl(var(--order-blue))] ring-offset-2"
              : "ring-1 ring-black/5 group-hover:ring-2 group-hover:ring-[hsl(var(--text-mute))]/40 group-focus-visible:ring-2 group-focus-visible:ring-[hsl(var(--order-blue))]",
          )}
        >
          <span
            className="block h-full w-full overflow-hidden rounded-full"
            style={{ backgroundColor: fallback }}
          >
            {imgUrl && (
              <img
                src={imgUrl}
                alt=""
                className="h-full w-full object-cover"
                loading="eager"
                // @ts-expect-error - fetchpriority is a valid HTML attribute
                fetchpriority="high"
                decoding="async"
              />
            )}
          </span>
          {selected && (
            <span
              className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--order-blue))] text-white ring-2 ring-white"
              aria-hidden
            >
              <Check className="h-3 w-3" strokeWidth={3.5} />
            </span>
          )}
        </span>
      </button>

      {onZoom && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onZoom();
          }}
          aria-label={`View ${color} full size`}
          className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[hsl(var(--text-strong))] shadow-md ring-1 ring-black/10 transition-transform hover:scale-110 active:scale-95"
        >
          <Maximize2 className="h-4 w-4" strokeWidth={2.5} />
        </button>
      )}

      <span
        className={cn(
          "text-[14px] font-bold tracking-tight transition-colors sm:text-[15px]",
          selected ? "text-[hsl(var(--text-strong))]" : "text-[hsl(var(--text-mute))]",
        )}
      >
        {color}
      </span>
    </div>
  );
}
