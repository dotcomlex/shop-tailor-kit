export function RiskFreeGuarantee() {
  return (
    <div className="rounded-xl border border-border bg-card p-3 sm:p-3.5">
      <div className="flex items-center gap-3">
        {/* Circular 60-Day badge */}
        <div className="relative flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-[hsl(var(--order-blue))] text-white shadow-[0_4px_12px_-4px_rgba(15,72,58,0.45)] sm:h-[64px] sm:w-[64px]">
          <div className="absolute inset-1 rounded-full border border-white/30" />
          <div className="flex flex-col items-center leading-none">
            <span className="text-[16px] font-black tracking-tight sm:text-[18px]">60</span>
            <span className="mt-0.5 text-[6.5px] font-bold uppercase tracking-[0.12em] sm:text-[7.5px]">
              Day
            </span>
            <span className="text-[5.5px] font-bold uppercase tracking-[0.14em] opacity-90 sm:text-[6.5px]">
              Guarantee
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-extrabold tracking-tight text-[hsl(var(--text-strong))]">
            Try VitalWalk risk-free for 60 days.
          </p>
          <p className="mt-0.5 text-[12px] leading-snug text-[hsl(var(--text-body))]">
            Don't love them? Send them back for a{" "}
            <span className="font-semibold text-[hsl(var(--text-strong))]">full refund</span>. Easy
            returns &amp; exchanges.
          </p>
        </div>
      </div>
    </div>
  );
}
