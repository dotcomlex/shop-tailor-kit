import { useState } from "react";
import { Star, ShieldCheck } from "lucide-react";
import { ORDER_REVIEWS } from "@/data/reviews";

function FiveStars() {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-verified" strokeWidth={0} />
      ))}
    </div>
  );
}

export function ReviewsBlock() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? ORDER_REVIEWS : ORDER_REVIEWS.slice(0, 2);

  return (
    <div>
      <ul className="space-y-5">
        {visible.map((r) => (
          <li key={r.headline} className="space-y-1.5">
            <FiveStars />
            <h3 className="text-[15px] font-bold text-[hsl(var(--text-strong))]">{r.headline}</h3>
            <p className="text-[14px] leading-relaxed text-[hsl(var(--text-body))]">{r.body}</p>
            <p className="flex items-center gap-1.5 text-[13px] text-[hsl(var(--text-body))]">
              <span>— {r.name}</span>
              <span className="inline-flex items-center gap-1 text-verified">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
                <span className="font-medium">Verified Purchaser</span>
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
