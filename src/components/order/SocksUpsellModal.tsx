import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, ShieldCheck, Sparkles, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { YellowCta } from "./YellowCta";
import { formatMoney } from "@/lib/money";
import { fbTrack, variantNumericId } from "@/lib/fbpixel";
import {
  pickSocksVariant,
  socksBucketFromShoeSize,
  socksColors,
  socksImageForColor,
  type ShopifyProductData,
  type ShopifyVariant,
  type SocksSizeBucket,
} from "@/lib/shopify";
import { cn } from "@/lib/utils";

import lifestyleFeet from "@/assets/socks/lifestyle-feet.webp";
import lifestyleReduces from "@/assets/socks/lifestyle-reduces.webp";
import lifestyleElle from "@/assets/socks/lifestyle-elle.webp";
import packBlack from "@/assets/socks/pack-black.webp";
import packWhite from "@/assets/socks/pack-white.webp";

const PACK_IMAGE: Record<string, string> = {
  Black: packBlack,
  White: packWhite,
};

const LIFESTYLE_IMAGES: Array<{ src: string; alt: string }> = [
  { src: lifestyleFeet, alt: "Compression, antimicrobial, soft and breathable" },
  { src: lifestyleReduces, alt: "Reduces swelling and discomfort" },
  { src: lifestyleElle, alt: "ELLE: best performing compression socks" },
];

interface ShoeSelectionLite {
  color: string | null;
  size: string | null;
}

interface SocksUpsellModalProps {
  open: boolean;
  product: ShopifyProductData | null;
  shoeSelections: ShoeSelectionLite[];
  onAccept: (variant: ShopifyVariant) => void;
  onDecline: () => void;
}

const BENEFITS = [
  "Eases swollen feet & tired legs",
  "Diabetic-safe, non-binding cuff",
  "Soft, breathable knit · gentle on sensitive skin",
  "Boosts circulation for all-day energy",
  "Stays put without slipping or pinching",
];

const SIZE_BUCKETS: SocksSizeBucket[] = ["S/M", "L/XL"];
const SIZE_HINTS: Record<SocksSizeBucket, string> = {
  "S/M": "US M 5–7.5",
  "L/XL": "US M 8–14",
};

