export function RiskFreeGuarantee() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-4">
        {/* Circular 60-Day badge */}
        <div className="relative flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-full bg-[hsl(var(--order-blue))] text-white shadow-[0_4px_12px_-4px_rgba(15,72,58,0.45)] sm:h-[88px] sm:w-[88px]">
          <div className="absolute inset-1 rounded-full border border-white/30" />
          <div className="flex flex-col items-center leading-none">
            <span className="text-[22px] font-black tracking-tight sm:text-[26px]">60</span>
            <span className="mt-0.5 text-[8.5px] font-bold uppercase tracking-[0.12em] sm:text-[9.5px]">
              Day
            </span>
            <span className="text-[7.5px] font-bold uppercase tracking-[0.14em] opacity-90 sm:text-[8.5px]">
              Guarantee
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] font-extrabold tracking-tight text-[hsl(var(--text-strong))] sm:text-[15.5px]">
            Try VitalWalk risk-free for 60 days.
          </p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-[hsl(var(--text-body))] sm:text-[13px]">
            Wear them every day — long days, swollen evenings, morning stiffness. If they don't
            change how you experience your feet, send them back for a{" "}
            <span className="font-semibold text-[hsl(var(--text-strong))]">full refund</span>. Easy
            returns &amp; exchanges, no hassle.
          </p>
        </div>
      </div>
    </div>
  );
}
