import { useState } from "react";
import { Star, ShieldCheck } from "lucide-react";
import { ORDER_REVIEWS } from "@/data/reviews";

const TOTAL_REVIEWS = 2847;
const RATING = "4.9";

function TrustpilotStars({ size = 16 }: { size?: number }) {
  return (
    <div className="flex items-center gap-[2px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="flex items-center justify-center bg-verified"
          style={{ width: size, height: size }}
        >
          <Star
            className="fill-white"
            strokeWidth={0}
            style={{ width: size * 0.7, height: size * 0.7 }}
          />
        </span>
      ))}
    </div>
  );
}

export function VerifiedReviewsBlock() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? ORDER_REVIEWS : ORDER_REVIEWS.slice(0, 3);

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      {/* Trustpilot-style header */}
      <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-[hsl(var(--hairline))] pb-4">
        <TrustpilotStars size={20} />
        <div className="flex items-baseline gap-1.5 text-[13px]">
          <span className="text-[15px] font-black text-[hsl(var(--text-strong))]">{RATING}</span>
          <span className="text-[hsl(var(--text-mute))]">/ 5</span>
        </div>
        <span className="text-[hsl(var(--text-mute))]" aria-hidden>
          ·
        </span>
        <span className="text-[13px] font-bold text-[hsl(var(--verified-green))]">Excellent</span>
        <span className="text-[hsl(var(--text-mute))]" aria-hidden>
          ·
        </span>
        <span className="text-[13px] font-semibold text-[hsl(var(--text-body))]">
          {TOTAL_REVIEWS.toLocaleString()} verified reviews
        </span>
      </div>

      <ul className="space-y-5">
        {visible.map((r) => (
          <li key={r.headline} className="space-y-1.5">
            <TrustpilotStars />
            <h4 className="text-[14.5px] font-extrabold tracking-tight text-[hsl(var(--text-strong))]">
              {r.headline}
            </h4>
            <p className="text-[13.5px] leading-relaxed text-[hsl(var(--text-body))]">{r.body}</p>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-[hsl(var(--text-body))]">
              <span className="font-semibold">— {r.name}</span>
              <span className="inline-flex items-center gap-1 text-verified">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span className="font-semibold">Verified Purchaser</span>
              </span>
            </p>
          </li>
        ))}
      </ul>

      {!showAll && ORDER_REVIEWS.length > 3 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-5 w-full rounded-lg border border-[hsl(var(--hairline))] bg-secondary py-2.5 text-[13px] font-bold text-[hsl(var(--order-blue))] transition-colors hover:bg-order-blue-soft"
        >
          Show all {ORDER_REVIEWS.length} reviews
        </button>
      )}
    </div>
  );
}
