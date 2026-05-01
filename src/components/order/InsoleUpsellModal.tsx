import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, ChevronDown, ShieldCheck, Star, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { YellowCta } from "./YellowCta";
import { formatMoney } from "@/lib/money";
import { fbTrack, variantNumericId } from "@/lib/fbpixel";
import { pickInsoleVariantForSize, type ShopifyProductData, type ShopifyVariant } from "@/lib/shopify";
import { parseShopifySize, type SizeRow } from "@/data/sizeChart";
import { useGeo } from "@/hooks/useGeo";
import { defaultSizeSystem, regionFor, type SizeSystem } from "@/lib/geo";
import { cn } from "@/lib/utils";

import heroPoster from "@/assets/insole/hero-orange-action.png";
import imgWalk from "@/assets/insole/feature-walk.png";
import imgArch from "@/assets/insole/feature-arch.png";
import imgMassage from "@/assets/insole/feature-massage.png";
import imgFits from "@/assets/insole/feature-fits.png";
import imgTrimmable from "@/assets/insole/feature-trimmable.png";

const HERO_VIDEO_SRC = "/videos/insole-hero.mp4";

interface ShoeSelectionLite {
  color: string | null;
  size: string | null;
}

interface InsoleUpsellModalProps {
  open: boolean;
  product: ShopifyProductData | null;
  /** One entry per shoe pair the customer is buying — drives the per-pair size matching. */
  shoeSelections: ShoeSelectionLite[];
  /** Returns one entry per insole pair the customer wants (1:1 with shoe pairs + extras). */
  onAccept: (rows: Array<{ variant: ShopifyVariant; label: string }>) => void;
  onDecline: () => void;
}

type GalleryItem =
  | { kind: "video"; src: string; poster: string; alt: string }
  | { kind: "image"; src: string; alt: string };

const GALLERY: GalleryItem[] = [
  { kind: "video", src: HERO_VIDEO_SRC, poster: heroPoster, alt: "Insoles in action" },
  { kind: "image", src: imgWalk, alt: "Walk in comfort" },
  { kind: "image", src: imgArch, alt: "Arch support" },
  { kind: "image", src: imgMassage, alt: "Massage" },
  { kind: "image", src: imgFits, alt: "Fits any shoe" },
  { kind: "image", src: imgTrimmable, alt: "Trim-to-fit" },
];

const BENEFITS = [
  "Instant arch & heel pain relief",
  "Acupressure massage with every step",
  "Fits perfectly inside your VitalWalk shoes",
];

const SIZE_STORAGE_KEY = "vitalwalk_size_system";

const SYSTEM_LABELS: Record<SizeSystem, string> = {
  usW: "Women's US",
  usM: "Men's US",
  uk: "UK",
  eu: "EU",
};

function readStoredSystem(): SizeSystem | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(SIZE_STORAGE_KEY);
    if (v === "usW" || v === "usM" || v === "uk" || v === "eu") return v;
  } catch {
    /* noop */
  }
  return null;
}

function valueFor(parsed: SizeRow, system: SizeSystem): string {
  switch (system) {
    case "usW": return parsed.usW;
    case "usM": return parsed.usM;
    case "uk": return parsed.uk;
    case "eu": return parsed.eu;
  }
}

interface Row {
  key: string;
  /** Pair index from the shoe step (0-based) — null for user-added extras. */
  sourcePairIndex: number | null;
  variantId: string;
}

let rowKeyCounter = 0;
const nextKey = () => `row-${++rowKeyCounter}`;

