import { X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
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
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white border-0 [&>button]:hidden">
        <div
          className="relative aspect-square w-full overflow-hidden"
          style={{ backgroundColor: fallback }}
        >
          {imgUrl && (
            <img
              src={imgUrl}
              alt={`${color} colorway — full size`}
              className="h-full w-full object-cover"
            />
          )}
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute right-3 top-3 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </DialogPrimitive.Close>
        </div>
      </DialogContent>
    </Dialog>
  );
}
