export const VITALWALK_LOGO_URL =
  "https://vitalwalk.store/cdn/shop/files/VitalWalk_Logo_Header_3000x1000_74780930-59cf-4a88-b62c-a3f8398a8f3d.png?v=1756180394&width=300";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container-order flex items-center py-3">
        <a href="/" aria-label="VitalWalk home" className="inline-flex items-center">
          <img
            src={VITALWALK_LOGO_URL}
            alt="VitalWalk"
            className="h-8 w-auto md:h-10"
            loading="eager"
          />
        </a>
      </div>
    </header>
  );
}
