import { motion } from "framer-motion";
import { BENEFIT_GIFS } from "@/data/images";

export function BenefitGifGrid() {
  return (
    <section className="bg-paper">
      <div className="container-page py-16 lg:py-20">
        <div className="mb-10 text-center">
          <p className="micro-label mb-2">Built for relief</p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
            What VitalWalk® Does Different
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {BENEFIT_GIFS.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="rounded-2xl bg-card p-3 shadow-soft md:p-4"
            >
              <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                <img src={g.src} alt={g.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="mt-3 text-center md:mt-4">
                <p className="font-display text-base font-semibold text-ink md:text-lg">{g.title}</p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground md:text-sm">{g.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
