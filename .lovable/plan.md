# Alyssa chat: tighter replies + fix duplicate close button

Two quick fixes based on your feedback.

## 1. Fix the duplicate X (close button overlay)

The Radix `Sheet` component renders its own built-in close button in the top-right corner, and we added a custom one in the chat header. They overlap, which is what you're seeing.

Fix: hide the default Radix close button on this specific sheet (one CSS class on `SheetContent`: `[&>button.absolute]:hidden`). Keep our custom white X inside the blue header.

## 2. Make Alyssa punchy, casual, no follow-up questions

Rewrite the system prompt in `supabase/functions/support-chat/index.ts` with these new rules:

**Style rules**
- 1 to 2 sentences ideal, 3 max. Never paragraphs.
- Casual texting tone, like a friend.
- **No em dashes**, no semicolons.
- **No follow-up questions.** Answer, done. Don't keep the chat going.
- No "Great question!" / "Absolutely!" filler.
- No bullet lists unless explicitly asked.
- Goal: give them the answer fast so they hit X and keep buying.

**Expanded knowledge base** (so she can handle almost anything without stalling):
- All key features (DayFlex velcro, EasyEntry, WideComfort toe box, seamless interior, removable insole, memory foam, arch support, non-slip rubber outsole, breathable mesh, machine-washable, unisex).
- Conditions: edema, bunions, hammertoes, wide feet, diabetes/neuropathy, plantar fasciitis, arthritis, post-surgery/limited mobility, heel spurs, flat feet, Morton's neuroma, standing-all-day fatigue, balance issues.
- Sizing: true to size, size up if between sizes / swelling / compression socks. UK ≈ 2 sizes smaller than US Women's, ≈ 1 size smaller than US Men's. Point them to the on-page size chart.
- Shipping: free, ships in 24h, US 5-8 business days, UK/CA/AU/NZ 7-12 business days, tracking on dispatch, never promise specific dates.
- Returns: 60-day money-back, free size exchanges, prepaid label, no restocking fees, email support@vitalwalk.store.
- Pricing: up to 70% off bundles, bigger bundle = bigger discount, one-time payment, secure checkout, all major payment methods.
- Common objections: standing all day, orthotics compatible, slip resistance, arch support, water resistance, machine wash, wide feet, blisters, diabetic skin, weight, durability, men wearing them, returns, shipping origin, site security, no phone (email only).
- Order status: she can't look it up, redirect to support@vitalwalk.store with order number.
- Medical guardrail: never "cure/treat/heal", always "help with / designed for"; defer specifics to their doctor.
- Off-topic: politely steer back or to email support.

**Worked examples** included in the prompt so the model copies the short, casual register (e.g. *"Yep, that's exactly what they're built for. The velcro adjusts in seconds as your feet change through the day. 👍"*).

## Files touched
- `src/components/support/AlyssaChat.tsx` — one className addition to hide the duplicate close button.
- `supabase/functions/support-chat/index.ts` — new system prompt (deploy after edit).
