import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { detectCountry, GEO_CHANGE_EVENT, type DetectedCountry } from "@/lib/geo";

export function useGeo() {
  const [country, setCountry] = useState<DetectedCountry | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;
    detectCountry().then((c) => {
      if (!mounted) return;
      setCountry(c);
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
      queryClient.invalidateQueries({ queryKey: ["vitalwalk-product"] });
    };
    window.addEventListener(GEO_CHANGE_EVENT, handleChange);

    return () => {
      mounted = false;
      window.removeEventListener(GEO_CHANGE_EVENT, handleChange);
    };
  }, [queryClient]);

  return { country, loading };
}
