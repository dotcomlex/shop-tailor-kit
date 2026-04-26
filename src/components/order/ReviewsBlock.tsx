import { useState } from "react";
import { Star, ShieldCheck } from "lucide-react";
import { ORDER_REVIEWS } from "@/data/reviews";

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

export function ReviewsBlock() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? ORDER_REVIEWS : ORDER_REVIEWS.slice(0, 2);

  return (
    <div>
      {/* Trustpilot-style header */}
      <div className="mb-4 flex items-center gap-2.5">
        <TrustpilotStars size={18} />
        <div className="flex items-baseline gap-1.5 text-[13px]">
          <span className="font-extrabold text-[hsl(var(--text-strong))]">Excellent</span>
          <span className="text-[hsl(var(--text-mute))]">·</span>
          <span className="font-semibold text-[hsl(var(--text-body))]">
            Based on {ORDER_REVIEWS.length} verified reviews
          </span>
        </div>
      </div>

      <ul className="space-y-5">
        {visible.map((r) => (
          <li key={r.headline} className="space-y-1.5">
            <TrustpilotStars />
            <h3 className="text-[15px] font-extrabold tracking-tight text-[hsl(var(--text-strong))]">
              {r.headline}
            </h3>
            <p className="text-[14px] leading-relaxed text-[hsl(var(--text-body))]">{r.body}</p>
            <p className="flex items-center gap-2 text-[13px] text-[hsl(var(--text-body))]">
              <span className="font-semibold">— {r.name}</span>
              <span className="inline-flex items-center gap-1 text-verified">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span className="font-semibold">Verified Purchaser</span>
              </span>
            </p>
          </li>
        ))}
      </ul>

      {!showAll && ORDER_REVIEWS.length > 2 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-4 text-[13px] font-semibold text-[hsl(var(--order-blue))] hover:underline"
        >
          Show more reviews ▼
        </button>
      )}
    </div>
  );
}
