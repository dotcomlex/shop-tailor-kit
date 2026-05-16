import { Dialog, DialogContent } from "@/components/ui/dialog";
import { COLOR_FALLBACK_HEX, imageForColor } from "@/data/swatchImages";
import { YellowCta } from "./YellowCta";

interface ColorZoomDialogProps {
  color: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: () => void;
  isSelected: boolean;
}

export function ColorZoomDialog({
  color,
  open,
  onOpenChange,
  onSelect,
  isSelected,
}: ColorZoomDialogProps) {
  if (!color) return null;
  const imgUrl = imageForColor(color, 1200);
  const fallback = COLOR_FALLBACK_HEX[color] ?? "#999";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white">
        <div
          className="aspect-square w-full overflow-hidden"
          style={{ backgroundColor: fallback }}
        >
          {imgUrl && (
            <img
              src={imgUrl}
              alt={`${color} colorway — full size`}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-[hsl(var(--text-mute))]">
              Colorway
            </p>
            <p className="text-[18px] font-extrabold text-[hsl(var(--text-strong))]">
              {color}
            </p>
          </div>
          <div className="min-w-[140px]">
            <YellowCta
              label={isSelected ? "Selected" : "Select this color"}
              onClick={() => {
                onSelect();
                onOpenChange(false);
              }}
              disabled={isSelected}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
