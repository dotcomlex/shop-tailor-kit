import { ShieldCheck, Truck, Clock, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { StepHeader } from "./StepHeader";
import { YellowCta } from "./YellowCta";
import { ScarcityBar } from "./ScarcityBar";
import { SavingsHero } from "./SavingsHero";
import { OrderSummary } from "./OrderSummary";

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
  const saved = Math.max(0, comparePrice - total);

  return (
    <section aria-labelledby="step-3-heading" className="animate-fade-in">
      <h2 id="step-3-heading" className="sr-only">
        Step 3: Review and checkout
      </h2>
      <StepHeader number={3} title="Almost There — Review &amp; Checkout" />

      <div className="mt-4 space-y-4">
        {/* Savings hero */}
        <SavingsHero saved={saved} comparePrice={comparePrice} />

        {/* Free shipping + 24h ship row */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3.5 py-3">
            <Truck className="h-5 w-5 shrink-0 text-verified" strokeWidth={2.5} />
            <div className="min-w-0">
              <p className="text-[13px] font-extrabold tracking-tight text-[hsl(var(--text-strong))]">
                FREE US Shipping
              </p>
              <p className="text-[11.5px] text-[hsl(var(--text-mute))]">Included on this order</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3.5 py-3">
            <Clock className="h-5 w-5 shrink-0 text-[hsl(var(--order-blue))]" strokeWidth={2.5} />
            <div className="min-w-0">
              <p className="text-[13px] font-extrabold tracking-tight text-[hsl(var(--text-strong))]">
                Ships within 24 hours
              </p>
              <p className="text-[11.5px] text-[hsl(var(--text-mute))]">From our US warehouse</p>
            </div>
          </div>
        </div>

        {/* Scarcity bar */}
        <ScarcityBar />

        {/* Shipping protection */}
        <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-order-blue-soft">
              <ShieldCheck className="h-5 w-5 text-[hsl(var(--order-blue))]" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-extrabold tracking-tight text-[hsl(var(--text-strong))] sm:text-[15px]">
                Add Shipping Protection — ${protectionPrice.toFixed(2)}
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[hsl(var(--text-body))]">
                Free returns + lost/damaged package replacement. Cancel anytime.
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

        {/* Order summary */}
        <OrderSummary
          subtotal={total}
          protectionPrice={protectionPrice}
          protectionEnabled={protectionEnabled}
          saved={saved}
        />
      </div>

      <div className="mt-5">
        <YellowCta label="Complete My Order" onClick={onCheckout} loading={isCheckingOut} />

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11.5px] text-[hsl(var(--text-mute))]">
          <span className="inline-flex items-center gap-1 font-semibold">
            <Lock className="h-3 w-3" strokeWidth={2.5} />
            Secure checkout
          </span>
          <span aria-hidden>·</span>
          <span>Powered by Shopify</span>
          <span aria-hidden>·</span>
          <span>100-day money-back</span>
        </div>

        {/* Payment methods */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          {[
            { name: "Visa", src: "/payments/visa.svg" },
            { name: "Mastercard", src: "/payments/mastercard.svg" },
            { name: "American Express", src: "/payments/amex.svg" },
            { name: "Discover", src: "/payments/discover.svg" },
          ].map((m) => (
            <img
              key={m.name}
              src={m.src}
              alt={m.name}
              className="h-7 w-auto rounded-[3px]"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
