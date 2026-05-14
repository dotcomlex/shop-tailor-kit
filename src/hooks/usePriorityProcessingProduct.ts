import { useQuery } from "@tanstack/react-query";
import { fetchPriorityProduct } from "@/lib/shopify";
import { useGeo } from "@/hooks/useGeo";

/**
 * Fetch the Priority Processing add-on product, localized to the buyer's
 * country so its price in the upsell card matches checkout exactly.
 */
export function usePriorityProcessingProduct() {
  const { country } = useGeo();
  const code = (country?.code ?? "US").toUpperCase();
  return useQuery({
    queryKey: ["priority-product", code],
    queryFn: () => fetchPriorityProduct(code),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  });
}
