// Lightweight client-side country detection with localStorage caching.
// Used to personalize the shipping line and default the size-chart region.

const CACHE_KEY = "vitalwalk_geo_v2";
const OVERRIDE_KEY = "vitalwalk_geo_override";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 1 day for successful lookups
const FAIL_TTL_MS = 5 * 60 * 1000; // 5 min for failures (so we retry soon)

export interface DetectedCountry {
  code: string; // ISO-2, e.g. "US", "GB"
  name: string;
  flag: string; // emoji
}

const NAME_BY_CODE: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  GB: "the United Kingdom",
  IE: "Ireland",
  AU: "Australia",
  NZ: "New Zealand",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  BE: "Belgium",
  AT: "Austria",
  PT: "Portugal",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  CH: "Switzerland",
  PL: "Poland",
};

export function flagFor(code: string): string {
  if (!code || code.length !== 2) return "🌍";
  const upper = code.toUpperCase();
  // Regional indicator letters: A=0x1F1E6
  const codePoints = [...upper].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...codePoints);
}

export type Region = "US" | "UK" | "EU" | "AU";

const EU_CODES = new Set([
  "DE","FR","IT","ES","NL","BE","AT","PT","SE","NO","DK","FI","CH","PL",
  "IE","GR","CZ","HU","RO","BG","HR","SK","SI","EE","LT","LV","LU","MT","CY",
]);

export function regionFor(code: string | undefined | null): Region {
  if (!code) return "US";
  const c = code.toUpperCase();
  if (c === "GB") return "UK";
  if (c === "AU" || c === "NZ") return "AU";
  if (EU_CODES.has(c)) return "EU";
  return "US"; // US, CA, fallback
}

export type SizeSystem = "usW" | "usM" | "uk" | "eu";

export function defaultSizeSystem(region: Region): SizeSystem {
  if (region === "UK") return "uk";
  if (region === "EU") return "eu";
  return "usW"; // US/AU/CA/fallback default to Women's US
}

interface CachedGeo {
  ts: number;
  country: DetectedCountry | null;
}

function readCache(): { value: DetectedCountry | null; fresh: boolean } | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as CachedGeo;
    const age = Date.now() - parsed.ts;
    const ttl = parsed.country ? CACHE_TTL_MS : FAIL_TTL_MS;
    if (age > ttl) return undefined;
    return { value: parsed.country, fresh: true };
  } catch {
    return undefined;
  }
}

function writeCache(country: DetectedCountry | null) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ ts: Date.now(), country } satisfies CachedGeo),
    );
  } catch {
    /* noop */
  }
}

function buildCountry(code: string, fallbackName?: string): DetectedCountry | null {
  const c = (code || "").toUpperCase();
  if (!c || c.length !== 2) return null;
  return {
    code: c,
    name: NAME_BY_CODE[c] ?? fallbackName ?? c,
    flag: flagFor(c),
  };
}

function readOverride(): DetectedCountry | null {
  if (typeof window === "undefined") return null;
  try {
    // URL param wins and persists for the rest of the session
    const url = new URL(window.location.href);
    const param = url.searchParams.get("country");
    if (param) {
      const built = buildCountry(param);
      if (built) {
        window.localStorage.setItem(OVERRIDE_KEY, built.code);
        return built;
      }
    }
    const stored = window.localStorage.getItem(OVERRIDE_KEY);
    if (stored) return buildCountry(stored);
  } catch {
    /* noop */
  }
  return null;
}

async function fetchWithTimeout(url: string, ms = 1500): Promise<Response | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

async function tryIpwhois(): Promise<DetectedCountry | null> {
  const res = await fetchWithTimeout("https://ipwho.is/");
  if (!res) return null;
  try {
    const data = (await res.json()) as {
      success?: boolean;
      country_code?: string;
      country?: string;
    };
    if (data.success === false) return null;
    return buildCountry(data.country_code ?? "", data.country);
  } catch {
    return null;
  }
}

async function tryGeojs(): Promise<DetectedCountry | null> {
  const res = await fetchWithTimeout("https://get.geojs.io/v1/ip/country.json");
  if (!res) return null;
  try {
    const data = (await res.json()) as { country?: string; name?: string };
    return buildCountry(data.country ?? "", data.name);
  } catch {
    return null;
  }
}

async function tryIpapi(): Promise<DetectedCountry | null> {
  const res = await fetchWithTimeout("https://ipapi.co/json/", 2500);
  if (!res) return null;
  try {
    const data = (await res.json()) as {
      country_code?: string;
      country_name?: string;
    };
    return buildCountry(data.country_code ?? "", data.country_name);
  } catch {
    return null;
  }
}

export async function detectCountry(): Promise<DetectedCountry | null> {
  // 1. Manual override (URL ?country=GB or persisted override)
  const override = readOverride();
  if (override) return override;

  // 2. Cached lookup
  const cached = readCache();
  if (cached) return cached.value;

  // 3. Multi-provider lookup with failover
  const providers = [tryIpwhois, tryGeojs, tryIpapi];
  for (const provider of providers) {
    const result = await provider();
    if (result) {
      writeCache(result);
      return result;
    }
  }

  // All providers failed — cache null briefly so we retry soon
  // eslint-disable-next-line no-console
  console.warn("[geo] All country-detection providers failed; using fallback copy.");
  writeCache(null);
  return null;
}
