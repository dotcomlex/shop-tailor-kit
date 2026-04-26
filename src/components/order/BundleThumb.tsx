import { cn } from "@/lib/utils";
import { BUNDLE_THUMB_IMAGE } from "@/data/swatchImages";

interface BundleThumbProps {
  count: 1 | 2 | 3;
  className?: string;
}

/**
 * Renders 1, 2, or 3 stacked shoe images so each bundle option visually
 * communicates "you're getting more pairs". Pure CSS stack — no extra assets.
 */
export function BundleThumb({ count, className }: BundleThumbProps) {
  return (
    <div
      className={cn(
        "relative h-[68px] w-[78px] shrink-0 sm:h-[80px] sm:w-[92px]",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => {
        const offset = i * 6;
        const z = count - i;
        return (
          <img
            key={i}
            src={BUNDLE_THUMB_IMAGE}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full rounded-md border border-[hsl(var(--hairline))] bg-white object-cover shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
            style={{
              transform: `translate(${offset}px, ${-offset}px)`,
              zIndex: z,
            }}
          />
        );
      })}
    </div>
  );
}
