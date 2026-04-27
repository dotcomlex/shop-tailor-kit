import { MessageCircle } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { useSupportChat } from "@/components/support/SupportChatProvider";

export const VITALWALK_LOGO_URL =
  "https://vitalwalk.store/cdn/shop/files/VitalWalk_Logo_Header_3000x1000_74780930-59cf-4a88-b62c-a3f8398a8f3d.png?v=1756180394&width=300";

export function SiteHeader() {
  const { currency, countryFlag, loading } = useCurrency();
  const { openChat } = useSupportChat();

  return (
    <header className="bg-background shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <div className="container-order flex items-center justify-between py-3 sm:py-3.5">
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
              className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[12px] font-bold tracking-wide text-[hsl(var(--text-body))]"
              aria-label={`Prices shown in ${currency}`}
              title={`Prices shown in ${currency}`}
            >
              <span aria-hidden>{countryFlag}</span>
              {currency}
            </span>
          )}
          <button
            type="button"
            onClick={openChat}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[13px] font-semibold text-[hsl(var(--text-body))] hover:text-[hsl(var(--text-strong))] hover:bg-secondary/60 transition-colors"
            aria-label="Open live chat with Alyssa from Customer Care"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
            Need help?
          </button>
        </div>
      </div>
    </header>
  );
}
