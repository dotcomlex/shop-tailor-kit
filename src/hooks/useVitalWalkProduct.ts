import { useQuery } from "@tanstack/react-query";
import { fetchVitalWalkProduct } from "@/lib/shopify";
import { useGeo } from "@/hooks/useGeo";
import { formatMoney } from "@/lib/money";

// Static fallback so the page renders instantly even before the API responds.
// USD-based — only used until Shopify's localized response arrives.
export const STATIC_FALLBACK = {
  price: "69.95",
  compareAtPrice: "233.17",
  currency: "USD",
};

export function useVitalWalkProduct() {
  const { country } = useGeo();
  const code = (country?.code ?? "US").toUpperCase();
  return useQuery({
    queryKey: ["vitalwalk-product", code],
    queryFn: () => fetchVitalWalkProduct(code),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

/**
 * Returns the live (localized) price + compare-at-price formatted in the
 * customer's currency, with a USD fallback so the page never shows blank.
 */
export function useDisplayPrice() {
  const { data } = useVitalWalkProduct();
  const priceMoney = data?.priceRange.minVariantPrice;
  const compareMoney = data?.compareAtPriceRange.minVariantPrice;

  const priceNum = parseFloat(priceMoney?.amount ?? STATIC_FALLBACK.price);
  const compareNum = parseFloat(compareMoney?.amount ?? STATIC_FALLBACK.compareAtPrice);
  const currency = priceMoney?.currencyCode ?? STATIC_FALLBACK.currency;

  const savePct =
    compareNum > 0 ? Math.round(((compareNum - priceNum) / compareNum) * 100) : 0;
  const installmentNum = priceNum / 4;

  return {
    price: formatMoney(priceNum, currency),
    compareAt: formatMoney(compareNum, currency),
    savePct,
    installment: formatMoney(installmentNum, currency),
    currency,
    raw: { price: priceNum, compareAt: compareNum },
  };
}
