import { ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { StepHeader } from "./StepHeader";
import { YellowCta } from "./YellowCta";
import { TrustRow } from "./TrustRow";

interface UpgradeStepProps {
  protectionEnabled: boolean;
  onToggleProtection: (v: boolean) => void;
  total: number;
  protectionPrice: number;
  onCheckout: () => void;
  isCheckingOut: boolean;
}

export function UpgradeStep({
  protectionEnabled,
  onToggleProtection,
  total,
  protectionPrice,
  onCheckout,
  isCheckingOut,
}: UpgradeStepProps) {
  const grandTotal = total + (protectionEnabled ? protectionPrice : 0);

  return (
    <section aria-labelledby="step-3-heading" className="animate-fade-in">
      <h2 id="step-3-heading" className="sr-only">
        Step 3: Upgrade your experience
      </h2>
      <StepHeader number={3} title="Upgrade your experience" />

      <div className="mt-4 rounded-lg border border-border bg-card p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-order-blue-soft">
            <ShieldCheck className="h-5 w-5 text-[hsl(var(--order-blue))]" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold text-[hsl(var(--text-strong))] sm:text-[15px]">
              Free Returns &amp; Exchanges + Package Protection for ${protectionPrice.toFixed(2)}
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[hsl(var(--text-body))]">
              <span className="font-bold">SHIPPING PROTECTION!:</span> When you opt-in, your return shipping
              label is included, allowing you to return any item(s) in your order for an exchange, refund, or
              store credit for FREE.
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

      {/* Subtotal */}
      <div className="mt-4 flex items-baseline justify-between rounded-md border border-border bg-card px-4 py-3">
        <span className="text-[14px] font-medium text-[hsl(var(--text-body))]">Order Total</span>
        <span className="text-[20px] font-bold text-[hsl(var(--text-strong))]">
          ${grandTotal.toFixed(2)}
        </span>
      </div>

      <div className="mt-5">
        <YellowCta label="Checkout" onClick={onCheckout} loading={isCheckingOut} />
        <TrustRow />

        {/* Payment methods */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {["VISA", "MasterCard", "AMEX", "Discover"].map((m) => (
            <span
              key={m}
              className="rounded border border-border bg-card px-2.5 py-1 text-[10px] font-bold tracking-wider text-[hsl(var(--text-body))]"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
