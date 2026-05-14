import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "My feet swell throughout the day. Will these still fit?",
    a: "Yes — DayFlex™ velcro was built for changing feet. Loosen or tighten in 2 seconds without taking the shoe off, even mid-afternoon when swelling peaks. Works with compression socks and accommodates real size changes between morning and evening.",
  },
  {
    q: "I struggle to bend over to tie shoes. Are these easy to put on?",
    a: "Absolutely. The EasyEntry™ opening lays nearly flat so your foot slides in without force or struggle. The wide one-handed velcro straps mean no laces, no bending, no asking for help. Ideal for arthritis, post-surgery recovery, limited mobility, and anyone who's tired of dreading their morning shoes.",
  },
  {
    q: "I have bunions, hammertoes, or very wide feet. Will they rub or blister?",
    a: "No. The WideComfort™ true extra-wide toe box gives your toes real room to spread naturally — not just a slightly roomier 'wide' label. The seamless interior also protects diabetic and sensitive skin, so there's nothing inside to rub against bunions or pressure points.",
  },
  {
    q: "Can I wear them with diabetic socks or compression stockings?",
    a: "Yes. The adjustable straps and extra-wide toe box accommodate diabetic socks, compression stockings, and swelling throughout the day without pinching or cutting off circulation.",
  },
  {
    q: "Can I use my own custom orthotics or insoles?",
    a: "Yes. The cushioned insole is fully removable, so you can drop in your own custom orthotics or medical insoles and still get a perfect fit thanks to the adjustable straps.",
  },
  {
    q: "How fast will my order arrive?",
    a: "Free standard shipping on every order. Most US orders arrive in 5–8 business days. UK, Canada, Australia, and New Zealand typically arrive within 5–6 business days. You'll get a tracking link by email the moment your pair ships.",
  },
  {
    q: "What if they don't fit, or I need a different size?",
    a: "You're fully covered by our 60-day money-back guarantee. If the size isn't right, we'll exchange them free. If you simply don't love them, send them back for a full refund — we email you a prepaid return label, no forms, no restocking fees, no hassle.",
  },
];

export function FaqBlock() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-order-blue-soft">
          <HelpCircle className="h-4 w-4 text-[hsl(var(--order-blue))]" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--order-blue))]">
            Frequently asked
          </p>
          <h3 className="text-[16px] font-extrabold tracking-tight text-[hsl(var(--text-strong))] sm:text-[17px]">
            Everything you need to know
          </h3>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {FAQS.map((item, idx) => (
          <AccordionItem
            key={idx}
            value={`faq-${idx}`}
            className="border-b border-[hsl(var(--hairline))] last:border-b-0"
          >
            <AccordionTrigger className="py-4 text-left text-[14px] font-bold tracking-tight text-[hsl(var(--text-strong))] hover:no-underline sm:text-[14.5px] [&>svg]:text-[hsl(var(--order-blue))]">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-0 text-[13.5px] leading-relaxed text-[hsl(var(--text-body))]">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
