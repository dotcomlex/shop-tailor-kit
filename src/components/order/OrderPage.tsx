import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useVitalWalkProduct } from "@/hooks/useVitalWalkProduct";
import { useGeo } from "@/hooks/useGeo";
import { createCheckoutForLines, findVariant } from "@/lib/shopify";
import { fbTrack, variantNumericId } from "@/lib/fbpixel";
import { SiteHeader } from "./SiteHeader";
import { QuantityStep, BUNDLE_OPTIONS, type Quantity } from "./QuantityStep";
import { ColorSizeStep, type Selection } from "./ColorSizeStep";
import { UpgradeStep } from "./UpgradeStep";

export function OrderPage() {
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

    // Resolve each selection into a variant id
    const variantIds: string[] = [];
    for (const sel of selections) {
      if (!sel.color || !sel.size) {
        toast.error("Please pick a color and size for every pair.");
        return;
      }
      const variant = findVariant(product, sel.color, sel.size);
      if (!variant) {
        toast.error(`We couldn't find ${sel.color} in size ${sel.size}.`);
        return;
      }
      if (!variant.availableForSale) {
        toast.error(`${sel.color} in size ${sel.size} is currently sold out.`);
        return;
      }
      variantIds.push(variant.id);
    }

    // Group identical variants into a single line w/ quantity
    const counts = new Map<string, number>();
    for (const id of variantIds) counts.set(id, (counts.get(id) ?? 0) + 1);
    const lines = Array.from(counts.entries()).map(([variantId, quantity]) => ({ variantId, quantity }));

    // Auto-apply the matching bundle discount so cart total = advertised total.
    const discountCodes =
      quantity === 3 ? ["VITALWALK-3PACK"] :
      quantity === 2 ? ["VITALWALK-2PACK"] :
      [];

    // Fire InitiateCheckout right before redirecting to Shopify checkout.
    const currency = product.priceRange.minVariantPrice.currencyCode;
    fbTrack("InitiateCheckout", {
      customData: {
        content_type: "product",
        content_ids: variantIds.map((id) => variantNumericId(id)),
        content_name: product.title,
        currency,
        value: bundleTotal,
        num_items: quantity,
      },
    });

    setIsCheckingOut(true);
    try {
      const { checkoutUrl, error } = await createCheckoutForLines(
        lines,
        discountCodes,
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
