import { cn } from "@/lib/utils";

const COLOR_SWATCHES: Record<string, string> = {
  Beige: "#C8A882",
  Black: "#1C1C1C",
  Gray: "#7B7B7B",
  Blue: "#3F5E91",
};

interface ColorSwatchProps {
  color: string;
  selected: boolean;
  onSelect: () => void;
}

export function ColorSwatch({ color, selected, onSelect }: ColorSwatchProps) {
  const fill = COLOR_SWATCHES[color] ?? "#999999";
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={color}
      aria-pressed={selected}
      className={cn(
        "relative h-10 w-10 rounded-md border-2 transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--order-blue))] focus-visible:ring-offset-2",
        selected
          ? "border-order-blue scale-105"
          : "border-transparent ring-1 ring-border hover:ring-[hsl(var(--text-mute))]",
      )}
      style={{ backgroundColor: fill }}
    />
  );
}
