import { useEffect, useRef, useState } from "react";
import { Check, Sparkles, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { YellowCta } from "./YellowCta";
import { formatMoney } from "@/lib/money";
import { fbTrack, variantNumericId } from "@/lib/fbpixel";
import { pickInsoleVariant, type ShopifyProductData, type ShopifyVariant } from "@/lib/shopify";
import { cn } from "@/lib/utils";

interface InsoleUpsellModalProps {
  open: boolean;
  product: ShopifyProductData | null;
  /** Number of pairs of shoes the customer is buying — we match insole qty 1:1. */
  bundleQuantity: number;
  onAccept: (variant: ShopifyVariant, quantity: number) => void;
  onDecline: () => void;
}

const BENEFITS = [
  "Acupressure massage with every step",
  "Relieves arch, heel & ball-of-foot pain",
  "Fits perfectly inside your VitalWalk shoes",
];

export function InsoleUpsellModal({
  open,
  product,
  bundleQuantity,
  onAccept,
  onDecline,
}: InsoleUpsellModalProps) {
  const variant = pickInsoleVariant(product);
  const viewFiredRef = useRef(false);
  const openedAtRef = useRef<number>(0);
  const [armed, setArmed] = useState(false);

  // Anti-fat-finger: ignore dismiss attempts during the first 600ms.
  useEffect(() => {
    if (open) {
      openedAtRef.current = Date.now();
      setArmed(false);
      const t = setTimeout(() => setArmed(true), 600);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Fire ViewContent once per modal open.
  useEffect(() => {
    if (!open) {
      viewFiredRef.current = false;
      return;
    }
    if (viewFiredRef.current || !product || !variant) return;
    viewFiredRef.current = true;
    const currency = variant.price.currencyCode;
    const value = parseFloat(variant.price.amount);
    fbTrack("ViewContent", {
      customData: {
        content_type: "product",
        content_ids: [variantNumericId(variant.id)],
        content_name: product.title,
        currency,
        value,
      },
    });
  }, [open, product, variant]);

  if (!variant || !product) return null;

  const currency = variant.price.currencyCode;
  const unitPrice = parseFloat(variant.price.amount);
  const compareAt = parseFloat(variant.compareAtPrice?.amount ?? "0");
  const hasDiscount = compareAt > unitPrice;
  const savePct = hasDiscount ? Math.round(((compareAt - unitPrice) / compareAt) * 100) : 0;
  const totalPrice = unitPrice * bundleQuantity;
  const totalCompare = compareAt * bundleQuantity;

  const heroImage = product.images[0]?.url;

  const handleDecline = () => {
    if (!armed) return;
    onDecline();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) handleDecline();
      }}
    >
      <DialogPortal>
        <DialogOverlay className="bg-black/70 backdrop-blur-[2px]" />
        <DialogPrimitive.Content
          onEscapeKeyDown={(e) => {
            if (!armed) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (!armed) e.preventDefault();
          }}
          onInteractOutside={(e) => {
            if (!armed) e.preventDefault();
          }}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-1.5rem)] max-w-[440px]",
            "-translate-x-1/2 -translate-y-1/2",
            "overflow-hidden rounded-[20px] bg-background",
            "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]",
            "border border-[hsl(var(--hairline))]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            "duration-200",
          )}
        >
          {/* Close X */}
          <button
            type="button"
            onClick={handleDecline}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[hsl(var(--text-mute))] transition-colors hover:bg-black/10 hover:text-[hsl(var(--text-strong))]"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>

          {/* Top eyebrow */}
          <div className="flex items-center justify-center gap-1.5 bg-[hsl(var(--order-yellow))] py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[hsl(var(--text-strong))]">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.75} />
            One-time offer — added to your order
          </div>

          <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
            {/* Hero image */}
            {heroImage && (
              <div className="mx-auto mb-3 aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl bg-[hsl(var(--muted))] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]">
                <img
                  src={heroImage}
                  alt={product.title}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            )}

            {/* Title */}
            <DialogPrimitive.Title asChild>
              <h2 className="text-center text-[18px] font-extrabold leading-tight tracking-tight text-[hsl(var(--text-strong))] sm:text-[19px]">
                Add VitalWalk Orthopedic Massage Insoles?
              </h2>
            </DialogPrimitive.Title>

            <DialogPrimitive.Description className="sr-only">
              Limited one-time upgrade offer for orthopedic massage insoles.
            </DialogPrimitive.Description>

            {/* Price block */}
            <div className="mt-3 flex items-baseline justify-center gap-2">
              <span className="text-[28px] font-black tabular-nums leading-none text-[hsl(var(--text-strong))]">
                {formatMoney(unitPrice, currency)}
              </span>
              {hasDiscount && (
                <span className="text-[15px] font-medium tabular-nums text-[hsl(var(--text-mute))] line-through">
                  {formatMoney(compareAt, currency)}
                </span>
              )}
              <span className="text-[12px] font-semibold text-[hsl(var(--text-mute))]">
                / pair
              </span>
            </div>
            {hasDiscount && (
              <div className="mt-2 flex justify-center">
                <span className="rounded-full bg-[hsl(var(--verified))] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-white">
                  Save {savePct}% — today only
                </span>
              </div>
            )}

            {/* Benefits */}
            <ul className="mt-4 space-y-2 rounded-xl border border-[hsl(var(--hairline))] bg-[hsl(var(--muted))]/40 px-4 py-3">
              {BENEFITS.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-2.5 text-[13px] font-medium text-[hsl(var(--text-body))]"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--verified))] text-white">
                    <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            {/* Quantity + total line */}
            <div className="mt-3 rounded-xl border border-[hsl(var(--hairline))] bg-background px-4 py-2.5 text-[12.5px] text-[hsl(var(--text-body))]">
              <div className="flex items-center justify-between">
                <span>
                  Adding{" "}
                  <strong className="text-[hsl(var(--text-strong))]">
                    {bundleQuantity} pair{bundleQuantity > 1 ? "s" : ""}
                  </strong>{" "}
                  to match your order
                </span>
                <span className="tabular-nums font-extrabold text-[hsl(var(--text-strong))]">
                  +{formatMoney(totalPrice, currency)}
                </span>
              </div>
              {hasDiscount && totalCompare > totalPrice && (
                <div className="mt-0.5 flex justify-end">
                  <span className="text-[11px] tabular-nums text-[hsl(var(--text-mute))] line-through">
                    {formatMoney(totalCompare, currency)}
                  </span>
                </div>
              )}
            </div>

            {/* Primary CTA */}
            <div className="mt-4">
              <YellowCta
                label={`Yes — Add & Continue (${formatMoney(totalPrice, currency)})`}
                onClick={() => onAccept(variant, bundleQuantity)}
              />
            </div>

            {/* Decline link */}
            <button
              type="button"
              onClick={handleDecline}
              className="mt-3 block w-full text-center text-[12.5px] font-medium text-[hsl(var(--text-mute))] underline-offset-4 transition-colors hover:text-[hsl(var(--text-body))] hover:underline"
            >
              No thanks, continue without insoles
            </button>

            <p className="mt-3 text-center text-[11px] text-[hsl(var(--text-mute))]">
              Same shipping. Same 60-day guarantee.
            </p>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
