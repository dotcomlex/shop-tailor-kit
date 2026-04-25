import { motion } from "framer-motion";
import { PRODUCT_IMAGES } from "@/data/images";
import { useDisplayPrice } from "@/hooks/useVitalWalkProduct";
import { CtaButton } from "./CtaButton";

export function FinalCta() {
  const { price, compareAt, savePct } = useDisplayPrice();

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <img
        src={PRODUCT_IMAGES.bRollWalk}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        loading="lazy"
      />
      <div className="absolute inset-0 -z-10 bg-grad-overlay" />

      <div className="container-page py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="container-narrow text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Limited Inventory · Sale Ends Tonight
          </p>
          <h2 className="mt-4 font-display text-balance text-4xl font-bold leading-[1.05] text-paper md:text-6xl">
            Your Feet Don't Have to Hurt <em className="not-italic italic text-brand">Tomorrow.</em>
          </h2>

          <div className="mt-8 inline-flex flex-wrap items-baseline justify-center gap-x-4 gap-y-2 rounded-2xl bg-paper/10 px-6 py-4 backdrop-blur-md">
            <span className="font-display text-5xl font-bold text-paper">{price}</span>
            <span className="text-xl text-paper/60 line-through">{compareAt}</span>
            <span className="rounded-full bg-brand px-3 py-1 text-sm font-bold text-brand-foreground">
              Save {savePct}%
            </span>
          </div>

          <div className="mx-auto mt-8 max-w-md">
            <CtaButton size="xl" />
          </div>

          <p className="mt-5 text-sm text-paper/70">
            🚚 Free US Shipping · 🔒 Secure Checkout · ↩ 60-Day Money-Back Guarantee
          </p>
        </motion.div>
      </div>
    </section>
  );
}
