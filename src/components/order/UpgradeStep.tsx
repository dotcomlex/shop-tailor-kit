import { useRef } from "react";
import { ShieldCheck, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { StepHeader } from "./StepHeader";
import { YellowCta } from "./YellowCta";
import { ScarcityBar } from "./ScarcityBar";
import { SavingsHero } from "./SavingsHero";
import { OrderSummary } from "./OrderSummary";
import { RiskFreeGuarantee } from "./RiskFreeGuarantee";
import { VerifiedReviewsBlock } from "./VerifiedReviewsBlock";
import { FaqBlock } from "./FaqBlock";
import { StickyCheckoutBar } from "./StickyCheckoutBar";
import { useCurrency } from "@/hooks/useCurrency";
import paymentBadges from "@/assets/payment-badges.png";

interface UpgradeStepProps {
  protectionEnabled: boolean;
  onToggleProtection: (v: boolean) => void;
  total: number;
  comparePrice: number;
  protectionPrice: number;
  onCheckout: () => void;
  isCheckingOut: boolean;
}

export function UpgradeStep({
  protectionEnabled,
  onToggleProtection,
  total,
  comparePrice,
  protectionPrice,
  onCheckout,
  isCheckingOut,
}: UpgradeStepProps) {
  const { format } = useCurrency();
  const saved = Math.max(0, comparePrice - total);
  const ctaWrapperRef = useRef<HTMLDivElement | null>(null);
  const totalWithProtection = total + (protectionEnabled ? protectionPrice : 0);

  return (
    <section aria-labelledby="step-3-heading" className="animate-fade-in">
      <h2 id="step-3-heading" className="sr-only">
        Step 3: Review and checkout
      </h2>
      <StepHeader number={3} title="Almost There — Review &amp; Checkout" />

      <div className="mt-4 space-y-3.5">
        <SavingsHero saved={saved} comparePrice={comparePrice} />
        <ScarcityBar />
        <OrderSummary
          subtotal={total}
          protectionPrice={protectionPrice}
          protectionEnabled={protectionEnabled}
          saved={saved}
        />

        {/* Shipping protection — sits directly above the CTA */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-order-blue-soft">
              <ShieldCheck className="h-5 w-5 text-[hsl(var(--order-blue))]" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-extrabold tracking-tight text-[hsl(var(--text-strong))] sm:text-[15px]">
                Add Shipping Protection — {format(protectionPrice)}
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[hsl(var(--text-body))]">
                Free returns + lost/damaged package replacement.
              </p>
            </div>
            <Switch
              checked={protectionEnabled}
              onCheckedChange={onToggleProtection}
              className="data-[state=checked]:bg-verified"
              aria-label="Enable shipping protection"
            />
          </div>
        </div>

        {/* 60-day risk-free guarantee — final reassurance right before CTA */}
        <RiskFreeGuarantee />
      </div>

      <div className="mt-3" ref={ctaWrapperRef}>
        <YellowCta label="Complete My Order" onClick={onCheckout} loading={isCheckingOut} />

        {/* Single consolidated trust microline */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11.5px] text-[hsl(var(--text-mute))]">
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
      <div className="mt-10 space-y-6 animate-fade-in">
        <VerifiedReviewsBlock />
        <FaqBlock />
      </div>
    </section>
  );
}
