# Plan: "Need help?" AI Live Chat (Alyssa)

Wire the existing **Need help?** link in the header to open a friendly, slide-over chat panel that feels like a real human support agent ("Alyssa"), powered by Lovable AI and pre-loaded with VitalWalk product knowledge so it can answer common senior-shopper questions instantly.

---

## What the customer experiences

- Clicks **Need help?** in the header → a smooth panel slides up from the bottom on mobile (right-side sheet on desktop). No page navigation, no form.
- Header of the panel shows **Alyssa** with a friendly profile photo, a green "Online now" dot, and a subtitle like *"VitalWalk Customer Care · Replies in seconds"*.
- An opening message is already there: *"Hi there 👋 I'm Alyssa from VitalWalk. Got a question about sizing, shipping, or your order? I'm right here."*
- 3 tappable **suggested questions** as chips (large, easy targets for older users):
  - "Will these fit my swollen feet?"
  - "How long does shipping take to me?"
  - "What if the size is wrong?"
- Big input at the bottom ("Type your message…") + send button. Enter sends.
- Assistant replies stream in token-by-token with a subtle typing indicator (three pulsing dots) before the first token, so it feels like a real person typing.
- Messages render with markdown (bold, lists) and comfortable senior-friendly font sizes (15–16px).
- Conversation persists in `sessionStorage` for the session so refreshing the page keeps the thread.
- Friendly error toasts for rate-limit (429) and out-of-credits (402).

## Persona & knowledge ("Alyssa")

A single tightly-scoped system prompt living on the backend. Highlights:

- **Identity**: "You are Alyssa, a friendly Customer Care specialist at VitalWalk. You speak warmly and clearly to customers who are typically 50+. Short paragraphs, plain English, no jargon."
- **Scope**: Only answer questions about VitalWalk shoes, sizing, comfort, conditions (edema, bunions, diabetes, arthritis, plantar fasciitis), shipping, returns, and the order process. Politely redirect off-topic questions back to the shoes or to email `support@vitalwalk.store`.
- **Knowledge base** (embedded in the prompt, sourced from the existing FAQ + the two landing pages provided):
  - DayFlex™ adjustable velcro for swelling, EasyEntry™ flat opening, WideComfort™ extra-wide toe box, seamless interior for diabetic/sensitive skin, removable insole compatible with custom orthotics.
  - Sizing guidance: runs true to size; if between sizes, size up; UK ↔ US conversions match the in-app size chart.
  - Shipping: ships within 24h, free standard. US 5–8 business days, UK / CA / AU / NZ 7–12 business days. Tracking emailed when shipped.
  - Returns: 60-day money-back guarantee, free exchanges for sizing, prepaid return label, no restocking fees.
  - Pricing/discount messaging stays generic ("up to 70% off bundles") — no invented prices.
- **Guardrails**: Never make medical claims ("will cure"), never promise specific delivery dates, never share personal/order data. For order-status questions ask for an order number and direct them to email support.
- **Tone rules**: 1–3 short paragraphs, occasional emoji (👍 ❤️ 👟), end with a soft follow-up question to keep conversation flowing.

## Technical implementation

### Backend (Lovable Cloud)

- New edge function `supabase/functions/support-chat/index.ts`:
  - Public (no auth needed) — add `[functions.support-chat] verify_jwt = false` to `supabase/config.toml`.
  - Accepts `{ messages: [{role, content}, ...] }`.
  - Calls Lovable AI Gateway (`https://ai.gateway.lovable.dev/v1/chat/completions`) with `google/gemini-3-flash-preview`, `stream: true`, system prompt prepended on the server.
  - Streams SSE response straight back to the client. Returns clean JSON errors for 429 / 402.

### Frontend

- New file `src/components/support/AlyssaChat.tsx`:
  - Sheet from `@/components/ui/sheet` — `side="bottom"` on mobile (max-h ~85vh, rounded top), `side="right"` (sm:max-w-md) on `sm+` via responsive variant.
  - Avatar (Alyssa profile image — generated portrait, friendly woman ~30s, stored at `/public/alyssa.png` or generated via image gen at build), online dot, header text.
  - Message list with auto-scroll; user bubbles right (blue), Alyssa bubbles left (light grey) with avatar.
  - `react-markdown` for assistant content (already an acceptable dependency to add if missing).
  - Suggested question chips visible until first user message is sent.
  - Input + send button; disabled while streaming; supports Enter to send.
  - Streaming via `fetch` to `${VITE_SUPABASE_URL}/functions/v1/support-chat` with line-by-line SSE parsing per the standard pattern (handles CRLF, partial JSON, `[DONE]`, and final flush).
  - Persists `messages` in `sessionStorage` under `vw_alyssa_chat_v1`.
  - Uses `sonner` toasts for 429 / 402 errors.
- `src/components/support/SupportChatProvider.tsx`: tiny context exposing `openChat()` so the header link (and any future trigger) can open it.
- Wrap the app in `App.tsx` with the provider; mount the `<AlyssaChat />` sheet once at the root so it's available everywhere.

### Header wiring

- Update `src/components/order/SiteHeader.tsx`:
  - Change the `<a href="mailto:…">Need help?</a>` to a `<button>` that calls `openChat()` from the provider.
  - Keep the same icon, label, and styling so nothing visually shifts.

### Alyssa avatar

- Generate a single friendly portrait (warm smile, headshot, neutral background) using Lovable AI image gen and save it to `public/alyssa.png`. Fallback initial "A" avatar if the image fails to load.

### Files to add / edit

- **Add**: `supabase/functions/support-chat/index.ts`, `src/components/support/AlyssaChat.tsx`, `src/components/support/SupportChatProvider.tsx`, `public/alyssa.png`.
- **Edit**: `supabase/config.toml` (verify_jwt for the new function), `src/App.tsx` (mount provider + chat), `src/components/order/SiteHeader.tsx` (wire button to `openChat`).
- **Maybe add dep**: `react-markdown` (only if not already present) for nice formatting.

## Out of scope for this pass

- Persisting conversations to the database, human handoff, file/image uploads, voice input, Shopify order lookups. The system prompt will direct any of those to `support@vitalwalk.store` for now — easy to add later if you want.
