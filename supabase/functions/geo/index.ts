// Returns the requesting client's ISO country code, derived from edge headers.
// Server-side detection bypasses ad-blockers and corporate firewalls that
// commonly break public IP geolocation APIs.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const COUNTRY_TO_FLAG = (code: string) => {
  if (!code || code.length !== 2) return "🌍";
  const upper = code.toUpperCase();
  return String.fromCodePoint(
    ...[...upper].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65)),
  );
};

const NAME_BY_CODE: Record<string, string> = {
  US: "United States", CA: "Canada", GB: "the United Kingdom",
  IE: "Ireland", AU: "Australia", NZ: "New Zealand",
  DE: "Germany", FR: "France", IT: "Italy", ES: "Spain",
  NL: "Netherlands", BE: "Belgium", AT: "Austria", PT: "Portugal",
  SE: "Sweden", NO: "Norway", DK: "Denmark", FI: "Finland",
  CH: "Switzerland", PL: "Poland",
};

function pickHeader(req: Request, names: string[]): string | null {
  for (const name of names) {
    const v = req.headers.get(name);
    if (v && v.length === 2 && /^[A-Za-z]{2}$/.test(v)) return v.toUpperCase();
  }
  return null;
}

async function fallbackIpLookup(ip: string | null): Promise<string | null> {
  if (!ip) return null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1500);
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.success === false) return null;
    const code = data?.country_code;
    return code && /^[A-Za-z]{2}$/.test(code) ? code.toUpperCase() : null;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Try every common edge geo header (covers Cloudflare, Vercel, Fly,
  // Deno Deploy, Supabase edge runtime, etc.)
  let country = pickHeader(req, [
    "cf-ipcountry",
    "x-vercel-ip-country",
    "x-country-code",
    "x-geo-country",
    "fly-client-ip-country",
    "x-appengine-country",
  ]);

  // Fallback: forward the client IP to a public lookup (server-to-server,
  // so ad-blockers can't intercept it).
  if (!country) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      null;
    country = await fallbackIpLookup(ip);
  }

  const code = country ?? "US";
  return new Response(
    JSON.stringify({
      country: code,
      name: NAME_BY_CODE[code] ?? code,
      flag: COUNTRY_TO_FLAG(code),
      source: country ? "edge" : "fallback",
    }),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      status: 200,
    },
  );
});
