// Lightweight client-side country detection with localStorage caching.
// Used to personalize the shipping line and default the size-chart region.

const CACHE_KEY = "vitalwalk_geo";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 1 day

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

function readCache(): DetectedCountry | null | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as CachedGeo;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return undefined;
    return parsed.country;
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

export async function detectCountry(): Promise<DetectedCountry | null> {
  const cached = readCache();
  if (cached !== undefined) return cached;

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch("https://ipapi.co/json/", { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) {
      writeCache(null);
      return null;
    }
    const data = (await res.json()) as { country_code?: string; country_name?: string };
    const code = (data.country_code || "").toUpperCase();
    if (!code || code.length !== 2) {
      writeCache(null);
      return null;
    }
    const country: DetectedCountry = {
      code,
      name: NAME_BY_CODE[code] ?? data.country_name ?? code,
      flag: flagFor(code),
    };
    writeCache(country);
    return country;
  } catch {
    writeCache(null);
    return null;
  }
}
