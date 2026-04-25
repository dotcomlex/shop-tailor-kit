interface StepHeaderProps {
  number: number;
  title: string;
  rightLabel?: string;
  subStrip?: string;
}

export function StepHeader({ number, title, rightLabel, subStrip }: StepHeaderProps) {
  return (
    <div className="overflow-hidden rounded-md">
      <div className="flex items-center justify-between bg-order-blue px-4 py-3 text-white sm:px-5">
        <div className="text-[16px] sm:text-[17px]">
          <span className="font-bold">
            {number}. {title}
          </span>
        </div>
        {rightLabel && (
          <div className="text-[13px] font-normal opacity-90 sm:text-[14px]">{rightLabel}</div>
        )}
      </div>
      {subStrip && (
        <div className="bg-order-blue-soft px-4 py-2 text-[13px] italic text-[hsl(var(--text-mute))] sm:px-5">
          {subStrip}
        </div>
      )}
    </div>
  );
}
