import { useQuery } from "@tanstack/react-query";
import { fetchSocksProduct } from "@/lib/shopify";
import { useGeo } from "@/hooks/useGeo";

/**
 * Fetch the 3-pack compression-socks upsell product, localized to the
 * buyer's country (so the price in the modal matches checkout).
 */
export function useSocksProduct() {
  const { country } = useGeo();
  const code = (country?.code ?? "US").toUpperCase();
  return useQuery({
    queryKey: ["socks-product", code],
    queryFn: () => fetchSocksProduct(code),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  });
}
