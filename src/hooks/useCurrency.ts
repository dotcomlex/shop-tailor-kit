import { useCallback } from "react";
import { useGeo } from "./useGeo";
import { useVitalWalkProduct } from "./useVitalWalkProduct";
import { formatMoney } from "@/lib/money";

/**
 * Currency hook used by the order-page UI. Currency is sourced directly from
 * Shopify's @inContext response — there is NO client-side FX math anywhere.
 *
 * `format(amount)` takes an amount that is ALREADY in the localized currency
 * (i.e. the same number Shopify will charge at checkout) and formats it with
 * Intl.NumberFormat. Callers MUST pass localized amounts pulled from Shopify
 * product data — never USD constants — otherwise display will drift from
 * what the customer pays.
 *
 * While geo or the localized Shopify response is still loading, `format()`
 * returns "" so the UI shows a skeleton instead of a USD price flash.
 */
export function useCurrency() {
  const { country, loading: geoLoading } = useGeo();
  const { data: product, isLoading: productLoading } = useVitalWalkProduct();

  const currency = product?.priceRange.minVariantPrice.currencyCode ?? "USD";
  const isConverted = currency !== "USD";

  const format = useCallback(
    (amountLocalized: number) => {
      if (geoLoading || !product) return "";
      if (!Number.isFinite(amountLocalized)) return "";
      return formatMoney(amountLocalized, currency);
    },
    [geoLoading, product, currency],
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
    format,
    formatUsd,
    isConverted,
    loading: geoLoading || productLoading,
    countryFlag: country?.flag ?? "🌍",
  };
}
