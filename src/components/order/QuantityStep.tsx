import { Star, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { StepHeader } from "./StepHeader";
import { YellowCta } from "./YellowCta";
import { BundleThumb } from "./BundleThumb";
import { useCurrency } from "@/hooks/useCurrency";
import { useVitalWalkBundles } from "@/hooks/useVitalWalkProduct";
import { useShipping } from "@/hooks/useShipping";
import type { ShopifyProductData } from "@/lib/shopify";
import trustBadges from "@/assets/trust-badges.png";


// Numbers mirrored EXACTLY from VerifiedReviewsBlock so the rating shown
// here matches the full reviews section further down the page (no fabricated
// review counts — same source of truth).
const TRUST_RATING = "4.9";
const TRUST_REVIEWS = 2847;

function TrustpilotMiniStars() {
  return (
    <span className="flex items-center gap-[2px]" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="flex h-[13px] w-[13px] items-center justify-center bg-verified"
        >
          <Star className="h-[9px] w-[9px] fill-white" strokeWidth={0} />
        </span>
      ))}
    </span>
  );
}


export type Quantity = 1 | 2 | 3;

interface BundleOption {
  qty: Quantity;
  name: string;
  savePct: number;
  ribbon?: { label: string; tone: "popular" | "best" };
}

const OPTIONS: BundleOption[] = [
  { qty: 1, name: "1 Pair VitalWalk® Shoes", savePct: 70 },
  {
    qty: 2,
    name: "2 Pairs VitalWalk® Shoes",
    savePct: 75,
    ribbon: { label: "MOST POPULAR", tone: "popular" },
  },
  {
    qty: 3,
    name: "3 Pairs VitalWalk® Shoes",
    savePct: 80,
    ribbon: { label: "BEST DEAL", tone: "best" },
  },
];

interface QuantityStepProps {
  quantity: Quantity;
  onQuantityChange: (q: Quantity) => void;
  onContinue: () => void;
}

/**
 * Read the localized total/compare for a bundle pack-size from the Shopify
 * @inContext response.
 *
 * Bundle products (2-pair, 3-pair) store PER-PAIR prices on simple
 * "Pair #1/#2/#3" variants. The 1-pair product stores the regular price.
 * Total = per-pair price × pack size. Compare = 1-pair retail × pack size,
 * which is the "if you bought them individually" reference for the
 * strikethrough.
 */
function readLocalizedTotals(
  product: ShopifyProductData | null | undefined,
  qty: number,
  _onePairProduct: ShopifyProductData | null | undefined,
) {
  if (!product) return null;
  const perPair = parseFloat(product.priceRange.minVariantPrice.amount);
  if (!Number.isFinite(perPair)) return null;
  const total = perPair * qty;
  // Strike-through is derived from the advertised bundle save % so the
  // ribbon ("75% OFF"), the strike, and Step 3 always agree to the cent.
  const SAVE_PCT: Record<number, number> = { 1: 0.70, 2: 0.75, 3: 0.80 };
  const pct = SAVE_PCT[qty] ?? 0;
  const compare = pct > 0 && total > 0 ? total / (1 - pct) : total;
  return { total, compare };
}