export function InsoleUpsellModal({
  open,
  product,
  shoeSelections,
  onAccept,
  onDecline,
}: InsoleUpsellModalProps) {
  const { country } = useGeo();
  const viewFiredRef = useRef(false);
  const [armed, setArmed] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [rows, setRows] = useState<Row[]>([]);
  const [openPickerKey, setOpenPickerKey] = useState<string | null>(null);

  // Match the size system the customer selected on the shoe step.
  const system: SizeSystem = useMemo(
    () => readStoredSystem() ?? defaultSizeSystem(regionFor(country?.code)),
    [country?.code],
  );

  // Build initial rows whenever the modal opens or the shoe selections change.
  useEffect(() => {
    if (!open || !product) return;
    setArmed(false);
    setActiveImg(0);
    setOpenPickerKey(null);

    const initial: Row[] = shoeSelections.map((sel, i) => {
      const v = pickInsoleVariantForSize(product, sel.size);
      return {
        key: nextKey(),
        sourcePairIndex: i,
        variantId: v?.id ?? product.variants[0]?.id ?? "",
      };
    });
    setRows(initial.filter((r) => r.variantId));

    const t = setTimeout(() => setArmed(true), 500);
    return () => clearTimeout(t);
  }, [open, product, shoeSelections]);

  const variantById = useMemo(() => {
    const m = new Map<string, ShopifyVariant>();
    if (product) for (const v of product.variants) m.set(v.id, v);
    return m;
  }, [product]);

  const resolvedRows = useMemo(
    () =>
      rows
        .map((r) => ({ row: r, variant: variantById.get(r.variantId) }))
        .filter((x): x is { row: Row; variant: ShopifyVariant } => Boolean(x.variant)),
    [rows, variantById],
  );

  // Fire ViewContent once per open using the first row's variant.
  useEffect(() => {
    if (!open) {
      viewFiredRef.current = false;
      return;
    }
    if (viewFiredRef.current || !product || resolvedRows.length === 0) return;
    const first = resolvedRows[0].variant;
    viewFiredRef.current = true;
    fbTrack("ViewContent", {
      customData: {
        content_type: "product",
        content_ids: [variantNumericId(first.id)],
        content_name: product.title,
        currency: first.price.currencyCode,
        value: parseFloat(first.price.amount),
      },
    });
  }, [open, product, resolvedRows]);

  if (!product || resolvedRows.length === 0) return null;

  const firstVariant = resolvedRows[0].variant;
  const currency = firstVariant.price.currencyCode;
  const unitPrice = parseFloat(firstVariant.price.amount);
  const compareAt = parseFloat(firstVariant.compareAtPrice?.amount ?? "0");
  const hasDiscount = compareAt > unitPrice;
  const savePct = hasDiscount ? Math.round(((compareAt - unitPrice) / compareAt) * 100) : 0;

  const totalPrice = resolvedRows.reduce(
    (sum, r) => sum + parseFloat(r.variant.price.amount),
    0,
  );
  const totalCompare = resolvedRows.reduce(
    (sum, r) => sum + parseFloat(r.variant.compareAtPrice?.amount ?? r.variant.price.amount),
    0,
  );
  const totalSaved = Math.max(0, totalCompare - totalPrice);

  const activeItem = GALLERY[activeImg];
  const isMulti = shoeSelections.length > 1 || rows.length > 1;

  const handleDecline = () => {
    if (!armed) return;
    onDecline();
  };

  const handleAccept = () => {
    onAccept(
      resolvedRows.map(({ row, variant }) => ({
        variant,
        label: `Pair ${(row.sourcePairIndex ?? 0) + 1}`,
      })),
    );
  };

  const setRowVariant = (key: string, variantId: string) => {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, variantId } : r)));
    setOpenPickerKey(null);
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
                <div className="aspect-square h-[160px] w-[160px] overflow-hidden rounded-2xl bg-[hsl(24_100%_50%)] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.3)]">
                  {activeItem.kind === "video" ? (
                    <video
                      key={activeItem.src}
                      src={activeItem.src}
                      poster={activeItem.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      disableRemotePlayback
                      className="h-full w-full object-cover"
                      aria-label={activeItem.alt}
                    />
                  ) : (
                    <img
                      src={activeItem.src}
                      alt={activeItem.alt}
                      className="h-full w-full object-cover"
                      loading="eager"
                      decoding="async"
                    />
                  )}
                </div>
                {/* Thumbnails under hero */}
                <div className="mt-1.5 flex justify-between gap-1">
                  {GALLERY.map((g, i) => {
                    const thumbSrc = g.kind === "video" ? g.poster : g.src;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImg(i)}
                        aria-label={`View ${g.alt}`}
                        className={cn(
                          "relative h-7 w-7 overflow-hidden rounded-md border transition-all",
                          i === activeImg
                            ? "border-[hsl(var(--save-red))] ring-1 ring-[hsl(var(--save-red))]"
                            : "border-[hsl(var(--hairline))] opacity-60 hover:opacity-100",
                        )}
                      >
                        <img src={thumbSrc} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                        {g.kind === "video" && (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                            <span className="block h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-white" />
                          </span>
                        )}
                      </button>
                    );
                  })}
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
                  <h2 className="mt-1 text-balance text-[16px] font-extrabold leading-[1.15] tracking-tight text-[hsl(var(--text-strong))]">
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
                    / pair
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

            {/* Subtle reassurance */}
            <p className="mt-2 text-center text-[10.5px] text-[hsl(var(--text-mute))]">
              ✂ Trim-to-fit · works in any shoe
            </p>

            {/* Per-pair insole sizes */}
            <div className="mt-3 space-y-1.5">
              {isMulti && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--text-mute))]">
                    Insole sizes · {SYSTEM_LABELS[system]}
                  </span>
                  <span className="text-[10px] font-semibold text-[hsl(var(--text-mute))]">
                    {resolvedRows.length} pair{resolvedRows.length === 1 ? "" : "s"}
                  </span>
                </div>
              )}

              {resolvedRows.map(({ row, variant }) => {
                const isOpen = openPickerKey === row.key;
                const sourcePair =
                  row.sourcePairIndex === null ? null : shoeSelections[row.sourcePairIndex];
                const rowLabel = isMulti
                  ? `Pair ${(row.sourcePairIndex ?? 0) + 1}`
                  : SYSTEM_LABELS[system];
                const sizeText = valueFor(parseShopifySize(variant.title), system);
                const hint = sourcePair?.size ? "Matched to your shoe size" : "Pick size";
                return (
                  <div key={row.key}>
                    <div className="flex items-stretch gap-1.5">
                      <button
                        type="button"
                        onClick={() => setOpenPickerKey(isOpen ? null : row.key)}
                        aria-expanded={isOpen}
                        className="flex flex-1 items-center justify-between gap-2 rounded-xl border border-[hsl(var(--hairline))] bg-[hsl(var(--muted))]/40 px-3 py-2 text-left transition-colors hover:bg-[hsl(var(--muted))]/70"
                      >
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate text-[10px] font-bold uppercase tracking-[0.1em] text-[hsl(var(--text-mute))]">
                            {rowLabel}
                          </span>
                          <span className="truncate text-[14px] font-extrabold leading-tight text-[hsl(var(--text-strong))]">
                            {sizeText}
                            {!isMulti && (
                              <span className="ml-1 text-[10px] font-semibold text-[hsl(var(--text-mute))]">
                                · {hint}
                              </span>
                            )}
                          </span>
                          {isMulti && (
                            <span className="text-[10px] leading-tight text-[hsl(var(--text-mute))]">
                              {hint}
                            </span>
                          )}
                        </span>
                        <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-[hsl(var(--order-blue))]">
                          {isOpen ? "Done" : "Change"}
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 transition-transform",
                              isOpen && "rotate-180",
                            )}
                            strokeWidth={2.75}
                          />
                        </span>
                      </button>
                    </div>

                    {isOpen && (
                      <div className="mt-1.5 grid grid-cols-5 gap-1.5 sm:grid-cols-6">
                        {product.variants.map((v) => {
                          const selected = v.id === variant.id;
                          const disabled = !v.availableForSale;
                          const display = valueFor(parseShopifySize(v.title), system);
                          return (
                            <button
                              key={v.id}
                              type="button"
                              disabled={disabled}
                              onClick={() => setRowVariant(row.key, v.id)}
                              className={cn(
                                "rounded-lg border py-2 text-[13px] font-extrabold tabular-nums leading-none transition-colors",
                                selected
                                  ? "border-[hsl(var(--save-red))] bg-[hsl(var(--save-red))] text-white"
                                  : "border-[hsl(var(--hairline))] bg-background text-[hsl(var(--text-body))] hover:border-[hsl(var(--save-red))]",
                                disabled && "cursor-not-allowed opacity-40",
                              )}
                            >
                              {display}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

            </div>

            {/* Savings line — sits directly above the CTA so it's the last thing the eye catches */}
            {totalSaved > 0 && (
              <p className="mt-3 mb-1 text-center text-[11px] font-extrabold uppercase tracking-wider text-[hsl(var(--verified-green))]">
                You save {formatMoney(totalSaved, currency)} on insoles
              </p>
            )}

            {/* Primary CTA */}
            <div className={cn(totalSaved > 0 ? "mt-0" : "mt-3")}>
              <YellowCta
                label={`Yes, Add for ${formatMoney(totalPrice, currency)}`}
                onClick={handleAccept}
              />
            </div>

            {/* Trust + decline */}
            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10.5px] text-[hsl(var(--text-mute))]">
              <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
              <span>Free shipping · 60-day money-back guarantee</span>
            </div>

            <button
              type="button"
              onClick={handleDecline}
              className="mt-3 flex w-full items-center justify-center gap-1 text-center text-[11.5px] font-medium text-[hsl(var(--text-mute))] underline-offset-4 transition-colors hover:text-[hsl(var(--text-body))] hover:underline"
            >
              <span>No thanks, continue without insoles</span>
              <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
