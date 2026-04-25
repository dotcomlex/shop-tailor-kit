import { StarRating } from "./StarRating";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-paper/80 backdrop-blur-sm">
      <div className="container-page flex flex-col items-center justify-center py-5 md:py-6">
        <a href="/" className="font-display text-2xl md:text-3xl font-bold tracking-tight text-ink">
          VitalWalk<span className="text-brand">®</span>
        </a>
        <div className="mt-2 flex items-center gap-2.5">
          <StarRating size="sm" />
          <span className="text-xs md:text-[13px] font-medium text-muted-foreground">
            Trusted by 10,297+ Seniors
          </span>
        </div>
      </div>
    </header>
  );
}