export function SocksUpsellModal({
  open,
  product,
  shoeSelections,
  onAccept,
  onDecline,
}: SocksUpsellModalProps) {
  const viewFiredRef = useRef(false);
  const [armed, setArmed] = useState(false);

  const colors = useMemo(() => socksColors(product), [product]);
  const initialBucket = useMemo<SocksSizeBucket>(
    () => socksBucketFromShoeSize(shoeSelections[0]?.size ?? null),
    [shoeSelections],
  );
  const [bucket, setBucket] = useState<SocksSizeBucket>(initialBucket);
  const [color, setColor] = useState<string>(colors[0] ?? "Black");
  const [colorTouched, setColorTouched] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  // Reset selections each time the modal opens (or shoe selection changes).
  useEffect(() => {
    if (!open) return;
    setArmed(false);
    setBucket(socksBucketFromShoeSize(shoeSelections[0]?.size ?? null));
    setColor(colors[0] ?? "Black");
    setColorTouched(false);
    setActiveImg(0);
    const t = setTimeout(() => setArmed(true), 500);
    return () => clearTimeout(t);
  }, [open, shoeSelections, colors]);

  const variant = useMemo(
    () => pickSocksVariant(product, bucket, color),
    [product, bucket, color],
  );

  // Fire ViewContent once per open.
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

  if (!product || !variant) return null;

  const currency = variant.price.currencyCode;
  const unitPrice = parseFloat(variant.price.amount);
  const compareAt = parseFloat(variant.compareAtPrice?.amount ?? "0");
  const hasDiscount = compareAt > unitPrice;
  const savePct = hasDiscount ? Math.round(((compareAt - unitPrice) / compareAt) * 100) : 0;

  const localPack = PACK_IMAGE[color];
  const fallbackImage = colorTouched
    ? socksImageForColor(product, color)
    : product.images[0] ?? socksImageForColor(product, color);
  const packSrc = localPack ?? fallbackImage?.url ?? "";

  const gallery: Array<{ src: string; alt: string; key: string }> = [
    {
      src: packSrc,
      alt: `${product.title} — ${color}`,
      key: `pack:${color}`,
    },
    ...LIFESTYLE_IMAGES.map((img, i) => ({ src: img.src, alt: img.alt, key: `life:${i}` })),
  ].filter((g) => g.src);

  const safeIdx = Math.min(activeImg, gallery.length - 1);
  const heroItem = gallery[safeIdx];

  const handleDecline = () => {
    if (!armed) return;
    onDecline();
  };

  const handleAccept = () => {
    if (!variant.availableForSale) return;
    onAccept(variant);
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
            "max-h-[calc(100dvh-1rem)] overflow-y-auto overflow-x-hidden overscroll-contain",
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
          {/* Soft cream top band — calm tone, urgent copy */}
          <div
            className="relative rounded-t-[20px] py-2.5 pl-3 pr-9"
            style={{ backgroundColor: "#FDF7F0", color: "hsl(28 35% 22%)" }}
          >
            <div className="flex items-center justify-center gap-1.5 text-center text-[11px] font-extrabold uppercase leading-tight tracking-[0.1em]">
              <Sparkles className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden />
              <span>Last-chance offer · Ends now</span>
            </div>
            <button
              type="button"
              onClick={handleDecline}
              aria-label="Close"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-[hsl(28_35%_22%)] transition-colors hover:bg-black/20"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.75} />
            </button>
          </div>

          <div className="px-4 py-3">
            {/* Two-column hero */}
            <div className="flex gap-3">
              <div className="w-[170px] shrink-0">
                <div
                  className="aspect-square w-[170px] overflow-hidden rounded-2xl shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]"
                  style={{ backgroundColor: "#FDF7F0" }}
                >
                  {heroItem && (
                    <img
                      key={heroItem.key}
                      src={heroItem.src}
                      alt={heroItem.alt}
                      className="h-full w-full object-cover animate-in fade-in-0 duration-200"
                      loading="eager"
                      decoding="async"
                    />
                  )}
                </div>
                {gallery.length > 1 && (
                  <div className="mt-1.5 flex w-full items-center justify-between gap-1">
                    {gallery.map((g, i) => (
                      <button
                        key={g.key}
                        type="button"
                        onClick={() => setActiveImg(i)}
                        aria-label={`View ${g.alt}`}
                        className={cn(
                          "relative h-[36px] w-[36px] shrink-0 overflow-hidden rounded-md border transition-all",
                          i === safeIdx
                            ? "border-[hsl(var(--text-strong))] ring-1 ring-[hsl(var(--text-strong))]"
                            : "border-[hsl(var(--hairline))] opacity-60 hover:opacity-100",
                        )}
                      >
                        <img
                          src={g.src}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <DialogPrimitive.Title asChild>
                  <h2 className="text-balance text-[17.5px] font-extrabold leading-[1.15] tracking-tight text-[hsl(var(--text-strong))]">
                    Compression Socks · 3-Pack
                  </h2>
                </DialogPrimitive.Title>

                <DialogPrimitive.Description className="sr-only">
                  One-time bonus offer for a 3-pack of graduated compression socks.
                </DialogPrimitive.Description>

                {/* Price */}
                <div className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                  <span className="text-[22px] font-black tabular-nums leading-none text-[hsl(var(--text-strong))]">
                    {formatMoney(unitPrice, currency)}
                  </span>
                  {hasDiscount && (
                    <span className="text-[12px] font-medium tabular-nums text-[hsl(var(--text-mute))] line-through">
                      {formatMoney(compareAt, currency)}
                    </span>
                  )}
                  <span className="text-[10.5px] font-semibold text-[hsl(var(--text-mute))]">
                    / 3 pairs
                  </span>
                </div>
                {hasDiscount && (
                  <span className="mt-1 inline-block w-fit rounded-full bg-[hsl(var(--verified-green))] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                    Save {savePct}% today
                  </span>
                )}
              </div>
            </div>

            {/* Benefits */}
            <ul className="mt-4 space-y-1">
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

            {/* Size + Color selectors */}
            <div className="mt-4 space-y-3">
              {/* Size */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--text-mute))]">
                    Size
                  </span>
                  <span className="text-[10px] font-semibold text-[hsl(var(--text-mute))]">
                    Men's US
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {SIZE_BUCKETS.map((b) => {
                    const selected = b === bucket;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBucket(b)}
                        aria-pressed={selected}
                        className={cn(
                          "flex flex-col items-start rounded-xl border px-3 py-2 text-left transition-colors",
                          selected
                            ? "border-[hsl(var(--text-strong))] bg-[hsl(var(--text-strong))] text-white"
                            : "border-[hsl(var(--hairline))] bg-background text-[hsl(var(--text-body))] hover:border-[hsl(var(--text-strong))]",
                        )}
                      >
                        <span className="text-[15px] font-extrabold leading-tight">
                          {b}
                        </span>
                        <span
                          className={cn(
                            "text-[10.5px] font-semibold",
                            selected ? "text-white/80" : "text-[hsl(var(--text-mute))]",
                          )}
                        >
                          {SIZE_HINTS[b]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color */}
              {colors.length > 1 && (
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--text-mute))]">
                      Color
                    </span>
                    <span className="text-[10px] font-semibold text-[hsl(var(--text-mute))]">
                      {color}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {colors.map((c) => {
                      const selected = c === color;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setColor(c);
                            setColorTouched(true);
                            setActiveImg(0);
                          }}
                          aria-pressed={selected}
                          className={cn(
                            "rounded-xl border py-2 text-[13px] font-extrabold leading-none transition-colors",
                            selected
                              ? "border-[hsl(var(--text-strong))] bg-[hsl(var(--text-strong))] text-white"
                              : "border-[hsl(var(--hairline))] bg-background text-[hsl(var(--text-body))] hover:border-[hsl(var(--text-strong))]",
                          )}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Savings line */}
            {hasDiscount && (
              <p className="mt-3 mb-1 text-center text-[11px] font-extrabold uppercase tracking-wider text-[hsl(var(--verified-green))]">
                You save {formatMoney(compareAt - unitPrice, currency)} today
              </p>
            )}

            {/* Primary CTA */}
            <div className={cn(hasDiscount ? "mt-0" : "mt-3")}>
              <YellowCta
                label={`Yes, Add 3 Pairs for ${formatMoney(unitPrice, currency)}`}
                onClick={handleAccept}
              />
            </div>

            {/* Trust + decline */}
            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10.5px] text-[hsl(var(--text-mute))] text-center px-2">
              <ShieldCheck className="h-3 w-3 shrink-0" strokeWidth={2.5} />
              <span>Free shipping · 60-day money-back · Doctor-recommended</span>
            </div>

            <button
              type="button"
              onClick={handleDecline}
              className="mt-3 flex w-full items-center justify-center gap-1 text-center text-[11.5px] font-medium text-[hsl(var(--text-mute))] underline-offset-4 transition-colors hover:text-[hsl(var(--text-body))] hover:underline"
            >
              <span>No thanks, continue to checkout</span>
              <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
