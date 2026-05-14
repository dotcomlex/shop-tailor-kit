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
import { IncludedChecklist } from "./IncludedChecklist";
import { PriorityUpsellCard } from "./PriorityUpsellCard";
import paymentBadges from "@/assets/payment-badges.png";

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
  const showAtRef = useRef<HTMLDivElement | null>(null);
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

        {priorityAvailable && (
          <PriorityUpsellCard
            price={priorityPrice}
            selected={prioritySelected}
            onToggle={onTogglePriority}
          />
        )}

        <IncludedChecklist quantity={quantity} />
      </div>

      <div className="row-pad mt-4 space-y-3.5">
        <YellowCta
          label="Complete My Order"
          onClick={onCheckout}
          loading={isCheckingOut}
          leadingLock
        />

        {/* 60-day risk-free guarantee — placed directly under the CTA so it's
            the next thing a hesitant clicker reads. */}
        <RiskFreeGuarantee />

        {/* Single consolidated trust microline */}
        <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11.5px] text-[hsl(var(--text-mute))]">
          <span className="inline-flex items-center gap-1 font-semibold text-[hsl(var(--text-body))]">
            <Lock className="h-3 w-3" strokeWidth={2.5} />
            Secure SSL checkout
          </span>
          <span aria-hidden>·</span>
          <span>Powered by Shopify</span>
          <span aria-hidden>·</span>
          <span>60-day money-back guarantee</span>
        </div>

        {/* Payment / trust badges */}
        <div className="mt-4 flex justify-center">
          <img
            src={paymentBadges}
            alt="Accepted payments: Visa, Mastercard, American Express, Discover, PayPal, Apple Pay. SSL secured. Secured by Stripe."
            className="h-auto w-full max-w-[340px] sm:max-w-[380px]"
            loading="lazy"
          />
        </div>
      </div>

      {/* Below-the-fold trust blocks — only mounted on Step 3, fade in beautifully */}
      <div className="row-pad mt-10 space-y-6 animate-fade-in">
        <VerifiedReviewsBlock />
        <FaqBlock />
      </div>

      {/* Sentinel: sticky bar appears once the user scrolls past the FAQs */}
      <div ref={showAtRef} aria-hidden className="h-px w-full" />

      {/* Sticky mobile checkout bar — appears once the user reaches the end of the FAQs */}
      <StickyCheckoutBar
        total={grandTotal}
        comparePrice={comparePrice + addOnTotal}
        quantity={quantity}
        onCheckout={onCheckout}
        isCheckingOut={isCheckingOut}
        showAtRef={showAtRef}
      />
    </section>
  );
}
