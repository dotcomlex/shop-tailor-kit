import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useVitalWalkBundles, useVitalWalkProduct } from "@/hooks/useVitalWalkProduct";
import { useInsoleProduct } from "@/hooks/useInsoleProduct";
import { useSocksProduct } from "@/hooks/useSocksProduct";
import { useGeo } from "@/hooks/useGeo";
import {
  createCheckoutForLines,
  fetchVitalWalkBundles,
  findVariant,
  findBundleVariant,
  pickInsoleVariantForSize,
  type CartLineInput,
  type ShopifyVariant,
} from "@/lib/shopify";
import { fbTrack, variantNumericId } from "@/lib/fbpixel";
import { formatMoney } from "@/lib/money";
import { SiteHeader } from "./SiteHeader";
import { QuantityStep, type Quantity } from "./QuantityStep";
import { ColorSizeStep, type Selection } from "./ColorSizeStep";
import { UpgradeStep } from "./UpgradeStep";

const InsoleUpsellModal = lazy(() =>
  import("./InsoleUpsellModal").then((m) => ({ default: m.InsoleUpsellModal })),
);
const SocksUpsellModal = lazy(() =>
  import("./SocksUpsellModal").then((m) => ({ default: m.SocksUpsellModal })),
);
const RecentPurchaseToasts = lazy(() =>
  import("./RecentPurchaseToasts").then((m) => ({ default: m.RecentPurchaseToasts })),
);

// A/B test flag — controls which upsell appears first after "Complete My Order".
// Flip back to "insoles" to instantly restore the prior insole-first flow.
const UPSELL_PRIMARY: "socks" | "insoles" = "socks";

