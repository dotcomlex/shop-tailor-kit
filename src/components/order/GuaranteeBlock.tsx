export function GuaranteeBlock() {
  return (
    <div className="flex items-start gap-4">
      {/* Circle badge */}
      <div className="relative flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full bg-save text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,0.4)]">
        <div className="text-center leading-none">
          <div className="text-[18px] font-extrabold tracking-tight">100</div>
          <div className="text-[10px] font-bold uppercase tracking-wider">Day</div>
        </div>
        <div className="pointer-events-none absolute inset-1 rounded-full border border-white/30" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[14px] leading-relaxed text-[hsl(var(--text-body))]">
          <span className="font-bold text-[hsl(var(--text-strong))]">100 Day Money-Back Guarantee:</span>{" "}
          Feel safe knowing you are protected with a 100 day guarantee. Simply send the item(s) back in the
          original packaging to receive a full refund or replacement, less S&amp;H.
        </p>
      </div>
    </div>
  );
}
