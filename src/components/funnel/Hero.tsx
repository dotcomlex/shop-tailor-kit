import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Truck, RefreshCw, Lock, Check } from "lucide-react";
import { PRODUCT_IMAGES } from "@/data/images";
import { useDisplayPrice } from "@/hooks/useVitalWalkProduct";
import { StarRating } from "./StarRating";
import { CtaButton } from "./CtaButton";
import { cn } from "@/lib/utils";

const galleryImages = [
  { src: PRODUCT_IMAGES.heroMain, alt: "VitalWalk® Original Adjustable Comfort Shoes" },
  { src: PRODUCT_IMAGES.hero2, alt: "VitalWalk shoes side profile" },
  { src: PRODUCT_IMAGES.animatedDemo, alt: "Adjustable velcro demonstration" },
  { src: PRODUCT_IMAGES.adjust, alt: "Adjusting the velcro strap" },
  { src: PRODUCT_IMAGES.doctor, alt: "Doctor holding VitalWalk shoes" },
  { src: PRODUCT_IMAGES.cushioning, alt: "Cushioned insole detail" },
];

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { price, compareAt, savePct, installment } = useDisplayPrice();

  return (
    <section className="bg-grad-warm">
      <div className="container-page py-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-card shadow-lift">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={galleryImages[activeIndex].src}
                  alt={galleryImages[activeIndex].alt}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </AnimatePresence>

              {/* Save badge floating top-left */}
              <div className="absolute left-5 top-5 rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-accent-foreground shadow-card">
                Save {savePct}%
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-6 gap-2 md:gap-3">
              {galleryImages.map((img, i) => (
                <button
                  key={img.src}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-xl bg-card transition-all duration-300",
                    "ring-2 ring-offset-2 ring-offset-background",
                    activeIndex === i
                      ? "ring-brand scale-[0.98]"
                      : "ring-transparent hover:ring-border opacity-70 hover:opacity-100",
                  )}
                  aria-label={`View ${img.alt}`}
                >
                  <img src={img.src} alt={img.alt} className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* Buy box */}
          <div className="flex flex-col justify-center">
            <div className="micro-label mb-3 text-brand">★★★★★ Trusted by 10,297+ Seniors</div>

            <h1 className="font-display text-balance text-4xl font-semibold leading-[1.05] text-ink md:text-5xl lg:text-[3.4rem]">
              Finally — A Shoe That <em className="not-italic text-brand">Adjusts to You</em>, Not the Other Way Around
            </h1>

            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              If swollen, aching feet have turned walking into a daily struggle —
              if you've cancelled plans, skipped outings, or relied on others
              just to get through the day — VitalWalk® was made for you.
            </p>

            {/* Quick benefits */}
            <ul className="mt-6 space-y-3">
              {[
                "Built for feet that swell, ache, and never stay the same",
                "Loosen in seconds when you need relief — without taking them off",
                "Slide them on easy, even on your worst days",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-base leading-snug text-foreground">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            {/* Price */}
            <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="font-display text-5xl font-bold text-ink">{price}</span>
              <span className="text-xl text-muted-foreground line-through">{compareAt}</span>
              <span className="rounded-full bg-accent/12 px-3 py-1 text-sm font-bold text-accent">
                Save {savePct}%
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              or 4 interest-free payments of <span className="font-semibold text-foreground">{installment}</span> with{" "}
              <span className="font-semibold">Affirm</span>
            </p>

            {/* CTA */}
            <div className="mt-7">
              <CtaButton size="xl" />
            </div>

            {/* Trust strip */}
            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-[11px] uppercase tracking-[0.1em] text-muted-foreground md:text-xs">
              {[
                { icon: Lock, text: "Secure Checkout" },
                { icon: Truck, text: "Free US Shipping" },
                { icon: RefreshCw, text: "60-Day Returns" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5">
                  <Icon className="h-4 w-4 text-foreground/70" strokeWidth={1.8} />
                  {text}
                </div>
              ))}
            </div>

            {/* Payment marks */}
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 opacity-70">
              {["VISA", "MASTERCARD", "AMEX", "PAYPAL", "AFFIRM", "APPLE PAY"].map((p) => (
                <span
                  key={p}
                  className="rounded border border-border bg-card px-2 py-1 text-[10px] font-bold tracking-wider text-muted-foreground"
                >
                  {p}
                </span>
              ))}
            </div>

            {/* Tiny review microline */}
            <div className="mt-5 flex items-center gap-2.5 border-t border-border/60 pt-5">
              <StarRating size="sm" />
              <span className="text-[13px] text-muted-foreground">
                <span className="font-semibold text-foreground">4.9 / 5</span> from 3,791 verified reviews
              </span>
              <ShieldCheck className="ml-auto h-4 w-4 text-accent" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
