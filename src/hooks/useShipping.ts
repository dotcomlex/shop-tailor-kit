import { useVitalWalkBundles } from "@/hooks/useVitalWalkProduct";
import { useCurrency } from "@/hooks/useCurrency";

/**
 * Single source of truth for shipping cost displayed across the funnel.
 *
 * Shopify is configured with a "1-Pair Shipping" profile that charges
 * $9.95 USD on every 1-pair variant; the 2-pair and 3-pair bundle
 * products live in the General profile and ship free.
 *
 * The funnel UI is localized — we scale 9.95 USD by the same FX ratio
 * Shopify applied to the 1-pair product so the display always agrees
 * with what the customer is actually charged at checkout.
 */
const SHIPPING_USD = 9.95;
const ONE_PAIR_USD_BASE = 59.95;

export function useShipping(quantity: number) {
  const { data: bundles } = useVitalWalkBundles();
  const { format, loading } = useCurrency();

  const onePairLocalized = bundles?.[1]
    ? parseFloat(bundles[1].priceRange.minVariantPrice.amount)
    : 0;
  const fxRatio =
    onePairLocalized > 0 ? onePairLocalized / ONE_PAIR_USD_BASE : 0;

  const isFree = quantity > 1;
  const cost = isFree ? 0 : fxRatio > 0 ? SHIPPING_USD * fxRatio : 0;
  const formatted =
    isFree ? "FREE" : cost > 0 ? format(cost) : "";

  return {
    cost,
    isFree,
    formatted,
    /** True while we're still waiting on geo / Shopify product data. */
    loading: loading || (!isFree && cost === 0),
  };
}
