// Facebook Pixel + Conversions API helper.
// Fires browser fbq event AND POSTs the same event (with the same event_id)
// to our edge function so Facebook can de-dupe and we recover conversions
// from users with ad-blockers / iOS tracking restrictions.

import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const FB_PIXEL_ID = "851134777335081";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "evt_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

export interface TrackOptions {
  customData?: Record<string, unknown>;
  /** Email/phone for advanced matching — will be SHA-256 hashed server-side. */
  userData?: { email?: string; phone?: string };
}

/**
 * Fire a Facebook Pixel event in the browser and mirror it to the
 * Conversions API edge function for server-side coverage.
 */
export async function fbTrack(eventName: string, opts: TrackOptions = {}) {
  const eventId = uuid();
  const customData = opts.customData ?? {};

  // 1. Browser pixel (with eventID for dedupe)
  try {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", eventName, customData, { eventID: eventId });
    }
  } catch (err) {
    console.warn("fbq track failed", err);
  }

  // 2. Server-side via CAPI proxy (fire-and-forget, never block UX)
  try {
    const fbp = getCookie("_fbp");
    const fbc = getCookie("_fbc");
    void supabase.functions.invoke("fb-capi", {
      body: {
        event_name: eventName,
        event_id: eventId,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: typeof window !== "undefined" ? window.location.href : undefined,
        custom_data: customData,
        user_data: {
          fbp,
          fbc,
          em: opts.userData?.email ?? null,
          ph: opts.userData?.phone ?? null,
        },
      },
    });
  } catch (err) {
    console.warn("fb-capi invoke failed", err);
  }

  return eventId;
}

/** Strip "gid://shopify/ProductVariant/12345" → "12345" */
export function variantNumericId(gid: string): string {
  const m = gid.match(/(\d+)$/);
  return m ? m[1] : gid;
}
