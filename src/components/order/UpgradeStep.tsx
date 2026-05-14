import { useRef } from "react";
import { Lock } from "lucide-react";
import { StepHeader } from "./StepHeader";
import { YellowCta } from "./YellowCta";
import { ScarcityBar } from "./ScarcityBar";
import { OrderSummary } from "./OrderSummary";
import { RiskFreeGuarantee } from "./RiskFreeGuarantee";
import { VerifiedReviewsBlock } from "./VerifiedReviewsBlock";
import { FaqBlock } from "./FaqBlock";
import { StickyCheckoutBar } from "./StickyCheckoutBar";

import { PriorityUpsellCard } from "./PriorityUpsellCard";
import paymentBadges from "@/assets/payment-badges-compact.png";

interface UpgradeStepProps {
  total: number;
  comparePrice: number;
  quantity: number;
  onCheckout: () => void;
  isCheckingOut: boolean;
  /** Footer/end-of-content sentinel — sticky bar tucks away when this is in view. */
  endRef?: React.RefObject<HTMLElement | null>;
  /** Localized price for Priority Processing (null until product loads). */
  priorityPrice: number | null;
  /** Hide card entirely if Shopify variant is unavailable. */
  priorityAvailable: boolean;
  prioritySelected: boolean;
  onTogglePriority: (next: boolean) => void;
}

export function UpgradeStep({
  total,
  comparePrice,
  quantity,
  onCheckout,
  isCheckingOut,
  priorityPrice,
  priorityAvailable,
  prioritySelected,
  onTogglePriority,
}: UpgradeStepProps) {
  const saved = Math.max(0, comparePrice - total);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const addOnTotal = prioritySelected && priorityPrice != null ? priorityPrice : 0;
  const grandTotal = total + addOnTotal;

  return (
    <section aria-labelledby="step-3-heading" className="animate-fade-in pb-28 md:pb-0">
      <h2 id="step-3-heading" className="sr-only">
        Step 3: Review and checkout
      </h2>
      <StepHeader number={3} title="Almost There — Review &amp; Checkout" />

      <div className="row-pad mt-4 space-y-3.5">
        <ScarcityBar />
        <OrderSummary
          subtotal={total}
          saved={saved}
          quantity={quantity}
          addOnTotal={addOnTotal}
          addOnLabel={addOnTotal > 0 ? "Priority Processing" : undefined}
        />

        {quantity === 1 && (
          <p className="-mt-1 px-1 text-center text-[12px] text-[hsl(var(--text-mute))]">
            <span aria-hidden>🚚</span>{" "}
            <span className="font-semibold text-[hsl(var(--text-body))]">Get 2+ pairs</span>{" "}
            to unlock{" "}
            <span className="font-semibold text-verified">free shipping</span>.
          </p>
        )}

        {priorityAvailable && (
          <PriorityUpsellCard
            price={priorityPrice}
            selected={prioritySelected}
            onToggle={onTogglePriority}
          />
        )}

        
      </div>

      <div className="row-pad mt-4">
        <div ref={ctaRef}>
          <YellowCta
            label="Complete My Order"
            onClick={onCheckout}
            loading={isCheckingOut}
            leadingLock
          />
        </div>

        {/* Button-level reassurance — sits immediately under the CTA. */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11.5px] text-[hsl(var(--text-mute))]">
          <span className="inline-flex items-center gap-1 font-semibold text-[hsl(var(--text-body))]">
            <Lock className="h-3 w-3" strokeWidth={2.5} />
            Secure SSL checkout
          </span>
          <span aria-hidden>·</span>
          <span>Powered by Shopify</span>
        </div>

        {/* Compact payment badges strip — sits right under the SSL microline. */}
        <div className="mt-2.5 flex justify-center py-0.5">
          <img
            src={paymentBadges}
            alt="Accepted payments: Shop Pay, Discover, Visa, Mastercard, Apple Pay, Google Pay, Amazon, American Express."
            className="h-auto w-full max-w-[260px] sm:max-w-[320px]"
            loading="lazy"
          />
        </div>

      </div>

      {/* 60-day guarantee — bridges the checkout block and social proof below. */}
      <div className="row-pad mt-6">
        <RiskFreeGuarantee />
      </div>

      {/* Below-the-fold trust blocks — only mounted on Step 3, fade in beautifully */}
      <div className="row-pad mt-10 space-y-6 animate-fade-in">
        <VerifiedReviewsBlock />
        <FaqBlock />
      </div>

      {/* Sticky mobile checkout bar — slides in once the main CTA scrolls offscreen */}
      <StickyCheckoutBar
        total={grandTotal}
        comparePrice={comparePrice + addOnTotal}
        quantity={quantity}
        onCheckout={onCheckout}
        isCheckingOut={isCheckingOut}
        ctaRef={ctaRef}
      />
    </section>
  );
}
