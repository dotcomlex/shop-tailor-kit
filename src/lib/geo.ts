// Lightweight client-side country detection with localStorage caching.
// Used to personalize the shipping line and default the size-chart region.

const CACHE_KEY = "vitalwalk_geo_v3";
const OVERRIDE_KEY = "vitalwalk_geo_override";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6h for successful lookups
const FAIL_TTL_MS = 2 * 60 * 1000; // 2 min for failures (so we retry soon)

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

/**
 * Synchronous read used by `useGeo` to hydrate the very first render.
 * Returns the cached country if available (even if slightly stale — we'll
 * revalidate in the background), or the URL/localStorage override, or null.
 */
export function readCachedCountry(): DetectedCountry | null {
  if (typeof window === "undefined") return null;
  const override = readOverride();
  if (override) return override;
  const cached = readCache();
  return cached?.value ?? null;
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

// Server-side geo (Lovable Cloud edge function). First in the chain because
// it's invisible to ad-blockers and corporate firewalls that block public
// IP-geolocation APIs.
async function tryServerGeo(): Promise<DetectedCountry | null> {
  try {
    const url = `https://vsbvrchqdvzwggsrgcrm.supabase.co/functions/v1/geo`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = (await res.json()) as { country?: string; name?: string };
    return buildCountry(data.country ?? "", data.name);
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

async function runProviderChain(): Promise<DetectedCountry | null> {
  // Server-side first — bulletproof against ad-blockers + corporate firewalls.
  const providers = [tryServerGeo, tryIpwhois, tryGeojs, tryIpapi];
  for (const provider of providers) {
    const result = await provider();
    if (result) return result;
  }
  return null;
}

let inflightDetect: Promise<DetectedCountry | null> | null = null;

export async function detectCountry(): Promise<DetectedCountry | null> {
  if (inflightDetect) return inflightDetect;
  inflightDetect = (async () => {
    // 1. Manual override (URL ?country=GB or persisted override) — always wins.
    const override = readOverride();
    if (override) return override;

    // 2. Cached lookup — return immediately for instant first paint.
    const cached = readCache();
    if (cached) {
      // Background re-validate: if the real country differs from cache,
      // update cache + notify subscribers so prices re-render.
      void revalidateInBackground(cached.value?.code ?? null);
      return cached.value;
    }

    // 3. No cache — run the provider chain inline.
    const result = await runProviderChain();
    if (result) {
      writeCache(result);
      return result;
    }

    // All providers failed — cache null briefly so we retry soon.
    console.warn("[geo] All country-detection providers failed; using fallback copy.");
    writeCache(null);
    return null;
  })().finally(() => {
    inflightDetect = null;
  });
  return inflightDetect;
}

const CHANGE_EVENT = "vitalwalk:geo-changed";

let inflightRevalidate: Promise<void> | null = null;
async function revalidateInBackground(cachedCode: string | null) {
  if (inflightRevalidate) return inflightRevalidate;
  // Skip if a manual override is active.
  if (readOverride()) return;
  inflightRevalidate = (async () => {
    const fresh = await runProviderChain();
    if (!fresh) return;
    if (fresh.code !== cachedCode) {
      writeCache(fresh);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(CHANGE_EVENT, { detail: fresh }),
        );
      }
    }
  })().finally(() => {
    inflightRevalidate = null;
  });
  return inflightRevalidate;
}

export const GEO_CHANGE_EVENT = CHANGE_EVENT;

