import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { CtaButton } from "./CtaButton";

export function GuaranteeBlock() {
  return (
    <section className="bg-grad-warm">
      <div className="container-page py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="container-narrow rounded-3xl border border-border bg-card p-8 text-center shadow-lift md:p-12"
        >
          <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-accent/10 ring-4 ring-accent/20">
            <ShieldCheck className="h-12 w-12 text-accent" strokeWidth={1.6} />
            <span className="absolute -bottom-1 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
              60 Days
            </span>
          </div>

          <p className="micro-label mb-3">Risk-Free Promise</p>
          <h2 className="font-display text-balance text-3xl font-semibold leading-[1.15] text-ink md:text-4xl">
            Try Them For 60 Days. <em className="not-italic italic text-brand">Decide Based On Results.</em>
          </h2>
          <div className="mx-auto mt-6 max-w-xl space-y-4 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              We know what you've been through. The products that promised relief and delivered disappointment.
              The purchases that worked for a week and then didn't.
            </p>
            <p className="text-lg font-semibold text-foreground">
              We're not asking you to trust us. We're asking you to test us.
            </p>
            <p>
              Order VitalWalk® today. Wear them for 60 days. If they don't change how you move through your life,
              send them back. <span className="font-semibold text-foreground">Full refund. No questions. No fees.</span>
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-md">
            <CtaButton size="lg" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
