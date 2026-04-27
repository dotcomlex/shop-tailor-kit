# Tighter shipping + realistic typing delay + softer returns language

Three small fixes.

## 1. Shorter, less scary shipping windows

In `supabase/functions/support-chat/index.ts`, update the SHIPPING block:

- US: usually **5 to 6 business days** (was 5–8)
- UK: usually **6 to 7 business days** (was 7–12)
- Canada / AU / NZ: usually **7 to 9 business days** (was 7–12)
- Add: "Keep shipping answers short and reassuring. Don't quote longer windows, it scares people off."
- Add: "Free shipping is on every order, but don't bring it up unless they ask about cost." So when someone asks *how long*, she answers the time only.
- Update the example: "How long does shipping take to UK?" → "Usually 6 to 7 business days. You'll get a tracking link the moment it ships."

## 2. Soften the returns / exchange language

Right now Alyssa promises specifics ("free size exchange", "prepaid return label") that we don't want to commit to in chat. Reword the RETURNS section + matching examples + the "What if it doesn't fit?" objection so it's reassuring but vague on logistics:

- New tone: "If the size isn't right, just shoot us an email at support@vitalwalk.store and we'll get the process started for you. It's quick and easy."
- Keep the **60-day money-back guarantee** mention (it's a strong reassurance), but drop the prepaid-label and "free exchange" specifics.
- Add an explicit rule in the prompt: *"Don't promise specific return logistics like prepaid labels, free exchanges, or refund timing. Just say to email support@vitalwalk.store and the team will start the process. Keep it warm and easy-sounding."*
- Update the worked example for "What if it doesn't fit?" to match.

## 3. Realistic 2–3 second typing delay

In `src/components/support/AlyssaChat.tsx`, after we add the empty assistant placeholder (which triggers the typing-dots bubble) and before the `fetch` call, wait a randomized **2000–3000 ms**:

```ts
await new Promise(r => setTimeout(r, 2000 + Math.random() * 1000));
```

So the customer sees Alyssa "typing" for 2–3 seconds before her message starts streaming in.

## Files
- `supabase/functions/support-chat/index.ts` — update SHIPPING, RETURNS, and matching examples; redeploy.
- `src/components/support/AlyssaChat.tsx` — add the typing delay.
