import { useQuery } from "@tanstack/react-query";
import { fetchVitalWalkProduct } from "@/lib/shopify";

// Static fallback data so the page renders instantly even before the API responds.
// These match the live Shopify product (verified via shopify--get_product).
export const STATIC_FALLBACK = {
  price: "69.95",
  compareAtPrice: "233.17",
  currency: "USD",
};

export function useVitalWalkProduct() {
  return useQuery({
    queryKey: ["vitalwalk-product"],
    queryFn: fetchVitalWalkProduct,
    staleTime: 1000 * 60 * 5, // 5 min
    retry: 1,
  });
}

/**
 * Returns the live price + compare-at-price formatted as $XX.XX,
 * with a static fallback so the page never shows a blank price.
 */
export function useDisplayPrice() {
  const { data } = useVitalWalkProduct();
  const price = data?.priceRange.minVariantPrice.amount ?? STATIC_FALLBACK.price;
  const compareAt =
    data?.compareAtPriceRange.minVariantPrice.amount ?? STATIC_FALLBACK.compareAtPrice;

  const priceNum = parseFloat(price);
  const compareNum = parseFloat(compareAt);
  const savePct =
    compareNum > 0 ? Math.round(((compareNum - priceNum) / compareNum) * 100) : 0;
  const installment = (priceNum / 4).toFixed(2);

  return {
    price: `$${priceNum.toFixed(2)}`,
    compareAt: `$${compareNum.toFixed(2)}`,
    savePct,
    installment: `$${installment}`,
    raw: { price: priceNum, compareAt: compareNum },
  };
}
