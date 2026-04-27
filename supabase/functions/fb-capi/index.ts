// Facebook Conversions API proxy.
// Receives an event from the browser and forwards it to Facebook so
// conversions are tracked even when the browser pixel is blocked.
// Dedupe is achieved by sending the same event_id from both browser & server.

import { corsHeaders } from "@supabase/supabase-js/cors";

const FB_GRAPH_VERSION = "v21.0";

interface CapiPayload {
  event_name: string;
  event_id: string;
  event_time?: number; // unix seconds
  event_source_url?: string;
  custom_data?: Record<string, unknown>;
  user_data?: {
    fbp?: string | null;
    fbc?: string | null;
    em?: string | null; // raw email; will be hashed
    ph?: string | null; // raw phone; will be hashed
  };
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const PIXEL_ID = Deno.env.get("FB_PIXEL_ID");
    const ACCESS_TOKEN = Deno.env.get("FB_CAPI_ACCESS_TOKEN");
    if (!PIXEL_ID || !ACCESS_TOKEN) {
      return new Response(
        JSON.stringify({ error: "FB_PIXEL_ID or FB_CAPI_ACCESS_TOKEN not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const payload = (await req.json()) as CapiPayload;
    if (!payload?.event_name || !payload?.event_id) {
      return new Response(JSON.stringify({ error: "event_name and event_id are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Best-effort client info from headers
    const userAgent = req.headers.get("user-agent") ?? undefined;
    const xff = req.headers.get("x-forwarded-for") ?? "";
    const clientIp = xff.split(",")[0]?.trim() || undefined;

    const userData: Record<string, unknown> = {
      client_user_agent: userAgent,
      client_ip_address: clientIp,
    };
    if (payload.user_data?.fbp) userData.fbp = payload.user_data.fbp;
    if (payload.user_data?.fbc) userData.fbc = payload.user_data.fbc;
    if (payload.user_data?.em) userData.em = [await sha256(payload.user_data.em)];
    if (payload.user_data?.ph) userData.ph = [await sha256(payload.user_data.ph.replace(/\D/g, ""))];

    const fbBody = {
      data: [
        {
          event_name: payload.event_name,
          event_time: payload.event_time ?? Math.floor(Date.now() / 1000),
          event_id: payload.event_id,
          event_source_url: payload.event_source_url,
          action_source: "website",
          user_data: userData,
          custom_data: payload.custom_data ?? {},
        },
      ],
    };

    const url = `https://graph.facebook.com/${FB_GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(
      ACCESS_TOKEN,
    )}`;

    const fbRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fbBody),
    });
    const fbJson = await fbRes.json().catch(() => ({}));

    if (!fbRes.ok) {
      console.error("FB CAPI error", fbRes.status, fbJson);
      return new Response(JSON.stringify({ error: "fb_capi_failed", status: fbRes.status, fb: fbJson }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, fb: fbJson }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("fb-capi unexpected error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
