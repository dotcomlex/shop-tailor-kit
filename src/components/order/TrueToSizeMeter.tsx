import { Info } from "lucide-react";

export function TrueToSizeMeter() {
  return (
    <div className="rounded-xl bg-secondary px-4 py-4 sm:px-5 sm:py-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[14px] font-extrabold tracking-tight text-[hsl(var(--text-strong))] sm:text-[15px]">
          How do they fit?
        </p>
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[hsl(var(--text-body))]">
          <Info className="h-3.5 w-3.5" strokeWidth={2.5} />
          Verified true-to-size
        </span>
      </div>

      {/* Track */}
      <div className="relative mt-4 h-1.5 w-full rounded-full bg-[hsl(var(--hairline))]">
        {/* Center dot */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border-[2.5px] border-[hsl(var(--text-strong))] bg-white">
            <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--text-strong))]" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="mt-3 grid grid-cols-3 text-center text-[11px] font-bold uppercase tracking-wide sm:text-[12px]">
        <span className="text-left text-[hsl(var(--text-mute))]">Runs Small</span>
        <span className="text-[hsl(var(--text-strong))]">True To Size</span>
        <span className="text-right text-[hsl(var(--text-mute))]">Runs Long</span>
      </div>
    </div>
  );
}