export function OrderPage() {
  const queryClient = useQueryClient();
  const { data: bundles } = useVitalWalkBundles();
  const { data: product } = useVitalWalkProduct();
  const { data: insoleProduct } = useInsoleProduct();
  const { data: socksProduct } = useSocksProduct();
  const { country } = useGeo();

  // Default to the 2-pair bundle: it's our highest-margin SKU after CAC and
  // the one we want most users to land on. Selections array auto-resizes
  // via the useEffect below.
  const [quantity, setQuantity] = useState<Quantity>(2);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selections, setSelections] = useState<Selection[]>([{ color: null, size: null }]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [upsellOpen, setUpsellOpen] = useState(false);
  const [socksOpen, setSocksOpen] = useState(false);
  const viewContentFiredRef = useRef(false);
  const addToCartFiredRef = useRef(false);

  const step2Ref = useRef<HTMLDivElement | null>(null);
  const step3Ref = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  // Fire ViewContent once when product data is available.
  useEffect(() => {
    if (!product || viewContentFiredRef.current) return;
    viewContentFiredRef.current = true;
    const currency = product.priceRange.minVariantPrice.currencyCode;
    const value = parseFloat(product.priceRange.minVariantPrice.amount);
    fbTrack("ViewContent", {
      customData: {
        content_type: "product",
        content_ids: [product.id.replace(/\D/g, "")],
        content_name: product.title,
        currency,
        value,
      },
    });
  }, [product]);

  // Resize selections when quantity changes
  useEffect(() => {
    setSelections((prev) => {
      if (prev.length === quantity) return prev;
      if (prev.length > quantity) return prev.slice(0, quantity);
      return [...prev, ...Array.from({ length: quantity - prev.length }, () => ({ color: null, size: null }))];
    });
    // If quantity changes, drop the user back to step 2 (must re-select per pair)
    setCurrentStep((s) => (s > 2 ? 2 : s));
  }, [quantity]);

  const handleSelectionUpdate = (index: number, partial: Partial<Selection>) => {
    setSelections((prev) => prev.map((s, i) => (i === index ? { ...s, ...partial } : s)));
  };

  const advanceToStep2 = () => {
    setCurrentStep((s) => (s < 2 ? 2 : s));
    requestAnimationFrame(() => {
      step2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const advanceToStep3 = () => {
    setCurrentStep(3);
    // Fire AddToCart once per session (user finished color+size selection).
    if (!addToCartFiredRef.current && product) {
      addToCartFiredRef.current = true;
      const bundleForPixel = bundles?.[quantity] ?? product;
      const currency = bundleForPixel.priceRange.minVariantPrice.currencyCode;
      const variantIds = selections
        .map((s) => (s.color && s.size ? findVariant(product, s.color, s.size) : undefined))
        .filter((v): v is NonNullable<ReturnType<typeof findVariant>> => !!v)
        .map((v) => variantNumericId(v.id));
      fbTrack("AddToCart", {
        customData: {
          content_type: "product",
          content_ids: variantIds.length ? variantIds : [product.id.replace(/\D/g, "")],
          content_name: product.title,
          currency,
          value: parseFloat(bundleForPixel.priceRange.minVariantPrice.amount),
          num_items: quantity,
        },
      });
    }
    requestAnimationFrame(() => {
      step3Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  // Source of truth for the order summary + sticky bar: Shopify's localized
  // bundle product price. This is the EXACT amount the customer will be
  // charged at checkout — no FX math, no rounding drift.
  // Source of truth for the order summary + sticky bar:
  //   bundleTotal   = bundle product per-pair price × quantity
  //   bundleCompare = 1-pair retail price × quantity (for the strikethrough)
  // Bundle products no longer carry a compare-at — the per-pair variants ARE
  // the discounted price. We synthesize the strike-through on our side using
  // the 1-pair product's price as the "regular" reference.
  const { bundleTotal, bundleCompare } = useMemo(() => {
    const bp = bundles?.[quantity];
    if (!bp) return { bundleTotal: 0, bundleCompare: 0 };
    const perPair = parseFloat(bp.priceRange.minVariantPrice.amount);
    const total = Number.isFinite(perPair) ? perPair * quantity : 0;
    // Strike-through is derived from the advertised bundle discount so the
    // "X% OFF" badge on Step 1 and the savings shown on Step 3 always agree
    // exactly. 1 pair = 70%, 2 pairs = 75%, 3 pairs = 80%.
    const SAVE_PCT: Record<number, number> = { 1: 0.70, 2: 0.75, 3: 0.80 };
    const pct = SAVE_PCT[quantity] ?? 0;
    const compare = pct > 0 && total > 0 ? total / (1 - pct) : total;
    return { bundleTotal: total, bundleCompare: compare };
  }, [bundles, quantity]);

  // Re-fetch the localized bundle prices whenever the user returns to the
  // tab. Catches the case where Shopify Markets revalues FX while the tab
  // sat in the background — without this, the page would happily display a
  // stale price that no longer matches what checkout will charge.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        queryClient.invalidateQueries({ queryKey: ["vitalwalk-bundles"] });
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [queryClient]);

  const handleCheckout = async (extraLines: CartLineInput[] = []) => {
    if (!product) {
      toast.error("Product is still loading. Please wait a moment and try again.");
      return;
    }

    // Pick the bundle product matching the chosen pack size. Each pack size
    // is a separate Shopify product with the bundle price baked into its
    // variants, so checkout shows a single clean line item with the full
    // strike-through (no "Subtotal − Discount" line that makes the savings
    // look small).
    const bundleProduct = bundles?.[quantity];
    if (!bundleProduct) {
      toast.error("Bundle is still loading. Please wait a moment and try again.");
      return;
    }

    // Validate every pair has a color + size selected.
    for (const sel of selections) {
      if (!sel.color || !sel.size) {
        toast.error("Please pick a color and size for every pair.");
        return;
      }
    }

    // Resolve a real Bundle×Color×Size variant for every selected pair.
    // The supplier sees one real variant line per pair (with the correct
    // per-color image already synced in Shopify), no notes to interpret.
    const resolved: Array<{ variant: ShopifyVariant; selection: { color: string; size: string }; pairIndex: number }> = [];
    for (let i = 0; i < selections.length; i++) {
      const s = selections[i];
      const v = findBundleVariant(bundleProduct, quantity, s.color!, s.size!);
      if (!v) {
        toast.error(`We couldn't find ${s.color} in size ${s.size}.`);
        return;
      }
      if (!v.availableForSale) {
        toast.error(`${s.color} in size ${s.size} is currently sold out.`);
        return;
      }
      resolved.push({ variant: v, selection: { color: s.color!, size: s.size! }, pairIndex: i + 1 });
    }
    const pair1Variant = resolved[0].variant;

    // PRICE-SYNC GUARD: refetch live tier price and compare against displayed
    // total (per-pair × quantity). Catches Markets FX drift while the tab
    // sat in the background.
    setIsCheckingOut(true);
    try {
      const fresh = await fetchVitalWalkBundles(country?.code ?? "US");
      const freshBundle = fresh?.[quantity];
      const freshPerPair = freshBundle
        ? parseFloat(freshBundle.priceRange.minVariantPrice.amount)
        : NaN;
      const freshTotal = Number.isFinite(freshPerPair) ? freshPerPair * quantity : NaN;
      if (
        Number.isFinite(freshTotal) &&
        Math.abs(freshTotal - bundleTotal) >= 0.01
      ) {
        const freshCurrency = freshBundle!.priceRange.minVariantPrice.currencyCode;
        queryClient.setQueryData(
          ["vitalwalk-bundles", (country?.code ?? "US").toUpperCase()],
          fresh,
        );
        toast.message("Price updated", {
          description: `New total is ${formatMoney(freshTotal, freshCurrency)}. Tap Checkout again to continue.`,
        });
        setIsCheckingOut(false);
        return;
      }
    } catch (err) {
      console.warn("Pre-checkout price sync failed, continuing:", err);
    }

    // Build cart lines: one line per pair (real variant with correct color
    // image). Identical color+size pairs are merged so the cart stays tidy
    // — supplier still sees a real variant line, just with quantity > 1.
    const note = [
      `Bundle: ${quantity} Pair${quantity > 1 ? "s" : ""}`,
      ...selections.map((s, i) => `Pair ${i + 1}: ${s.color} / ${s.size}`),
    ].join("\n");

    const grouped = new Map<string, { variant: ShopifyVariant; quantity: number; pairs: number[] }>();
    for (const r of resolved) {
      const existing = grouped.get(r.variant.id);
      if (existing) {
        existing.quantity += 1;
        existing.pairs.push(r.pairIndex);
      } else {
        grouped.set(r.variant.id, { variant: r.variant, quantity: 1, pairs: [r.pairIndex] });
      }
    }
    const bundleLines: CartLineInput[] = Array.from(grouped.values()).map((g) => ({
      variantId: g.variant.id,
      quantity: g.quantity,
      attributes: [{ key: "Pair", value: g.pairs.join(", ") }],
    }));

    const lines: CartLineInput[] = [...bundleLines, ...extraLines];

    // Fire InitiateCheckout right before redirecting to Shopify checkout.
    // Bump the value by any upsell extras so server-side ROAS stays accurate.
    const currency = bundleProduct.priceRange.minVariantPrice.currencyCode;
    const extrasValue = extraLines.reduce((sum, _l) => sum, 0); // placeholder; real value added below
    const upsellValue = extraLines.length
      ? extraLines.reduce((sum, l) => {
          // Look up live price from whichever upsell product owns this variant.
          const v =
            insoleProduct?.variants.find((vv) => vv.id === l.variantId) ??
            socksProduct?.variants.find((vv) => vv.id === l.variantId);
          return sum + (v ? parseFloat(v.price.amount) * l.quantity : 0);
        }, 0)
      : 0;
    void extrasValue;
    fbTrack("InitiateCheckout", {
      customData: {
        content_type: "product",
        content_ids: [
          variantNumericId(pair1Variant.id),
          ...extraLines.map((l) => variantNumericId(l.variantId)),
        ],
        content_name: bundleProduct.title,
        currency,
        value: bundleTotal + upsellValue,
        num_items: quantity + extraLines.reduce((s, l) => s + l.quantity, 0),
      },
    });

    // setIsCheckingOut was already flipped on by the price-sync guard above.
    try {
      const { checkoutUrl, error } = await createCheckoutForLines(
        lines,
        [], // No discount codes — bundle pricing is in the variant itself.
        country?.code ?? "US",
        note,
      );
      if (!checkoutUrl) {
        toast.error(error ?? "Could not create checkout. Please try again.");
        setIsCheckingOut(false);
        return;
      }
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Checkout failed:", err);
      toast.error("Something went wrong starting checkout. Please try again.");
      setIsCheckingOut(false);
    }
  };

  // Two-stage flow: customer clicks Complete Order → modal opens. If the
  // insole product failed to load or has no available variant, skip the
  // modal entirely so we never block a purchase on a non-essential upsell.
  const handleCompleteOrderClick = () => {
    if (UPSELL_PRIMARY === "socks") {
      const hasSocks = !!socksProduct?.variants.some((v) => v.availableForSale);
      if (!hasSocks) {
        void handleCheckout();
        return;
      }
      setSocksOpen(true);
      return;
    }
    const firstSize = selections[0]?.size ?? null;
    const insoleVariant = pickInsoleVariantForSize(insoleProduct ?? null, firstSize);
    if (!insoleVariant || !insoleVariant.availableForSale) {
      void handleCheckout();
      return;
    }
    setUpsellOpen(true);
  };

  const handleUpsellAccept = (
    rows: Array<{ variant: ShopifyVariant; label: string }>,
  ) => {
    setUpsellOpen(false);
    if (rows.length === 0) {
      void handleCheckout();
      return;
    }

    // Aggregate identical variants into single cart lines so the cart stays tidy,
    // but keep a per-variant label for fulfillment context.
    const grouped = new Map<
      string,
      { variant: ShopifyVariant; quantity: number; labels: string[] }
    >();
    for (const r of rows) {
      const existing = grouped.get(r.variant.id);
      if (existing) {
        existing.quantity += 1;
        existing.labels.push(r.label);
      } else {
        grouped.set(r.variant.id, { variant: r.variant, quantity: 1, labels: [r.label] });
      }
    }

    const totalQty = rows.length;
    const totalValue = rows.reduce(
      (sum, r) => sum + parseFloat(r.variant.price.amount),
      0,
    );
    const currency = rows[0].variant.price.currencyCode;

    fbTrack("AddToCart", {
      customData: {
        content_type: "product",
        content_ids: Array.from(grouped.values()).map((g) => variantNumericId(g.variant.id)),
        content_name: insoleProduct?.title ?? "Massage Insoles",
        currency,
        value: totalValue,
        num_items: totalQty,
      },
    });

    const insoleLines: CartLineInput[] = Array.from(grouped.values()).map((g) => ({
      variantId: g.variant.id,
      quantity: g.quantity,
      attributes: [
        { key: "Add-on", value: "Orthopedic Massage Insoles" },
        { key: "Insole Pairs", value: String(g.quantity) },
        { key: "Pair Match", value: g.labels.join(", ") },
      ],
    }));

    void handleCheckout(insoleLines);
  };

  // Customer declined the insole offer. If the socks product is loaded
  // and has at least one buyable variant, show the socks decline-path
  // upsell instead of going straight to checkout.
  const handleUpsellDecline = () => {
    setUpsellOpen(false);
    const hasSocks = !!socksProduct?.variants.some((v) => v.availableForSale);
    if (hasSocks) {
      setSocksOpen(true);
      return;
    }
    void handleCheckout();
  };

  const handleSocksAccept = (variant: ShopifyVariant) => {
    setSocksOpen(false);
    fbTrack("AddToCart", {
      customData: {
        content_type: "product",
        content_ids: [variantNumericId(variant.id)],
        content_name: socksProduct?.title ?? "Compression Socks",
        currency: variant.price.currencyCode,
        value: parseFloat(variant.price.amount),
        num_items: 1,
      },
    });
    const sockLine: CartLineInput = {
      variantId: variant.id,
      quantity: 1,
      attributes: [{ key: "Add-on", value: "Compression Socks (3-pack)" }],
    };
    void handleCheckout([sockLine]);
  };

  const handleSocksDecline = () => {
    setSocksOpen(false);
    void handleCheckout();
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[hsl(0_0%_98.5%)]">
      <SiteHeader />

      <main
        className={`container-order flex-1 ${
          currentStep >= 3
            ? "pt-3 pb-24 sm:pt-4 md:pb-16"
            : "pt-3 pb-3 sm:pt-4 sm:pb-16"
        }`}
      >
        <div className="mx-auto max-w-[640px] space-y-4 md:space-y-8">
          <QuantityStep
            quantity={quantity}
            onQuantityChange={setQuantity}
            onContinue={advanceToStep2}
          />

          <div ref={step2Ref}>
            {currentStep >= 2 && (
              <ColorSizeStep
                product={product ?? null}
                selections={selections}
                onUpdate={handleSelectionUpdate}
                onContinue={advanceToStep3}
              />
            )}
          </div>

          <div ref={step3Ref}>
            {currentStep >= 3 && (
              <UpgradeStep
                total={bundleTotal}
                comparePrice={bundleCompare}
                quantity={quantity}
                onCheckout={handleCompleteOrderClick}
                isCheckingOut={isCheckingOut}
                endRef={footerRef}
              />
            )}
          </div>
        </div>
      </main>

      <footer ref={footerRef} className="border-t border-[hsl(var(--hairline))] bg-background py-3 sm:py-5">
        <div className="container-edge text-center text-[12px] text-[hsl(var(--text-mute))]">
          © {new Date().getFullYear()} VitalWalk. All rights reserved.
        </div>
      </footer>

      <Suspense fallback={null}>
        {(upsellOpen || insoleProduct) && (
          <InsoleUpsellModal
            open={upsellOpen}
            product={insoleProduct ?? null}
            shoeSelections={selections}
            onAccept={handleUpsellAccept}
            onDecline={handleUpsellDecline}
          />
        )}

        {(socksOpen || socksProduct) && (
          <SocksUpsellModal
            open={socksOpen}
            product={socksProduct ?? null}
            shoeSelections={selections}
            onAccept={handleSocksAccept}
            onDecline={handleSocksDecline}
          />
        )}

        <RecentPurchaseToasts paused={currentStep >= 3} />
      </Suspense>
    </div>
  );
}
