import { Dialog, DialogContent } from "@/components/ui/dialog";
import { COLOR_FALLBACK_HEX, imageForColor } from "@/data/swatchImages";

interface ColorZoomDialogProps {
  color: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ColorZoomDialog({ color, open, onOpenChange }: ColorZoomDialogProps) {
  if (!color) return null;
  const imgUrl = imageForColor(color, 1200);
  const fallback = COLOR_FALLBACK_HEX[color] ?? "#999";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white border-0">
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
      </DialogContent>
    </Dialog>
  );
}
