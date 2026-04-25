import { motion } from "framer-motion";
import { Hand, Check } from "lucide-react";
import { PRODUCT_IMAGES } from "@/data/images";
import { CtaButton } from "./CtaButton";

export function PivotBlock() {
  return (
    <section className="relative overflow-hidden bg-grad-warm">
      <div className="container-page py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="container-narrow text-center"
        >
          <Hand className="mx-auto mb-5 h-9 w-9 text-brand" strokeWidth={1.6} />
          <h2 className="font-display text-balance text-4xl font-semibold leading-[1.1] text-ink md:text-5xl">
            It doesn't have to be this way.
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            Thousands of men and women are <span className="font-semibold text-foreground">walking comfortably again</span>.
            Standing without wincing. Getting through the day without their feet fighting back.
          </p>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            The difference? They found the only shoe specifically designed for people with aching, swollen feet —
            whether from <em className="not-italic font-medium text-foreground">diabetes, edema, arthritis, neuropathy</em>,
            or any other condition.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-base font-medium text-foreground shadow-soft">
            <Check className="h-4 w-4 text-accent" strokeWidth={3} />
            A shoe that finally works <em className="not-italic italic">with</em> your feet — not against them
          </div>

          <div className="mx-auto mt-10 max-w-md">
            <CtaButton label="See If VitalWalk Is Right For You" size="lg" />
          </div>
        </motion.div>

        {/* Subtle b-roll image strip below */}
        <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-3xl shadow-lift">
          <img
            src={PRODUCT_IMAGES.bRollWalk}
            alt="Seniors walking comfortably in VitalWalk shoes"
            className="aspect-[16/7] w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
