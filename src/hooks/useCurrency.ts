import { useCallback } from "react";
import { useGeo } from "./useGeo";
import { useVitalWalkProduct } from "./useVitalWalkProduct";
import { formatMoney } from "@/lib/money";

/**
 * Compatibility hook used by the order-page UI. Currency is now sourced
 * directly from Shopify (via @inContext) — no client-side FX math.
 *
 * `format()` takes a USD amount (the page's source-of-truth bundle prices
 * are still authored in USD) and converts it to the localized currency
 * using the ratio between Shopify's localized base price and the USD
 * fallback. This keeps every on-page price in sync with checkout to the
 * cent within rounding (Shopify Markets uses the same rate at checkout).
 */
export function useCurrency() {
  const { country, loading: geoLoading } = useGeo();
  const { data: product, isLoading: productLoading } = useVitalWalkProduct();

  const localizedBase = product
    ? parseFloat(product.priceRange.minVariantPrice.amount)
    : null;
  const currency = product?.priceRange.minVariantPrice.currencyCode ?? "USD";

  // USD reference price (matches Shopify product's USD price). Used to
  // derive the FX rate from any USD amount we display.
  const USD_BASE = 69.95;
  const rate = localizedBase && localizedBase > 0 ? localizedBase / USD_BASE : 1;
  const isConverted = currency !== "USD" && !!localizedBase;

  const format = useCallback(
    (amountUsd: number) => {
      if (!product) return formatMoney(amountUsd, "USD");
      return formatMoney(amountUsd * rate, currency);
    },
    [product, rate, currency],
  );

  const formatUsd = useCallback((amountUsd: number) => formatMoney(amountUsd, "USD"), []);

  return {
    currency,
    rate,
    format,
    formatUsd,
    isConverted,
    loading: geoLoading || productLoading,
    countryFlag: country?.flag ?? "🌍",
  };
}
