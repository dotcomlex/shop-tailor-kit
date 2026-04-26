import { Phone, ShieldCheck, Truck } from "lucide-react";

export const VITALWALK_LOGO_URL =
  "https://vitalwalk.store/cdn/shop/files/VitalWalk_Logo_Header_3000x1000_74780930-59cf-4a88-b62c-a3f8398a8f3d.png?v=1756180394&width=300";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30">
      {/* Top trust strip — dark */}
      <div className="bg-[hsl(var(--text-strong))] text-white">
        <div className="container-order flex items-center justify-center gap-4 overflow-hidden py-1.5 text-[11px] font-medium tracking-wide sm:gap-6 sm:text-[12px]">
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5 text-[hsl(var(--order-yellow))]" strokeWidth={2.5} />
            21,734+ Happy Customers
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-[hsl(var(--order-yellow))]" strokeWidth={2.5} />
            FREE US Shipping
          </span>
          <span className="hidden items-center gap-1.5 md:inline-flex">
            ✓ 100-Day Money-Back Guarantee
          </span>
        </div>
      </div>

      {/* Main bar */}
      <div className="bg-background/95 shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <div className="container-order flex items-center justify-between py-3">
          <a href="/" aria-label="VitalWalk home" className="inline-flex items-center">
            <img
              src={VITALWALK_LOGO_URL}
              alt="VitalWalk"
              className="h-9 w-auto md:h-11"
              loading="eager"
            />
          </a>
          <a
            href="mailto:support@vitalwalk.store"
            className="hidden items-center gap-1.5 text-[12px] font-semibold text-[hsl(var(--text-body))] hover:text-[hsl(var(--text-strong))] sm:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" strokeWidth={2.5} />
            Need help?
          </a>
        </div>
      </div>
    </header>
  );
}
