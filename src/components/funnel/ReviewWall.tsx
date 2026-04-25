import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { REVIEWS } from "@/data/testimonials";
import { StarRating } from "./StarRating";

export function ReviewWall() {
  return (
    <section className="bg-background">
      <div className="container-page py-20 lg:py-24">
        <div className="mb-10 flex flex-col items-center justify-center gap-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Excellent
          </div>
          <h2 className="font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
            <span className="text-brand">4.9 / 5</span> from real customers
          </h2>
          <div className="flex items-center gap-2">
            <StarRating size="md" />
            <span className="text-sm text-muted-foreground">Based on verified reviews</span>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <motion.article
              key={r.name + i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.45, delay: (i % 6) * 0.05 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
            >
              <StarRating size="sm" />
              <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink">
                {r.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{r.body}</p>
              <footer className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3 text-xs">
                <span className="font-semibold text-foreground">{r.name}</span>
                <span className="ml-auto inline-flex items-center gap-1 text-accent">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Purchase
                </span>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
