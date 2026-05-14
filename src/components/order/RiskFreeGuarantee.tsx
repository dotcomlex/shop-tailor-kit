export function RiskFreeGuarantee() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[hsl(var(--order-blue)/0.20)] bg-gradient-to-br from-[hsl(var(--order-blue-soft))] via-card to-card p-4 shadow-[0_2px_10px_-6px_hsl(var(--order-blue)/0.35)] sm:p-5">
      {/* Subtle inner highlight for depth */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
      />

      <div className="flex items-center gap-3.5 sm:gap-4">
        {/* Circular 60-Day medallion */}
        <div className="relative flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full bg-[hsl(var(--order-blue))] text-white shadow-[0_6px_18px_-6px_hsl(var(--order-blue)/0.55),inset_0_1px_0_rgba(255,255,255,0.25)] ring-2 ring-white sm:h-[76px] sm:w-[76px]">
            <div className="absolute inset-1 rounded-full border border-white/35" />
            <div className="absolute inset-2 rounded-full border border-white/15" />
            <div className="relative flex flex-col items-center leading-none">
              <span className="text-[19px] font-black tracking-tight sm:text-[22px]">60</span>
              <span className="mt-0.5 text-[7px] font-bold uppercase tracking-[0.14em] sm:text-[8px]">
                Day
              </span>
              <span className="text-[6px] font-bold uppercase tracking-[0.16em] opacity-95 sm:text-[7px]">
                Guarantee
              </span>
            </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[hsl(var(--order-blue))]">
            Risk-Free Promise
          </p>
          <p className="mt-1 text-[14.5px] font-extrabold leading-snug tracking-tight text-[hsl(var(--text-strong))]">
            Try VitalWalk risk-free for 60 days.
          </p>
          <p className="mt-1 text-[12.5px] leading-snug text-[hsl(var(--text-body))]">
            Don't love them? Send them back for a{" "}
            <span className="font-semibold text-[hsl(var(--text-strong))]">full refund</span> — easy
            returns, no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
