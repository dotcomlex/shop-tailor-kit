interface StepHeaderProps {
  number: number;
  title: string;
  rightLabel?: string;
  subStrip?: string;
}

export function StepHeader({ number, title, rightLabel, subStrip }: StepHeaderProps) {
  return (
    <div className="overflow-hidden rounded-none shadow-[0_1px_0_rgba(0,0,0,0.04)] sm:rounded-lg">
      <div className="flex items-center justify-between bg-order-blue px-5 py-3 text-white sm:py-3.5">
        <div className="flex items-baseline gap-1.5 text-[18px] font-extrabold tracking-tight">
          <span>{number}.</span>
          <span>{title}</span>
        </div>
        {rightLabel && (
          <div className="text-[13.5px] font-semibold text-white/85 sm:text-[14px]">
            {rightLabel}
          </div>
        )}
      </div>
      {subStrip && (
        <div className="bg-order-blue-soft px-5 py-2 text-[14px] text-[hsl(var(--text-body))]">
          {subStrip}
        </div>
      )}
    </div>
  );
}