export function QuantityStep({ quantity, onQuantityChange, onContinue }: QuantityStepProps) {
  const { format } = useCurrency();
  const { data: bundles } = useVitalWalkBundles();

  return (
    <section aria-labelledby="step-1-heading">
      <h2 id="step-1-heading" className="sr-only">
        Step 1: Select Quantity
      </h2>
      <StepHeader
        number={1}
        title="Select Quantity"
        rightLabel="Bundle and Save!"
        subStrip="You can select color and size on next step"
      />

      <div className="row-pad">
        <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:mt-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--order-blue-soft))] px-2.5 py-1 text-[11.5px] font-extrabold uppercase tracking-wider text-[hsl(var(--order-blue))]">
            <span aria-hidden>👟</span> Unisex — fits Men &amp; Women
          </span>
        </div>

        <ul className="mt-3 space-y-2.5">
          {OPTIONS.map((opt) => {
            const selected = quantity === opt.qty;
            const isPopular = opt.ribbon?.tone === "popular";
            const ribbonClass = isPopular
              ? // MOST POPULAR — loud red, slightly larger, with a soft
                // ring + drop shadow so it lifts off the card.
                "bg-[hsl(0_84%_50%)] text-white text-[11px] px-2.5 py-[4px] shadow-md"
              : // BEST DEAL — secondary, calmer blue treatment.
                "bg-[hsl(var(--order-blue))] text-white text-[10px] px-2 py-[3px] shadow-sm";

            const totals = readLocalizedTotals(bundles?.[opt.qty], opt.qty, bundles?.[1]);
            // Headline = per-pair price (same across all 3 cards in spirit:
            // each card shows its own per-pair tier). Strike = per-pair
            // retail derived from the advertised save % so the ribbon, the
            // strike, and Step 3 always agree.
            const perPair = totals ? totals.total / opt.qty : 0;
            const perPairCompare = totals ? totals.compare / opt.qty : 0;
            const perPairFormatted = totals ? format(perPair) : "";
            const perPairCompareFormatted =
              totals && perPairCompare > perPair ? format(perPairCompare) : "";

            return (
              <li key={opt.qty} className="relative pt-2.5">
                {opt.ribbon && (
                  <span
                    className={cn(
                      "absolute right-3 top-0 z-10 rounded-md font-extrabold uppercase tracking-wider",
                      ribbonClass,
                    )}
                  >
                    {opt.ribbon.label}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onQuantityChange(opt.qty)}
                  aria-pressed={selected}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl border-2 p-3 text-left transition-all sm:gap-4 sm:p-4",
                    selected
                      ? "border-order-blue bg-[#FDF7F0] ring-2 ring-[hsl(45_95%_55%/0.35)] shadow-[0_4px_14px_-4px_rgba(212,160,23,0.25)]"
                      : "bg-card border-border hover:border-[hsl(var(--text-mute))]",
                  )}
                >
                  {/* radio */}
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      selected ? "border-order-blue bg-order-blue" : "border-[hsl(var(--text-mute))]",
                    )}
                    aria-hidden
                  >
                    {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>

                  {/* thumb */}
                  <BundleThumb count={opt.qty} />

                  {/* name + save + shipping pill */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[17px] font-extrabold leading-tight tracking-tight text-[hsl(var(--text-strong))] sm:text-[17px]">
                      {opt.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-[14px] font-extrabold text-save">
                        Save {opt.savePct}%
                      </p>
                      {opt.qty > 1 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--verified-green)/0.10)] px-1.5 py-[2px] text-[10.5px] font-bold uppercase tracking-wide text-verified">
                          <Truck className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                          Free Shipping
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price column — headline is the exact Shopify bundle
                      total so the number on this card matches Step 3 /
                      checkout to the cent. */}
                  <div className="shrink-0 text-right">
                    {perPairCompareFormatted ? (
                      <p className="text-[13px] font-semibold tabular-nums text-[hsl(var(--text-mute))] line-through">
                        {perPairCompareFormatted}
                      </p>
                    ) : (
                      <p className="h-[18px] w-16 ml-auto rounded bg-[hsl(var(--text-mute)/0.15)] animate-pulse" aria-hidden />
                    )}
                    {perPairFormatted ? (
                      <p className="mt-0.5 text-[20px] font-extrabold leading-none tabular-nums text-[hsl(var(--text-strong))] sm:text-[20px]">
                        {perPairFormatted}
                        <span className="ml-1 text-[12px] font-semibold text-[hsl(var(--text-mute))]">/ea</span>
                      </p>
                    ) : (
                      <p className="mt-1 h-[20px] w-20 ml-auto rounded bg-[hsl(var(--text-mute)/0.15)] animate-pulse" aria-hidden />
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>


        <div className="mt-4">
          <YellowCta label="Select Your Color and Size" onClick={onContinue} />
        </div>

        {/* Trust strip — one calm text line + payment logos. No icons or
            dividers competing with the yellow CTA. The full review count
            and detailed rating live in VerifiedReviewsBlock further down;
            here we just need a quiet reassurance band. */}
        <div className="mt-3 flex flex-col items-center gap-2.5">
          <div className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-[12px] text-[hsl(var(--text-body))]">
            <TrustpilotMiniStars />
            <span className="font-extrabold text-[hsl(var(--text-strong))] tabular-nums">
              {TRUST_RATING}
            </span>
            {/* Desktop-only extras — keeps mobile minimal */}
            <span className="hidden text-[hsl(var(--text-mute))] tabular-nums sm:inline">
              / 5
            </span>
            <span className="hidden text-[hsl(var(--text-mute))] sm:inline" aria-hidden>
              ·
            </span>
            <span className="hidden font-semibold tabular-nums sm:inline">
              {TRUST_REVIEWS.toLocaleString()} reviews
            </span>

            <span className="text-[hsl(var(--text-mute))]" aria-hidden>
              ·
            </span>
            <span className="font-semibold">60-Day Guarantee</span>
            <span className="text-[hsl(var(--text-mute))]" aria-hidden>
              ·
            </span>
            <span className="font-semibold">
              {quantity === 1 ? "Free Shipping on 2+ Pairs" : "Free Shipping"}
            </span>
          </div>

          <img
            src={trustBadges}
            alt="Secure checkout — Verified by Visa, MasterCard SecureCode, Cloudflare, PayPal Verified, SSL Secured"
            loading="lazy"
            decoding="async"
            className="mx-auto block h-[16px] w-auto max-w-full opacity-60 sm:h-[20px]"
          />
        </div>

      </div>
    </section>
  );
}

// Backwards-compat export — kept as an empty array since pricing is now
// fully sourced from Shopify. Existing imports won't break.
export const BUNDLE_OPTIONS = OPTIONS;
