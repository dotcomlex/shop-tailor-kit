import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useVitalWalkBundles, useVitalWalkProduct } from "@/hooks/useVitalWalkProduct";
import { useGeo } from "@/hooks/useGeo";
import { createCheckoutForLines, findVariant } from "@/lib/shopify";
import { fbTrack, variantNumericId } from "@/lib/fbpixel";
import { SiteHeader } from "./SiteHeader";
import { QuantityStep, BUNDLE_OPTIONS, type Quantity } from "./QuantityStep";
import { ColorSizeStep, type Selection } from "./ColorSizeStep";
import { UpgradeStep } from "./UpgradeStep";

export function OrderPage() {
  const { data: bundles } = useVitalWalkBundles();
  const { data: product } = useVitalWalkProduct();
  const { country } = useGeo();

  const [quantity, setQuantity] = useState<Quantity>(1);
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
      const currency = product.priceRange.minVariantPrice.currencyCode;
      const variantIds = selections
        .map((s) => (s.color && s.size ? findVariant(product, s.color, s.size) : undefined))
        .filter((v): v is NonNullable<ReturnType<typeof findVariant>> => !!v)
        .map((v) => variantNumericId(v.id));
      const opt = BUNDLE_OPTIONS.find((o) => o.qty === quantity);
      fbTrack("AddToCart", {
        customData: {
          content_type: "product",
          content_ids: variantIds.length ? variantIds : [product.id.replace(/\D/g, "")],
          content_name: product.title,
          currency,
          value: opt?.total ?? parseFloat(product.priceRange.minVariantPrice.amount),
          num_items: quantity,
        },
      });
    }
    requestAnimationFrame(() => {
      step3Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const { bundleTotal, bundleCompare } = useMemo(() => {
    const opt = BUNDLE_OPTIONS.find((o) => o.qty === quantity);
    return { bundleTotal: opt?.total ?? 0, bundleCompare: opt?.compare ?? 0 };
  }, [quantity]);

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

    // Pairs 2+ are passed as line-item attributes — visible to the customer
    // at checkout, on the order in Shopify admin, and on the packing slip.
    const attributes: Array<{ key: string; value: string }> = [];
    for (let i = 1; i < selections.length; i++) {
      const s = selections[i];
      attributes.push({ key: `Pair ${i + 1} Color`, value: s.color! });
      attributes.push({ key: `Pair ${i + 1} Size`, value: s.size! });
    }

    const lines = [
      {
        variantId: pair1Variant.id,
        quantity: 1, // The bundle product itself is the unit.
        ...(attributes.length ? { attributes } : {}),
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

    setIsCheckingOut(true);
    try {
      const { checkoutUrl, error } = await createCheckoutForLines(
        lines,
        [], // No discount codes — bundle pricing is in the variant itself.
        country?.code ?? "US",
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
