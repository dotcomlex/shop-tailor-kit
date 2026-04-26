import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { COLOR_FALLBACK_HEX, imageForColor } from "@/data/swatchImages";

interface ColorSwatchProps {
  color: string;
  selected: boolean;
  onSelect: () => void;
}

export function ColorSwatch({ color, selected, onSelect }: ColorSwatchProps) {
  const imgUrl = imageForColor(color, 160);
  const fallback = COLOR_FALLBACK_HEX[color] ?? "#999";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={color}
      aria-pressed={selected}
      title={color}
      className="group flex flex-col items-center gap-2 focus-visible:outline-none"
    >
      <span
        className={cn(
          "relative flex h-[64px] w-[64px] items-center justify-center rounded-full bg-white p-[3px] transition-all duration-150 sm:h-[72px] sm:w-[72px]",
          selected
            ? "ring-[3px] ring-[hsl(var(--order-blue))] ring-offset-2"
            : "ring-1 ring-[hsl(var(--hairline))] group-hover:ring-[hsl(var(--text-mute))] group-focus-visible:ring-2 group-focus-visible:ring-[hsl(var(--order-blue))]",
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
              loading="lazy"
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
      <span
        className={cn(
          "text-[12px] font-bold tracking-tight transition-colors sm:text-[13px]",
          selected ? "text-[hsl(var(--text-strong))]" : "text-[hsl(var(--text-mute))]",
        )}
      >
        {color}
      </span>
    </button>
  );
}
