import { motion } from "framer-motion";
import { PRODUCT_IMAGES } from "@/data/images";

export function ProblemBlock() {
  return (
    <section className="bg-background">
      <div className="container-page py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="micro-label mb-4">If this sounds familiar…</p>
            <h2 className="font-display text-balance text-4xl font-semibold leading-[1.1] text-ink md:text-5xl lg:text-[3.25rem]">
              Right now, your feet <em className="not-italic italic text-brand">control everything</em>.
            </h2>
            <div className="mt-7 space-y-4 text-lg leading-relaxed text-muted-foreground">
              <p>What you wear. Where you go. What you can do.</p>
              <p>
                Every shoe squeezes. <span className="font-semibold text-foreground">Every step hurts.</span>{" "}
                You need help just to get dressed.
              </p>
              <p>
                You've tried the stretching. The elevation. The ice packs. The pills.
              </p>
              <p className="text-xl font-semibold text-ink">Nothing gives you your life back.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-lift">
              <img
                src={PRODUCT_IMAGES.legMassage}
                alt="Senior woman dealing with foot pain"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
