import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PRODUCT_IMAGES } from "@/data/images";
import { useDisplayPrice } from "@/hooks/useVitalWalkProduct";

export function StickyMobileCta() {
  const [visible, setVisible] = useState(false);
  const { price, compareAt } = useDisplayPrice();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-3 py-2.5 shadow-lift backdrop-blur-md md:hidden"
        >
          <div className="flex items-center gap-3">
            <img
              src={PRODUCT_IMAGES.heroMain}
              alt=""
              className="h-12 w-12 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-ink">VitalWalk® Original</p>
              <p className="text-xs">
                <span className="font-bold text-foreground">{price}</span>{" "}
                <span className="text-muted-foreground line-through">{compareAt}</span>
              </p>
            </div>
            <Link
              to="/select"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-foreground shadow-card active:scale-95"
            >
              Choose Size
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
