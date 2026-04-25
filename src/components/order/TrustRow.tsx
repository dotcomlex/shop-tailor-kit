import { Lock, ShieldCheck } from "lucide-react";

export function TrustRow() {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--text-mute))]">
      <span className="inline-flex items-center gap-1.5">
        <Lock className="h-3.5 w-3.5" strokeWidth={2} />
        SECURE SSL ENCRYPTION
      </span>
      <span className="inline-flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
        GUARANTEED SAFE CHECKOUT
      </span>
    </div>
  );
}
