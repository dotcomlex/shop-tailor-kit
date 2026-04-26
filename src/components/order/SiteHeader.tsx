import { Phone } from "lucide-react";

export const VITALWALK_LOGO_URL =
  "https://vitalwalk.store/cdn/shop/files/VitalWalk_Logo_Header_3000x1000_74780930-59cf-4a88-b62c-a3f8398a8f3d.png?v=1756180394&width=300";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-background/95 shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="container-order flex items-center justify-between py-3.5">
        <a href="/" aria-label="VitalWalk home" className="inline-flex items-center">
          <img
            src={VITALWALK_LOGO_URL}
            alt="VitalWalk"
            className="h-9 w-auto md:h-10"
            loading="eager"
          />
        </a>
        <a
          href="mailto:support@vitalwalk.store"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[hsl(var(--text-body))] hover:text-[hsl(var(--text-strong))] sm:text-[13px]"
        >
          <Phone className="h-3.5 w-3.5" strokeWidth={2.5} />
          Need help?
        </a>
      </div>
    </header>
  );
}
