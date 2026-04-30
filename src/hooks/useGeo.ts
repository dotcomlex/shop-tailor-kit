import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  detectCountry,
  GEO_CHANGE_EVENT,
  readCachedCountry,
  type DetectedCountry,
} from "@/lib/geo";

export function useGeo() {
  // Hydrate synchronously from the localStorage cache so React Query can
  // fire the bundle request on the very first render (no extra round-trip
  // waiting for the geo promise to resolve). For brand-new visitors with
  // no cache, country starts as null and we fall back to "US" downstream.
  const [country, setCountry] = useState<DetectedCountry | null>(() =>
    readCachedCountry(),
  );
  const [loading, setLoading] = useState(country === null);
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;
    detectCountry().then((c) => {
      if (!mounted) return;
      setCountry((prev) => {
        // If the resolved country differs from what we hydrated from cache,
        // invalidate the bundle query so prices re-render in the right
        // currency. Same code → no-op (avoids a needless refetch).
        if (prev?.code !== c?.code) {
          queryClient.invalidateQueries({ queryKey: ["vitalwalk-bundles"] });
        }
        return c;
      });
      setLoading(false);
    });

    // Background re-validation may discover the cached country was wrong
    // (e.g. user came in via VPN, then revisited from their real location).
    // When that happens, swap the country and invalidate the Shopify product
    // query so prices re-render in the correct currency.
    const handleChange = (e: Event) => {
      const detail = (e as CustomEvent<DetectedCountry>).detail;
      if (!mounted || !detail) return;
      setCountry(detail);
      // Re-fetch all bundle products in the new country's currency.
      queryClient.invalidateQueries({ queryKey: ["vitalwalk-bundles"] });
    };
    window.addEventListener(GEO_CHANGE_EVENT, handleChange);

    return () => {
      mounted = false;
      window.removeEventListener(GEO_CHANGE_EVENT, handleChange);
    };
  }, [queryClient]);

  return { country, loading };
}

