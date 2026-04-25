import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";
import { PRODUCT_IMAGES } from "@/data/images";

export function PodiatristBlock() {
  return (
    <section className="bg-grad-warm">
      <div className="container-page py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-3xl shadow-lift"
          >
            <img
              src={PRODUCT_IMAGES.doctor}
              alt="Podiatrist holding VitalWalk shoes"
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent/12 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-accent">
              <Stethoscope className="h-3.5 w-3.5" strokeWidth={2.4} />
              Podiatrist-Designed
            </div>
            <h2 className="font-display text-balance text-4xl font-semibold leading-[1.1] text-ink md:text-5xl">
              Recommended by Podiatrists Who <em className="not-italic italic text-brand">Actually Understand</em>
            </h2>
            <div className="mt-6 space-y-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              <p>
                We worked directly with foot specialists who treat severe swelling, edema, and chronic foot pain every single day.
              </p>
              <p>
                They told us the biggest problem they see:{" "}
                <span className="font-semibold text-foreground">
                  patients spending hundreds on solutions that treat feet like they're static
                </span>{" "}
                — one size, all day — when swelling is dynamic and unpredictable.
              </p>
              <p>
                They helped us design shoes that meet clinical podiatric standards while looking like normal footwear.
              </p>
            </div>
            <div className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-soft">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-ink">Medical-Grade Construction</p>
                <p className="text-xs text-muted-foreground">Normal everyday appearance</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
