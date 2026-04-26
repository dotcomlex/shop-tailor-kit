import { Phone } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

export const VITALWALK_LOGO_URL =
  "https://vitalwalk.store/cdn/shop/files/VitalWalk_Logo_Header_3000x1000_74780930-59cf-4a88-b62c-a3f8398a8f3d.png?v=1756180394&width=300";

export function SiteHeader() {
  const { currency, countryFlag, loading } = useCurrency();

  return (
    <header className="bg-background shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <div className="container-order flex items-center justify-between py-2.5 sm:py-3.5">
        <a href="/" aria-label="VitalWalk home" className="inline-flex items-center">
          <img
            src={VITALWALK_LOGO_URL}
            alt="VitalWalk"
            className="h-7 w-auto sm:h-9 md:h-10"
            loading="eager"
          />
        </a>
        <div className="flex items-center gap-3">
          {!loading && (
            <span
              className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[11px] font-bold tracking-wide text-[hsl(var(--text-body))] sm:text-[12px]"
              aria-label={`Prices shown in ${currency}`}
              title={`Prices shown in ${currency}`}
            >
              <span aria-hidden>{countryFlag}</span>
              {currency}
            </span>
          )}
          <a
            href="mailto:support@vitalwalk.store"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[hsl(var(--text-body))] hover:text-[hsl(var(--text-strong))] sm:text-[13px]"
          >
            <Phone className="h-3.5 w-3.5" strokeWidth={2.5} />
            Need help?
          </a>
        </div>
      </div>
    </header>
  );
}
