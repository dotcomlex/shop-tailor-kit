import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { FEATURE_ROWS, type FeatureRow } from "@/data/features";
import { CtaButton } from "./CtaButton";

function FeatureBand({ feature, index }: { feature: FeatureRow; index: number }) {
  const reverse = index % 2 === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
    >
      <div className="overflow-hidden rounded-3xl bg-card shadow-lift">
        <img src={feature.image} alt={feature.imageAlt} className="aspect-[5/4] w-full object-cover" loading="lazy" />
      </div>
      <div>
        {feature.trademark && (
          <p className="micro-label mb-3 text-brand">{feature.trademark}</p>
        )}
        <h3 className="font-display text-balance text-3xl font-semibold leading-[1.15] text-ink md:text-4xl">
          {feature.title}
        </h3>
        <div className="mt-5 space-y-3 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          {feature.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {feature.highlights && (
          <ul className="mt-5 space-y-2">
            {feature.highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 text-foreground">
                <Check className="h-4 w-4 text-accent" strokeWidth={3} />
                <span className="font-medium">{h}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

export function FeatureRows() {
  return (
    <section className="bg-background">
      <div className="container-page py-20 lg:py-28">
        <div className="space-y-20 lg:space-y-28">
          {FEATURE_ROWS.map((feature, i) => (
            <div key={feature.title}>
              <FeatureBand feature={feature} index={i} />
              {i === 2 && (
                <div className="mx-auto mt-16 max-w-md">
                  <CtaButton size="lg" label="Choose My Size & Color" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
