import { Check } from "lucide-react";
import { PRODUCT_HERO_IMAGE } from "@/data/swatchImages";

export function ProductPanel() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-save">
          New 2026 Release
        </p>
        <h1 className="text-[22px] font-extrabold leading-[1.15] tracking-tight text-[hsl(var(--text-strong))] sm:text-[26px]">
          The Original VitalWalk® Shoes
        </h1>
        <p className="mt-2.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-verified">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
          In stock · Ships in 24h
        </p>
      </div>
      <img
        src={PRODUCT_HERO_IMAGE}
        alt="VitalWalk® Adjustable Comfort Shoes"
        className="h-28 w-28 shrink-0 rounded-xl object-cover ring-1 ring-[hsl(var(--hairline))] sm:h-[140px] sm:w-[140px]"
        loading="eager"
      />
    </div>
  );
}
