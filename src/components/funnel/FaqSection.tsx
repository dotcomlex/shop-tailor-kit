import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/data/faqs";

export function FaqSection() {
  return (
    <section className="bg-paper">
      <div className="container-page py-20 lg:py-24">
        <div className="mb-10 text-center">
          <p className="micro-label mb-2">Got Questions?</p>
          <h2 className="font-display text-balance text-4xl font-semibold leading-[1.1] text-ink md:text-5xl">
            Everything You Want to Know <em className="not-italic italic text-brand">Before Ordering</em>
          </h2>
        </div>

        <div className="container-narrow">
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-2xl border border-border bg-card px-5 shadow-soft data-[state=open]:shadow-lift"
              >
                <AccordionTrigger className="py-5 text-left font-display text-lg font-semibold text-ink hover:no-underline md:text-xl">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 pr-6 text-[16px] leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
