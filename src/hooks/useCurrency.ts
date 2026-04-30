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
 *
 * To avoid showing a USD price flash to non-US shoppers, `format()` returns
 * "" while we're still resolving geo or the localized Shopify response —
 * UI components should treat "" as a skeleton state.
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
  const USD_BASE = 59.95;
  const rate = localizedBase && localizedBase > 0 ? localizedBase / USD_BASE : 1;
  const isConverted = currency !== "USD" && !!localizedBase;

  // Avoid a wrong-currency flash for non-US visitors: while geo is still
  // resolving OR Shopify's localized response hasn't arrived, return "" so
  // the UI shows a skeleton instead of a USD price that then jumps to EUR/GBP.
  // For US visitors the localized response IS USD, so they see prices instantly
  // once the query resolves (sub-second).
  const format = useCallback(
    (amountUsd: number) => {
      if (geoLoading || !product) return "";
      return formatMoney(amountUsd * rate, currency);
    },
    [geoLoading, product, rate, currency],
  );

  // Dev-only: warn if Shopify silently fell back to USD for a non-US country
  // (means that Market isn't enabled in Shopify Admin → Settings → Markets).
  if (
    import.meta.env.DEV &&
    product &&
    country &&
    country.code !== "US" &&
    currency === "USD"
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      `[currency] Shopify returned USD for country=${country.code}. Enable this market in Shopify Admin → Settings → Markets so prices localize correctly.`,
    );
  }

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
