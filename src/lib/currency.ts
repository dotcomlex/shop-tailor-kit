// Lightweight client-side currency conversion.
// USD-base rates fetched from open.er-api.com (free, no key).
// Cached in localStorage 6h. Falls back to a static snapshot offline.

const CACHE_KEY = "vitalwalk_fx";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

// ISO-2 country code -> ISO-4217 currency code
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: "USD",
  CA: "CAD",
  GB: "GBP",
  IE: "EUR",
  AU: "AUD",
  NZ: "NZD",
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR", BE: "EUR",
  AT: "EUR", PT: "EUR", FI: "EUR", LU: "EUR", GR: "EUR", MT: "EUR",
  CY: "EUR", SK: "EUR", SI: "EUR", EE: "EUR", LT: "EUR", LV: "EUR",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  CH: "CHF",
  PL: "PLN",
  CZ: "CZK",
  HU: "HUF",
  RO: "RON",
  BG: "BGN",
  HR: "EUR",
};

// Fallback snapshot (USD-base, approx 2025 levels — only used if live fetch fails)
const FALLBACK_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.78, CAD: 1.37, AUD: 1.52, NZD: 1.65,
  SEK: 10.5, NOK: 10.7, DKK: 6.85, CHF: 0.88, PLN: 4.0,
  CZK: 23.0, HUF: 360, RON: 4.6, BGN: 1.8,
};

export function currencyForCountry(code: string | null | undefined): string {
  if (!code) return "USD";
  return COUNTRY_TO_CURRENCY[code.toUpperCase()] ?? "USD";
}

interface CachedFx {
  ts: number;
  rates: Record<string, number>;
}

function readCache(): Record<string, number> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedFx;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.rates;
  } catch {
    return null;
  }
}

function writeCache(rates: Record<string, number>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), rates } satisfies CachedFx));
  } catch {
    /* noop */
  }
}

export async function fetchRates(): Promise<Record<string, number>> {
  const cached = readCache();
  if (cached) return cached;

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch("https://open.er-api.com/v6/latest/USD", { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error("rate fetch failed");
    const data = (await res.json()) as { rates?: Record<string, number> };
    if (!data.rates || typeof data.rates !== "object") throw new Error("no rates");
    writeCache(data.rates);
    return data.rates;
  } catch {
    return FALLBACK_RATES;
  }
}

export function formatPrice(amountUsd: number, currency: string, rate: number): string {
  const converted = amountUsd * rate;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      // Most currencies look right with default fraction digits;
      // override for currencies typically shown without decimals.
      maximumFractionDigits: ["JPY", "HUF"].includes(currency) ? 0 : 2,
    }).format(converted);
  } catch {
    return `$${amountUsd.toFixed(2)}`;
  }
}
