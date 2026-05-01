import { useEffect, useRef, useState } from "react";
import { Check, ShieldCheck, Star, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { YellowCta } from "./YellowCta";
import { formatMoney } from "@/lib/money";
import { fbTrack, variantNumericId } from "@/lib/fbpixel";
import { pickInsoleVariant, type ShopifyProductData, type ShopifyVariant } from "@/lib/shopify";
import { cn } from "@/lib/utils";

import heroOrange from "@/assets/insole/hero-orange.webp";
import imgFeatures from "@/assets/insole/features.webp";
import imgBenefits from "@/assets/insole/benefits.webp";
import imgClinical from "@/assets/insole/clinically-tested.webp";

interface InsoleUpsellModalProps {
  open: boolean;
  product: ShopifyProductData | null;
  /** Number of pairs of shoes the customer is buying — we match insole qty 1:1. */
  bundleQuantity: number;
  onAccept: (variant: ShopifyVariant, quantity: number) => void;
  onDecline: () => void;
}

const GALLERY = [
  { src: heroOrange, alt: "Orthopedic massage insoles" },
  { src: imgFeatures, alt: "Insole features" },
  { src: imgBenefits, alt: "Insole benefits" },
  { src: imgClinical, alt: "Clinically tested" },
];

const BENEFITS = [
  "Instant arch & heel pain relief",
  "Acupressure massage with every step",
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

  useEffect(() => {
    if (open) {
      setArmed(false);
      setActiveImg(0);
      const t = setTimeout(() => setArmed(true), 500);
      return () => clearTimeout(t);
    }
  }, [open]);

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

  const heroImage = GALLERY[activeImg].src;

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
            "w-[calc(100%-1rem)] max-w-[400px]",
            "max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain",
            "-translate-x-1/2 -translate-y-1/2",
            "rounded-[20px] bg-background",
            "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]",
            "border border-[hsl(var(--hairline))]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            "duration-200",
          )}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {/* Red urgency band */}
          <div className="relative flex items-center justify-center gap-1.5 rounded-t-[20px] bg-[hsl(var(--save-red))] py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white">
            <span
              className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white"
              aria-hidden
            />
            Most customers also added
            <button
              type="button"
              onClick={handleDecline}
              aria-label="Close"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.75} />
            </button>
          </div>

          <div className="px-4 py-3">
            {/* Two-column hero: image left, rating + title + price right */}
            <div className="flex gap-3">
              <div className="shrink-0">
                <div className="aspect-square h-[140px] w-[140px] overflow-hidden rounded-2xl bg-[hsl(24_100%_50%)] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.3)]">
                  <img
                    src={heroImage}
                    alt={GALLERY[activeImg].alt}
                    className="h-full w-full object-cover transition-opacity duration-200"
                    loading="eager"
                  />
                </div>
                {/* Thumbnails under hero */}
                <div className="mt-1.5 flex justify-between gap-1">
                  {GALLERY.map((g, i) => (
                    <button
                      key={g.src}
                      type="button"
                      onClick={() => setActiveImg(i)}
                      aria-label={`View image ${i + 1}`}
                      className={cn(
                        "h-7 w-7 overflow-hidden rounded-md border transition-all",
                        i === activeImg
                          ? "border-[hsl(var(--save-red))] ring-1 ring-[hsl(var(--save-red))]"
                          : "border-[hsl(var(--hairline))] opacity-60 hover:opacity-100",
                      )}
                    >
                      <img src={g.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                {/* Stars + count */}
                <div className="flex items-center gap-1">
                  <div className="flex" aria-label="4.8 out of 5 stars">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-[hsl(var(--verified-green))] text-[hsl(var(--verified-green))]"
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <span className="text-[10.5px] font-semibold text-[hsl(var(--text-mute))]">
                    4.8 · 12,400+
                  </span>
                </div>

                <DialogPrimitive.Title asChild>
                  <h2 className="mt-1 text-[16px] font-extrabold leading-[1.15] tracking-tight text-[hsl(var(--text-strong))]">
                    Orthopedic Massage Insoles
                  </h2>
                </DialogPrimitive.Title>
                <p className="mt-0.5 text-[11.5px] leading-snug text-[hsl(var(--text-mute))]">
                  Slip them in for instant arch support &amp; all-day relief.
                </p>

                <DialogPrimitive.Description className="sr-only">
                  Limited one-time upgrade offer for orthopedic massage insoles.
                </DialogPrimitive.Description>

                {/* Price */}
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-[24px] font-black tabular-nums leading-none text-[hsl(var(--text-strong))]">
                    {formatMoney(unitPrice, currency)}
                  </span>
                  {hasDiscount && (
                    <span className="text-[13px] font-medium tabular-nums text-[hsl(var(--text-mute))] line-through">
                      {formatMoney(compareAt, currency)}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <span className="mt-1 inline-block w-fit rounded-full bg-[hsl(var(--verified-green))] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                    Save {savePct}% today
                  </span>
                )}
              </div>
            </div>

            {/* Benefits */}
            <ul className="mt-3 space-y-1">
              {BENEFITS.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-[12.5px] leading-snug font-medium text-[hsl(var(--text-body))]"
                >
                  <span className="mt-[2px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--verified-green))] text-white">
                    <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* Quantity / total summary */}
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[hsl(var(--hairline))] bg-[hsl(var(--muted))]/40 px-3 py-2">
              <span className="text-[11.5px] leading-tight text-[hsl(var(--text-body))]">
                Adding{" "}
                <strong className="text-[hsl(var(--text-strong))]">
                  {bundleQuantity} pair{bundleQuantity > 1 ? "s" : ""}
                </strong>{" "}
                to your order
              </span>
              <div className="text-right shrink-0">
                <div className="tabular-nums text-[14px] font-extrabold leading-none text-[hsl(var(--text-strong))]">
                  +{formatMoney(totalPrice, currency)}
                </div>
                {totalSaved > 0 && (
                  <div className="mt-0.5 text-[10px] font-semibold tabular-nums text-[hsl(var(--verified-green))]">
                    You save {formatMoney(totalSaved, currency)}
                  </div>
                )}
              </div>
            </div>

            {/* Primary CTA */}
            <div className="mt-3">
              <YellowCta
                label={`Yes, Add for ${formatMoney(totalPrice, currency)}`}
                onClick={() => onAccept(variant, bundleQuantity)}
              />
            </div>

            {/* Trust + decline */}
            <div className="mt-2 flex items-center justify-center gap-1.5 text-[10.5px] text-[hsl(var(--text-mute))]">
              <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
              <span>Same shipping · 60-day money-back guarantee</span>
            </div>

            <button
              type="button"
              onClick={handleDecline}
              className="mt-1.5 block w-full text-center text-[11.5px] font-medium text-[hsl(var(--text-mute))] underline-offset-4 transition-colors hover:text-[hsl(var(--text-body))] hover:underline"
            >
              No thanks, continue without insoles
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
