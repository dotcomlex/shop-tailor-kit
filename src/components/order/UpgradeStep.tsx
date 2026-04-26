import { ShieldCheck, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { StepHeader } from "./StepHeader";
import { YellowCta } from "./YellowCta";
import { ScarcityBar } from "./ScarcityBar";
import { SavingsHero } from "./SavingsHero";
import { OrderSummary } from "./OrderSummary";
import { TrustRow } from "./TrustRow";
import { useCurrency } from "@/hooks/useCurrency";

interface UpgradeStepProps {
  protectionEnabled: boolean;
  onToggleProtection: (v: boolean) => void;
  total: number;
  comparePrice: number;
  protectionPrice: number;
  onCheckout: () => void;
  isCheckingOut: boolean;
}

const PAYMENTS = [
  { name: "Visa", src: "/payments/visa.svg" },
  { name: "Mastercard", src: "/payments/mastercard.svg" },
  { name: "American Express", src: "/payments/amex.svg" },
  { name: "Discover", src: "/payments/discover.svg" },
  { name: "PayPal", src: "/payments/paypal.svg" },
  { name: "Apple Pay", src: "/payments/apple-pay.svg" },
  { name: "Google Pay", src: "/payments/google-pay.svg" },
  { name: "Shop Pay", src: "/payments/shop-pay.svg" },
];

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

  return (
    <section aria-labelledby="step-3-heading" className="animate-fade-in">
      <h2 id="step-3-heading" className="sr-only">
        Step 3: Review and checkout
      </h2>
      <StepHeader number={3} title="Almost There — Review &amp; Checkout" />

      <div className="mt-4 space-y-3.5">
        {/* 1. Combined savings + shipping (auto-detected country) */}
        <SavingsHero saved={saved} comparePrice={comparePrice} />

        {/* 2. Scarcity bar — softened */}
        <ScarcityBar />

        {/* 3. Order summary */}
        <OrderSummary
          subtotal={total}
          protectionPrice={protectionPrice}
          protectionEnabled={protectionEnabled}
          saved={saved}
        />

        {/* 4. Shipping protection — sits directly above the CTA */}
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
      </div>

      <div className="mt-3">
        <YellowCta label="Complete My Order" onClick={onCheckout} loading={isCheckingOut} />

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11.5px] text-[hsl(var(--text-mute))]">
          <span className="inline-flex items-center gap-1 font-semibold">
            <Lock className="h-3 w-3" strokeWidth={2.5} />
            Secure checkout
          </span>
          <span aria-hidden>·</span>
          <span>Powered by Shopify</span>
          <span aria-hidden>·</span>
          <span>60-day money-back</span>
        </div>

        <TrustRow />

        {/* Payment methods — unified pill */}
        <div className="mt-3 rounded-xl border border-border bg-secondary/40 px-3 py-2.5">
          <p className="mb-1.5 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--text-mute))]">
            We accept
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {PAYMENTS.map((m) => (
              <img
                key={m.name}
                src={m.src}
                alt={m.name}
                className="h-6 w-auto rounded-[3px] sm:h-7"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
