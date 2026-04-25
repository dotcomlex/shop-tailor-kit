import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, ThumbsUp } from "lucide-react";
import { SOCIAL_CARDS } from "@/data/testimonials";

export function SocialProofCards() {
  return (
    <section className="bg-background">
      <div className="container-page py-20 lg:py-24">
        <div className="mb-12 text-center">
          <p className="micro-label mb-2">Real People · Real Relief</p>
          <h2 className="font-display text-balance text-4xl font-semibold leading-[1.1] text-ink md:text-5xl">
            Real Life, <em className="not-italic italic text-brand">Restored</em>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-7">
          {SOCIAL_CARDS.map((card, i) => (
            <motion.article
              key={card.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift"
            >
              {/* Header */}
              <header className="flex items-center gap-3 px-5 pb-3 pt-5">
                <img src={card.avatar} alt={card.name} className="h-11 w-11 rounded-full object-cover" loading="lazy" />
                <div>
                  <p className="font-semibold text-ink">{card.name}</p>
                  <p className="text-xs text-muted-foreground">{card.timeAgo}</p>
                </div>
              </header>
              {/* Body */}
              <p className="px-5 pb-4 text-[15px] leading-relaxed text-foreground">{card.body}</p>
              {/* Image */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                <img src={card.image} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
              {/* Engagement */}
              <footer className="flex items-center justify-between border-t border-border/60 px-5 py-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-brand-foreground">
                    <ThumbsUp className="h-2.5 w-2.5 fill-current" />
                  </span>
                  <span className="text-xs font-medium">{card.likes}</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span>{card.comments} Comments</span>
                </div>
              </footer>
              <div className="grid grid-cols-3 border-t border-border/60 text-xs font-medium text-muted-foreground">
                <button className="flex items-center justify-center gap-1.5 py-2.5 hover:bg-muted/50">
                  <Heart className="h-3.5 w-3.5" /> Like
                </button>
                <button className="flex items-center justify-center gap-1.5 border-x border-border/60 py-2.5 hover:bg-muted/50">
                  <MessageCircle className="h-3.5 w-3.5" /> Comment
                </button>
                <button className="flex items-center justify-center gap-1.5 py-2.5 hover:bg-muted/50">
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
