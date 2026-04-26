import { cn } from "@/lib/utils";
import { COLOR_FALLBACK_HEX, imageForColor } from "@/data/swatchImages";

interface ColorSwatchProps {
  color: string;
  selected: boolean;
  onSelect: () => void;
}

export function ColorSwatch({ color, selected, onSelect }: ColorSwatchProps) {
  const imgUrl = imageForColor(color, 120);
  const fallback = COLOR_FALLBACK_HEX[color] ?? "#999";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={color}
      aria-pressed={selected}
      title={color}
      className={cn(
        "group relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white p-[3px]",
        "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--order-blue))] focus-visible:ring-offset-2",
        selected
          ? "ring-2 ring-[hsl(var(--order-blue))] ring-offset-2"
          : "ring-1 ring-[hsl(var(--hairline))] hover:ring-[hsl(var(--text-mute))]",
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
    </button>
  );
}
