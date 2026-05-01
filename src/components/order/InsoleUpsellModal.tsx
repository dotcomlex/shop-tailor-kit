import { useEffect, useRef, useState } from "react";
import { Check, ShieldCheck, Star, X } from "lucide-react";
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
  "Targeted acupressure with every step",
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
  const [armed, setArmed] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  // Anti-fat-finger: ignore dismiss attempts during the first 500ms.
  useEffect(() => {
    if (open) {
      setArmed(false);
      setActiveImg(0);
      const t = setTimeout(() => setArmed(true), 500);
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
    fbTrack("ViewContent", {
      customData: {
        content_type: "product",
        content_ids: [variantNumericId(variant.id)],
        content_name: product.title,
        currency: variant.price.currencyCode,
        value: parseFloat(variant.price.amount),
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
  const totalSaved = Math.max(0, totalCompare - totalPrice);

  const images = product.images.slice(0, 4);
  const heroImage = images[activeImg]?.url ?? images[0]?.url;

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
        <DialogOverlay className="bg-black/75 backdrop-blur-[3px]" />
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
            "fixed left-1/2 top-1/2 z-50",
            "w-[calc(100%-1rem)] max-w-[420px]",
            "max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain",
            "-translate-x-1/2 -translate-y-1/2",
            "rounded-[22px] bg-background",
            "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]",
            "border border-[hsl(var(--hairline))]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            "duration-200",
          )}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {/* Top eyebrow / urgency band — close X lives here so it never overlaps content */}
          <div className="relative flex items-center justify-center gap-1.5 rounded-t-[22px] bg-[hsl(var(--order-yellow))] py-2.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[hsl(var(--text-strong))]">
            <span
              className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(var(--text-strong))]"
              aria-hidden
            />
            Most customers also added
            <button
              type="button"
              onClick={handleDecline}
              aria-label="Close"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/15 text-[hsl(var(--text-strong))] transition-colors hover:bg-black/25"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.75} />
            </button>
          </div>

          <div className="px-4 pt-4 pb-4 sm:px-5 sm:pt-5">
            {/* Hero image with thumb strip */}
            {heroImage && (
              <>
                <div className="mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl bg-[hsl(var(--muted))] shadow-[0_10px_30px_-14px_rgba(0,0,0,0.3)]">
                  <img
                    src={heroImage}
                    alt={product.title}
                    className="h-full w-full object-cover transition-opacity duration-200"
                    loading="eager"
                  />
                </div>
                {images.length > 1 && (
                  <div className="mt-2.5 flex justify-center gap-1.5">
                    {images.map((img, i) => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => setActiveImg(i)}
                        aria-label={`View image ${i + 1}`}
                        className={cn(
                          "h-10 w-10 overflow-hidden rounded-lg border-2 transition-all",
                          i === activeImg
                            ? "border-[hsl(var(--order-yellow-deep))] scale-105"
                            : "border-[hsl(var(--hairline))] opacity-65 hover:opacity-100",
                        )}
                      >
                        <img src={img.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Star rating + review count */}
            <div className="mt-3 flex items-center justify-center gap-1.5">
              <div className="flex" aria-label="4.8 out of 5 stars">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-[hsl(var(--order-yellow-deep))] text-[hsl(var(--order-yellow-deep))]"
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <span className="text-[11.5px] font-semibold text-[hsl(var(--text-mute))]">
                4.8 · 12,400+ happy walkers
              </span>
            </div>

            {/* Title */}
            <DialogPrimitive.Title asChild>
              <h2 className="mt-2 text-center text-[19px] font-extrabold leading-[1.15] tracking-tight text-[hsl(var(--text-strong))] sm:text-[20px]">
                Upgrade to Orthopedic Massage Insoles
              </h2>
            </DialogPrimitive.Title>
            <p className="mx-auto mt-1.5 max-w-[300px] text-center text-[12.5px] leading-snug text-[hsl(var(--text-mute))]">
              Slip them inside your VitalWalk shoes for instant arch support and all-day relief.
            </p>

            <DialogPrimitive.Description className="sr-only">
              Limited one-time upgrade offer for orthopedic massage insoles.
            </DialogPrimitive.Description>

            {/* Price block */}
            <div className="mt-3.5 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5">
              <span className="text-[30px] font-black tabular-nums leading-none text-[hsl(var(--text-strong))]">
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
              <div className="mt-1.5 flex justify-center">
                <span className="rounded-full bg-[hsl(var(--verified))] px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wider text-white">
                  Save {savePct}% — order-only price
                </span>
              </div>
            )}

            {/* Benefits */}
            <ul className="mt-3.5 space-y-1.5 rounded-xl border border-[hsl(var(--hairline))] bg-[hsl(var(--muted))]/40 px-3.5 py-2.5">
              {BENEFITS.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-[12.5px] leading-snug font-medium text-[hsl(var(--text-body))]"
                >
                  <span className="mt-[2px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--verified))] text-white">
                    <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* Quantity / total summary */}
            <div className="mt-2.5 rounded-xl border border-[hsl(var(--hairline))] bg-background px-3.5 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[12px] leading-tight text-[hsl(var(--text-body))]">
                  Adding{" "}
                  <strong className="text-[hsl(var(--text-strong))]">
                    {bundleQuantity} pair{bundleQuantity > 1 ? "s" : ""}
                  </strong>{" "}
                  to match your order
                </span>
                <div className="text-right shrink-0">
                  <div className="tabular-nums text-[15px] font-extrabold leading-none text-[hsl(var(--text-strong))]">
                    +{formatMoney(totalPrice, currency)}
                  </div>
                  {totalSaved > 0 && (
                    <div className="mt-0.5 text-[10.5px] font-semibold tabular-nums text-[hsl(var(--verified))]">
                      You save {formatMoney(totalSaved, currency)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Primary CTA */}
            <div className="mt-3.5">
              <YellowCta
                label={`Yes, Add for ${formatMoney(totalPrice, currency)}`}
                onClick={() => onAccept(variant, bundleQuantity)}
              />
            </div>

            {/* Trust micro-row */}
            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-[hsl(var(--text-mute))]">
              <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
              <span>Same shipping · 60-day money-back guarantee</span>
            </div>

            {/* Decline link */}
            <button
              type="button"
              onClick={handleDecline}
              className="mt-2.5 block w-full text-center text-[12px] font-medium text-[hsl(var(--text-mute))] underline-offset-4 transition-colors hover:text-[hsl(var(--text-body))] hover:underline"
            >
              No thanks, continue without insoles
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
