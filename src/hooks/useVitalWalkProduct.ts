import { useQuery } from "@tanstack/react-query";
import { fetchVitalWalkBundles, type BundleProducts } from "@/lib/shopify";
import { useGeo } from "@/hooks/useGeo";
import { formatMoney } from "@/lib/money";

// Static fallback so the page renders instantly even before the API responds.
// USD-based — only used until Shopify's localized response arrives.
export const STATIC_FALLBACK = {
  price: "64.95",
  compareAtPrice: "199.83",
  currency: "USD",
};

/**
 * Fetches all three pack-size products (1-pair, 2-pair bundle, 3-pair bundle)
 * in a single localized request, then selects which one to use based on the
 * user's chosen quantity. The 1-pair product remains the source of truth for
 * color/size options + imagery in the UI.
 */
export function useVitalWalkBundles() {
  const { country } = useGeo();
  const code = (country?.code ?? "US").toUpperCase();
  return useQuery({
    queryKey: ["vitalwalk-bundles", code],
    queryFn: () => fetchVitalWalkBundles(code),
    // Keep prices fresh: revalidate after 60s, on tab refocus, and on
    // network reconnect so a customer who lingers never sees a stale
    // total before checkout. The pre-checkout guard in OrderPage.tsx is
    // the final safety net — this just makes that guard fire less often.
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  });
}


/**
 * Backwards-compatible hook returning just the 1-pair product. The rest of the
 * UI (color/size step, hero, product panel) keys off this — only the checkout
 * step needs the other two bundles.
 */
export function useVitalWalkProduct() {
  const query = useVitalWalkBundles();
  return {
    ...query,
    data: query.data?.[1] ?? null,
  };
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

export type { BundleProducts };
