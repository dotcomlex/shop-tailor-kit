import { useEffect, useState, useCallback } from "react";
import { useGeo } from "./useGeo";
import { currencyForCountry, fetchRates, formatPrice } from "@/lib/currency";

export function useCurrency() {
  const { country, loading: geoLoading } = useGeo();
  const [rates, setRates] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchRates().then((r) => {
      if (mounted) setRates(r);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const currency = currencyForCountry(country?.code);
  const rate = rates?.[currency] ?? 1;
  const isConverted = currency !== "USD" && !!rates;

  const format = useCallback(
    (amountUsd: number) => {
      // While rates load, show USD to avoid flicker between $ and local currency
      if (!rates) return formatPrice(amountUsd, "USD", 1);
      return formatPrice(amountUsd, currency, rate);
    },
    [rates, currency, rate],
  );

  const formatUsd = useCallback((amountUsd: number) => formatPrice(amountUsd, "USD", 1), []);

  return {
    currency,
    rate,
    format,
    formatUsd,
    isConverted,
    loading: geoLoading || !rates,
    countryFlag: country?.flag ?? "🌍",
  };
}
