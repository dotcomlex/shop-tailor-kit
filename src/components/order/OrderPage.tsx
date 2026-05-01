import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useVitalWalkBundles, useVitalWalkProduct } from "@/hooks/useVitalWalkProduct";
import { useInsoleProduct } from "@/hooks/useInsoleProduct";
import { useGeo } from "@/hooks/useGeo";
import {
  createCheckoutForLines,
  fetchVitalWalkBundles,
  findVariant,
  pickInsoleVariant,
  type CartLineInput,
  type ShopifyVariant,
} from "@/lib/shopify";
import { fbTrack, variantNumericId } from "@/lib/fbpixel";
import { formatMoney } from "@/lib/money";
import { SiteHeader } from "./SiteHeader";
import { QuantityStep, type Quantity } from "./QuantityStep";
import { ColorSizeStep, type Selection } from "./ColorSizeStep";
import { UpgradeStep } from "./UpgradeStep";
import { InsoleUpsellModal } from "./InsoleUpsellModal";

export function OrderPage() {
  const queryClient = useQueryClient();
  const { data: bundles } = useVitalWalkBundles();
  const { data: product } = useVitalWalkProduct();
  const { country } = useGeo();

  // Default to the 2-pair bundle: it's our highest-margin SKU after CAC and
  // the one we want most users to land on. Selections array auto-resizes
  // via the useEffect below.
  const [quantity, setQuantity] = useState<Quantity>(2);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selections, setSelections] = useState<Selection[]>([{ color: null, size: null }]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const viewContentFiredRef = useRef(false);
  const addToCartFiredRef = useRef(false);

  const step2Ref = useRef<HTMLDivElement | null>(null);
  const step3Ref = useRef<HTMLDivElement | null>(null);

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
  const { bundleTotal, bundleCompare } = useMemo(() => {
    const bp = bundles?.[quantity];
    if (!bp) return { bundleTotal: 0, bundleCompare: 0 };
    const total = parseFloat(bp.priceRange.minVariantPrice.amount);
    const compareRaw = parseFloat(bp.compareAtPriceRange.minVariantPrice.amount);
    const compare = Number.isFinite(compareRaw) && compareRaw > 0 ? compareRaw : total;
    return {
      bundleTotal: Number.isFinite(total) ? total : 0,
      bundleCompare: compare,
    };
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

  const handleCheckout = async () => {
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

    // Pair 1 picks the actual variant on the bundle product.
    const pair1 = selections[0];
    const pair1Variant = findVariant(bundleProduct, pair1.color!, pair1.size!);
    if (!pair1Variant) {
      toast.error(`We couldn't find ${pair1.color} in size ${pair1.size}.`);
      return;
    }
    if (!pair1Variant.availableForSale) {
      toast.error(`${pair1.color} in size ${pair1.size} is currently sold out.`);
      return;
    }

    // PRICE-SYNC GUARD: Before we hand the customer to Shopify, fetch the
    // live bundle prices one more time using the exact same @inContext
    // query the page renders from. If the displayed total no longer matches
    // what Shopify will charge (because FX moved, the merchant updated the
    // product, or the cache is stale), refresh the UI and ask the user to
    // confirm the new price instead of silently sending them to a checkout
    // with a different total than the one on the button.
    setIsCheckingOut(true);
    try {
      const fresh = await fetchVitalWalkBundles(country?.code ?? "US");
      const freshBundle = fresh?.[quantity];
      const freshTotal = freshBundle
        ? parseFloat(freshBundle.priceRange.minVariantPrice.amount)
        : NaN;
      // Only block when the difference is >= 1 cent. Sub-cent differences
      // can never happen with Shopify's 2-decimal currency amounts, so this
      // is effectively "any change at all".
      if (
        Number.isFinite(freshTotal) &&
        Math.abs(freshTotal - bundleTotal) >= 0.01
      ) {
        const freshCurrency = freshBundle!.priceRange.minVariantPrice.currencyCode;
        // Push the fresh data into the cache so the UI re-renders the new
        // number immediately — the customer sees the change before clicking
        // Checkout a second time.
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
      // If the live re-check fails (network blip), fall through and use the
      // already-displayed total. Shopify's cartCreate will still localize
      // correctly via buyerIdentity.countryCode below.
      console.warn("Pre-checkout price sync failed, continuing:", err);
    }

    // Every pair is attached to the single bundle line so fulfillment can see
    // the full bundle breakdown directly in Shopify checkout, admin, and on
    // packing slips. Pair 1 is encoded both in the selected variant and in the
    // line-item properties for clarity; pairs 2+ live in properties only.
    const attributes: Array<{ key: string; value: string }> = [
      { key: "Bundle Type", value: `${quantity}-Pair Bundle` },
      { key: "Total Pairs", value: String(quantity) },
      { key: "Pair 1 Color", value: pair1.color! },
      { key: "Pair 1 Size", value: pair1.size! },
    ];
    for (let i = 1; i < selections.length; i++) {
      const s = selections[i];
      attributes.push({ key: `Pair ${i + 1} Color`, value: s.color! });
      attributes.push({ key: `Pair ${i + 1} Size`, value: s.size! });
    }

    const note = [
      `Bundle: ${quantity} Pairs`,
      ...selections.map((s, i) => `Pair ${i + 1}: ${s.color} / ${s.size}`),
    ].join("\n");

    const lines = [
      {
        variantId: pair1Variant.id,
        quantity: 1, // The bundle product itself is the unit.
        attributes,
      },
    ];

    // Fire InitiateCheckout right before redirecting to Shopify checkout.
    const currency = bundleProduct.priceRange.minVariantPrice.currencyCode;
    fbTrack("InitiateCheckout", {
      customData: {
        content_type: "product",
        content_ids: [variantNumericId(pair1Variant.id)],
        content_name: bundleProduct.title,
        currency,
        value: bundleTotal,
        num_items: quantity,
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
      // Same-tab navigation — avoids the iOS "Allow popups?" prompt entirely.
      // Leave the spinner on while the browser navigates away.
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Checkout failed:", err);
      toast.error("Something went wrong starting checkout. Please try again.");
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[hsl(0_0%_98.5%)]">
      <SiteHeader />

      <main
        className={`container-order flex-1 ${
          currentStep >= 3
            ? "pt-3 pb-32 sm:pt-4 md:pb-16"
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
                onCheckout={handleCheckout}
                isCheckingOut={isCheckingOut}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-[hsl(var(--hairline))] bg-background py-3 sm:py-5">
        <div className="container-edge text-center text-[12px] text-[hsl(var(--text-mute))]">
          © {new Date().getFullYear()} VitalWalk. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
