import { useQuery } from "@tanstack/react-query";
import { fetchInsoleProduct } from "@/lib/shopify";
import { useGeo } from "@/hooks/useGeo";

/**
 * Fetch the orthopedic-insole upsell product, localized to the buyer's
 * country (so the price in the modal matches what Shopify will charge).
 */
export function useInsoleProduct() {
  const { country } = useGeo();
  const code = (country?.code ?? "US").toUpperCase();
  return useQuery({
    queryKey: ["insole-product", code],
    queryFn: () => fetchInsoleProduct(code),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  });
}
